import { Router, type IRouter } from "express";
import { and, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db, productsTable, shopsTable } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";

const router: IRouter = Router();
const FlashSaleBody = z.object({
  name: z.string().trim().min(2).max(80),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  products: z.array(z.object({ productId: z.number().int().positive(), salePrice: z.string().regex(/^\d+(\.\d{1,6})?$/) })).min(1).max(100),
});

router.post("/flash-sales", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = FlashSaleBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid campaign" }); return; }
  const start = new Date(parsed.data.startTime);
  const end = new Date(parsed.data.endTime);
  if (end <= start) { res.status(400).json({ error: "End time must be after start time" }); return; }
  const ids = [...new Set(parsed.data.products.map((item) => item.productId))];
  if (ids.length !== parsed.data.products.length) { res.status(400).json({ error: "Duplicate products are not allowed" }); return; }

  const [shop] = await db.select({ id: shopsTable.id }).from(shopsTable).where(eq(shopsTable.ownerId, req.userId!));
  if (!shop) { res.status(403).json({ error: "You do not have a shop" }); return; }
  const owned = await db.select({ id: productsTable.id, price: productsTable.price }).from(productsTable).where(and(eq(productsTable.shopId, shop.id), eq(productsTable.status, "active"), inArray(productsTable.id, ids)));
  if (owned.length !== ids.length) { res.status(403).json({ error: "One or more products are unavailable or not owned by this shop" }); return; }
  const regularPrices = new Map(owned.map((item) => [item.id, Number(item.price)]));
  for (const item of parsed.data.products) {
    const salePrice = Number(item.salePrice);
    if (!Number.isFinite(salePrice) || salePrice <= 0 || salePrice >= (regularPrices.get(item.productId) ?? 0)) { res.status(400).json({ error: `Sale price for product ${item.productId} must be lower than its regular price` }); return; }
  }

  await db.transaction(async (tx) => {
    for (const item of parsed.data.products) {
      await tx.update(productsTable).set({ flashSaleName: parsed.data.name, flashSalePrice: item.salePrice, flashSaleStart: start, flashSaleEnd: end }).where(and(eq(productsTable.id, item.productId), eq(productsTable.shopId, shop.id)));
    }
  });
  res.status(201).json({ name: parsed.data.name, startTime: start.toISOString(), endTime: end.toISOString(), productCount: ids.length });
});

router.get("/flash-sales/me", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const [shop] = await db.select({ id: shopsTable.id }).from(shopsTable).where(eq(shopsTable.ownerId, req.userId!));
  if (!shop) { res.status(404).json({ error: "No shop found" }); return; }
  const items = await db.select({ productId: productsTable.id, productName: productsTable.name, campaignName: productsTable.flashSaleName, salePrice: productsTable.flashSalePrice, startTime: productsTable.flashSaleStart, endTime: productsTable.flashSaleEnd }).from(productsTable).where(and(eq(productsTable.shopId, shop.id), sql`${productsTable.flashSaleEnd} IS NOT NULL`));
  res.json({ items });
});

export default router;
