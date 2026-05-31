import { Router, type IRouter } from "express";
import { db, vouchersTable, shopsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  CreateVoucherBody,
  ValidateVoucherBody,
} from "@workspace/api-zod";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";

const router: IRouter = Router();

router.post("/vouchers/validate", async (req, res): Promise<void> => {
  const parsed = ValidateVoucherBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const conditions = [
    eq(vouchersTable.code, parsed.data.code),
    eq(vouchersTable.isActive, true),
  ];

  if (parsed.data.shopId) {
    conditions.push(eq(vouchersTable.shopId, parsed.data.shopId));
  }

  const [voucher] = await db.select().from(vouchersTable).where(and(...conditions));

  if (!voucher) {
    res.status(404).json({ error: "Voucher not found or inactive" });
    return;
  }

  if (voucher.expiresAt && new Date(voucher.expiresAt) < new Date()) {
    res.status(404).json({ error: "Voucher has expired" });
    return;
  }

  if (voucher.maxUses && voucher.usedCount >= voucher.maxUses) {
    res.status(404).json({ error: "Voucher usage limit reached" });
    return;
  }

  const orderAmount = Number(parsed.data.orderAmount);
  if (voucher.minOrderAmount && orderAmount < Number(voucher.minOrderAmount)) {
    res.status(400).json({ error: `Minimum order amount is ${voucher.minOrderAmount}` });
    return;
  }

  let discountAmount: number;
  if (voucher.discountType === "percent") {
    discountAmount = orderAmount * (Number(voucher.discountValue) / 100);
  } else {
    discountAmount = Number(voucher.discountValue);
  }

  const finalAmount = Math.max(0, orderAmount - discountAmount);

  res.json({
    valid: true,
    voucher,
    discountAmount: String(discountAmount),
    finalAmount: String(finalAmount),
  });
});

router.get("/vouchers", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const [shop] = await db.select({ id: shopsTable.id }).from(shopsTable)
    .where(eq(shopsTable.ownerId, req.userId!));

  if (!shop) {
    res.status(403).json({ error: "You do not have a shop" });
    return;
  }

  const items = await db.select().from(vouchersTable)
    .where(eq(vouchersTable.shopId, shop.id));

  res.json({ items });
});

router.post("/vouchers", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = CreateVoucherBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [shop] = await db.select({ id: shopsTable.id }).from(shopsTable)
    .where(eq(shopsTable.ownerId, req.userId!));

  if (!shop) {
    res.status(403).json({ error: "You do not have a shop" });
    return;
  }

  const [voucher] = await db.insert(vouchersTable).values({
    shopId: shop.id,
    code: parsed.data.code.toUpperCase(),
    discountType: parsed.data.discountType,
    discountValue: parsed.data.discountValue,
    minOrderAmount: parsed.data.minOrderAmount ?? null,
    maxUses: parsed.data.maxUses ?? null,
    expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
  }).returning();

  res.status(201).json(voucher);
});

export default router;
