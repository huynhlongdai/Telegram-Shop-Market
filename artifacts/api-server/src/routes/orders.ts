import { Router, type IRouter } from "express";
import { db, ordersTable, productsTable, shopsTable, vouchersTable, usersTable } from "@workspace/db";
import { eq, and, sql, gte } from "drizzle-orm";
import { CreateOrderBody, GetOrderParams, UpdateOrderStatusParams, UpdateOrderStatusBody, ListOrdersQueryParams } from "@workspace/api-zod";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";
import { resolveCommission } from "./commission.js";
import { sendTelegramMessage, buildOrderNotification } from "../lib/telegram.js";

const router: IRouter = Router();

router.get("/orders", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = ListOrdersQueryParams.safeParse(req.query);
  const page = params.success ? (params.data.page ?? 1) : 1;
  const limit = params.success ? (params.data.limit ?? 20) : 20;
  const role = params.success ? params.data.role : undefined;
  const status = params.success ? params.data.status : undefined;
  let shopId: number | undefined;
  if (role === "seller") {
    const [shop] = await db.select({ id: shopsTable.id }).from(shopsTable).where(eq(shopsTable.ownerId, req.userId!));
    shopId = shop?.id;
    if (!shopId) { res.json({ items: [], total: 0 }); return; }
  }
  const conditions = [role === "seller" ? eq(ordersTable.shopId, shopId!) : eq(ordersTable.buyerId, req.userId!), status ? eq(ordersTable.status, status) : undefined].filter(Boolean);
  const where = and(...(conditions as Parameters<typeof and>));
  const [items, countResult] = await Promise.all([
    db.select().from(ordersTable).where(where).limit(limit).offset((page - 1) * limit).orderBy(sql`${ordersTable.createdAt} DESC`),
    db.select({ count: sql<number>`count(*)::int` }).from(ordersTable).where(where),
  ]);
  res.json({ items, total: countResult[0].count });
});

router.post("/orders", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [product] = await db.select().from(productsTable).where(and(eq(productsTable.id, parsed.data.productId), eq(productsTable.status, "active")));
  if (!product) { res.status(404).json({ error: "Product not found" }); return; }

  const now = new Date();
  const unitPrice = Number(product.flashSaleEnd && product.flashSaleEnd > now ? product.flashSalePrice ?? product.price : product.price);
  let totalAmount = unitPrice * parsed.data.quantity;
  let discountAmount: number | undefined;
  let voucher: typeof vouchersTable.$inferSelect | undefined;

  if (parsed.data.voucherCode) {
    [voucher] = await db.select().from(vouchersTable).where(and(eq(vouchersTable.code, parsed.data.voucherCode), eq(vouchersTable.isActive, true)));
    const valid = voucher && (!voucher.expiresAt || voucher.expiresAt > now) && (!voucher.maxUses || voucher.usedCount < voucher.maxUses) && (!voucher.minOrderAmount || totalAmount >= Number(voucher.minOrderAmount));
    if (!valid) { res.status(400).json({ error: "Voucher is invalid or no longer available" }); return; }
    discountAmount = voucher.discountType === "percent" ? totalAmount * (Number(voucher.discountValue) / 100) : Number(voucher.discountValue);
    totalAmount = Math.max(0, totalAmount - discountAmount);
  }

  const commission = await resolveCommission(totalAmount, product.shopId);
  const warrantyType = product.warrantyType ?? "standard";
  const escrowReleaseDays = product.escrowReleaseDays ?? 3;
  const escrowReleaseAt = warrantyType === "none" ? new Date(Date.now() + escrowReleaseDays * 86400000) : null;

  try {
    const order = await db.transaction(async (tx) => {
      const [reserved] = await tx.update(productsTable)
        .set({ stock: sql`${productsTable.stock} - ${parsed.data.quantity}` })
        .where(and(eq(productsTable.id, product.id), eq(productsTable.status, "active"), gte(productsTable.stock, parsed.data.quantity)))
        .returning({ id: productsTable.id });
      if (!reserved) throw new Error("INSUFFICIENT_STOCK");

      if (voucher) {
        const [claimed] = await tx.update(vouchersTable)
          .set({ usedCount: sql`${vouchersTable.usedCount} + 1` })
          .where(and(eq(vouchersTable.id, voucher.id), eq(vouchersTable.usedCount, voucher.usedCount)))
          .returning({ id: vouchersTable.id });
        if (!claimed) throw new Error("VOUCHER_CONFLICT");
      }

      const [created] = await tx.insert(ordersTable).values({
        buyerId: req.userId!, shopId: product.shopId, productId: product.id, quantity: parsed.data.quantity,
        totalAmount: String(totalAmount), currency: product.currency, status: "pending", warrantyType,
        escrowStatus: "holding", escrowReleaseAt, commissionPercent: String(commission.commissionPercent),
        commissionAmount: commission.commissionAmount.toFixed(6), deliveryAddress: parsed.data.deliveryAddress ?? null,
        note: parsed.data.note ?? null, voucherCode: voucher?.code ?? null,
        discountAmount: discountAmount ? String(discountAmount) : null,
      }).returning();
      return created;
    });

    const [shop] = await db.select({ botToken: shopsTable.botToken, notificationChatId: shopsTable.notificationChatId }).from(shopsTable).where(eq(shopsTable.id, product.shopId));
    if (shop?.botToken && shop?.notificationChatId) {
      const [buyer] = await db.select({ username: usersTable.username }).from(usersTable).where(eq(usersTable.id, req.userId!));
      const text = buildOrderNotification({ orderId: order.id, productName: product.name, quantity: parsed.data.quantity, totalAmount: String(totalAmount), currency: product.currency, buyerUsername: buyer?.username, warrantyType, escrowReleaseDays });
      setImmediate(() => sendTelegramMessage({ botToken: shop.botToken!, chatId: shop.notificationChatId!, text }));
    }
    res.status(201).json(order);
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "INSUFFICIENT_STOCK") { res.status(409).json({ error: "Insufficient stock" }); return; }
    if (code === "VOUCHER_CONFLICT") { res.status(409).json({ error: "Voucher was claimed by another order" }); return; }
    throw error;
  }
});

router.get("/orders/:orderId", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.orderId));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  const [shop] = await db.select({ ownerId: shopsTable.ownerId }).from(shopsTable).where(eq(shopsTable.id, order.shopId));
  if (order.buyerId !== req.userId && shop?.ownerId !== req.userId) { res.status(403).json({ error: "Not authorized" }); return; }
  res.json(order);
});

router.patch("/orders/:orderId/status", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = UpdateOrderStatusParams.safeParse(req.params);
  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!params.success || !parsed.success) { res.status(400).json({ error: "Invalid status update" }); return; }
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.orderId));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  const [shop] = await db.select({ ownerId: shopsTable.ownerId, botToken: shopsTable.botToken, notificationChatId: shopsTable.notificationChatId }).from(shopsTable).where(eq(shopsTable.id, order.shopId));
  const isBuyer = order.buyerId === req.userId;
  const isSeller = shop?.ownerId === req.userId;
  if (!isBuyer && !isSeller) { res.status(403).json({ error: "Not authorized" }); return; }

  const nextStatus = parsed.data.status;
  const allowed = (isSeller && order.status === "confirmed" && nextStatus === "shipped") || (isBuyer && order.status === "shipped" && nextStatus === "completed") || (isBuyer && order.status === "pending" && nextStatus === "cancelled");
  if (!allowed) { res.status(409).json({ error: `Transition ${order.status} → ${nextStatus} is not allowed for this account` }); return; }

  const updated = await db.transaction(async (tx) => {
    const updates: Record<string, unknown> = { status: nextStatus };
    if (nextStatus === "completed") updates.escrowStatus = "released";
    const [changed] = await tx.update(ordersTable).set(updates).where(and(eq(ordersTable.id, order.id), eq(ordersTable.status, order.status))).returning();
    if (!changed) throw new Error("ORDER_CONFLICT");
    if (nextStatus === "cancelled") {
      await tx.update(productsTable).set({ stock: sql`${productsTable.stock} + ${order.quantity}` }).where(eq(productsTable.id, order.productId));
      if (order.voucherCode) await tx.update(vouchersTable).set({ usedCount: sql`greatest(${vouchersTable.usedCount} - 1, 0)` }).where(eq(vouchersTable.code, order.voucherCode));
    }
    return changed;
  }).catch((error) => error instanceof Error && error.message === "ORDER_CONFLICT" ? null : Promise.reject(error));
  if (!updated) { res.status(409).json({ error: "Order changed; refresh and try again" }); return; }

  if (shop?.botToken && shop?.notificationChatId) {
    const [product] = await db.select({ name: productsTable.name }).from(productsTable).where(eq(productsTable.id, order.productId));
    const text = buildOrderNotification({ orderId: order.id, productName: product?.name ?? "Unknown", quantity: order.quantity, totalAmount: order.totalAmount, currency: order.currency, warrantyType: order.warrantyType, status: nextStatus });
    setImmediate(() => sendTelegramMessage({ botToken: shop.botToken!, chatId: shop.notificationChatId!, text }));
  }
  res.json(updated);
});

export default router;
