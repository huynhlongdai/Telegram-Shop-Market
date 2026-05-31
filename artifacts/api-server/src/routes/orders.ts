import { Router, type IRouter } from "express";
import { db, ordersTable, productsTable, shopsTable, vouchersTable, usersTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import {
  CreateOrderBody,
  GetOrderParams,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
  ListOrdersQueryParams,
} from "@workspace/api-zod";
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
  const offset = (page - 1) * limit;

  let shopId: number | undefined;
  if (role === "seller") {
    const [shop] = await db.select({ id: shopsTable.id }).from(shopsTable)
      .where(eq(shopsTable.ownerId, req.userId!));
    shopId = shop?.id;
  }

  const conditions = [
    role === "seller" && shopId ? eq(ordersTable.shopId, shopId) : eq(ordersTable.buyerId, req.userId!),
    status ? eq(ordersTable.status, status) : undefined,
  ].filter(Boolean);

  const where = and(...(conditions as Parameters<typeof and>));

  const [items, countResult] = await Promise.all([
    db.select().from(ordersTable).where(where).limit(limit).offset(offset)
      .orderBy(sql`${ordersTable.createdAt} DESC`),
    db.select({ count: sql<number>`count(*)::int` }).from(ordersTable).where(where),
  ]);

  res.json({ items, total: countResult[0].count });
});

router.post("/orders", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [product] = await db.select().from(productsTable)
    .where(and(eq(productsTable.id, parsed.data.productId), eq(productsTable.status, "active")));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  if (product.stock < parsed.data.quantity) {
    res.status(400).json({ error: "Insufficient stock" });
    return;
  }

  const unitPrice = Number(product.flashSaleEnd && new Date(product.flashSaleEnd) > new Date()
    ? product.flashSalePrice ?? product.price
    : product.price);

  let totalAmount = unitPrice * parsed.data.quantity;
  let discountAmount: number | undefined;
  let voucherCode: string | undefined;

  if (parsed.data.voucherCode) {
    const [voucher] = await db.select().from(vouchersTable)
      .where(and(
        eq(vouchersTable.code, parsed.data.voucherCode),
        eq(vouchersTable.isActive, true),
      ));

    if (voucher && (!voucher.expiresAt || new Date(voucher.expiresAt) > new Date())) {
      if (!voucher.maxUses || voucher.usedCount < voucher.maxUses) {
        if (!voucher.minOrderAmount || totalAmount >= Number(voucher.minOrderAmount)) {
          if (voucher.discountType === "percent") {
            discountAmount = totalAmount * (Number(voucher.discountValue) / 100);
          } else {
            discountAmount = Number(voucher.discountValue);
          }
          totalAmount = Math.max(0, totalAmount - discountAmount);
          voucherCode = voucher.code;

          await db.update(vouchersTable)
            .set({ usedCount: voucher.usedCount + 1 })
            .where(eq(vouchersTable.id, voucher.id));
        }
      }
    }
  }

  const commission = await resolveCommission(totalAmount, product.shopId);

  const warrantyType = product.warrantyType ?? "standard";
  const escrowReleaseDays = product.escrowReleaseDays ?? 3;

  let escrowReleaseAt: Date | null = null;
  if (warrantyType === "none") {
    escrowReleaseAt = new Date(Date.now() + escrowReleaseDays * 24 * 60 * 60 * 1000);
  }

  const [order] = await db.insert(ordersTable).values({
    buyerId: req.userId!,
    shopId: product.shopId,
    productId: product.id,
    quantity: parsed.data.quantity,
    totalAmount: String(totalAmount),
    currency: product.currency,
    status: "pending",
    warrantyType,
    escrowStatus: "holding",
    escrowReleaseAt,
    commissionPercent: String(commission.commissionPercent),
    commissionAmount: commission.commissionAmount.toFixed(6),
    deliveryAddress: parsed.data.deliveryAddress ?? null,
    note: parsed.data.note ?? null,
    voucherCode: voucherCode ?? null,
    discountAmount: discountAmount ? String(discountAmount) : null,
  }).returning();

  await db.update(productsTable)
    .set({ stock: product.stock - parsed.data.quantity })
    .where(eq(productsTable.id, product.id));

  const [shop] = await db
    .select({ botToken: shopsTable.botToken, notificationChatId: shopsTable.notificationChatId })
    .from(shopsTable)
    .where(eq(shopsTable.id, product.shopId));

  if (shop?.botToken && shop?.notificationChatId) {
    const [buyer] = await db.select({ username: usersTable.username }).from(usersTable)
      .where(eq(usersTable.id, req.userId!));

    const text = buildOrderNotification({
      orderId: order.id,
      productName: product.name,
      quantity: parsed.data.quantity,
      totalAmount: String(totalAmount),
      currency: product.currency,
      buyerUsername: buyer?.username,
      warrantyType,
      escrowReleaseDays,
    });

    setImmediate(() => {
      sendTelegramMessage({ botToken: shop.botToken!, chatId: shop.notificationChatId!, text });
    });
  }

  res.status(201).json(order);
});

router.get("/orders/:orderId", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db.select().from(ordersTable)
    .where(eq(ordersTable.id, params.data.orderId));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const [shop] = await db.select({ ownerId: shopsTable.ownerId }).from(shopsTable)
    .where(eq(shopsTable.id, order.shopId));

  const isOwner = order.buyerId === req.userId || shop?.ownerId === req.userId;
  if (!isOwner) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  res.json(order);
});

router.patch("/orders/:orderId/status", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = UpdateOrderStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [order] = await db.select().from(ordersTable)
    .where(eq(ordersTable.id, params.data.orderId));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const [shop] = await db.select({
    ownerId: shopsTable.ownerId,
    botToken: shopsTable.botToken,
    notificationChatId: shopsTable.notificationChatId,
  }).from(shopsTable).where(eq(shopsTable.id, order.shopId));

  const isBuyer = order.buyerId === req.userId;
  const isSeller = shop?.ownerId === req.userId;

  if (!isBuyer && !isSeller) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  const updates: Record<string, unknown> = { status: parsed.data.status };
  if (parsed.data.txHash) updates.txHash = parsed.data.txHash;

  if (parsed.data.status === "completed") {
    updates.escrowStatus = "released";
  } else if (parsed.data.status === "disputed") {
    updates.escrowStatus = "disputed";
  }

  const [updated] = await db.update(ordersTable)
    .set(updates)
    .where(eq(ordersTable.id, params.data.orderId))
    .returning();

  if (shop?.botToken && shop?.notificationChatId) {
    const [product] = await db.select({ name: productsTable.name }).from(productsTable)
      .where(eq(productsTable.id, order.productId));

    const text = buildOrderNotification({
      orderId: order.id,
      productName: product?.name ?? "Unknown",
      quantity: order.quantity,
      totalAmount: order.totalAmount,
      currency: order.currency,
      warrantyType: order.warrantyType,
      status: parsed.data.status,
    });

    setImmediate(() => {
      sendTelegramMessage({ botToken: shop.botToken!, chatId: shop.notificationChatId!, text });
    });
  }

  res.json(updated);
});

export default router;
