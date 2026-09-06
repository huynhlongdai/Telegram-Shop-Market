import { Router, type IRouter } from "express";
import { db, productsTable, shopsTable } from "@workspace/db";
import { eq, ilike, and, sql } from "drizzle-orm";
import { CreateProductBody, UpdateProductBody, GetProductParams, UpdateProductParams, DeleteProductParams, ListProductsQueryParams } from "@workspace/api-zod";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const params = ListProductsQueryParams.safeParse(req.query);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const page = params.data.page ?? 1;
  const limit = params.data.limit ?? 20;
  const conditions = [
    eq(productsTable.status, "active"),
    params.data.search ? ilike(productsTable.name, `%${params.data.search}%`) : undefined,
    params.data.category ? eq(productsTable.category, params.data.category) : undefined,
    params.data.shopId ? eq(productsTable.shopId, params.data.shopId) : undefined,
    params.data.flashSale ? sql`${productsTable.flashSaleEnd} > NOW() AND (${productsTable.flashSaleStart} IS NULL OR ${productsTable.flashSaleStart} <= NOW())` : undefined,
  ].filter(Boolean);
  const where = and(...(conditions as Parameters<typeof and>));
  const [items, countResult] = await Promise.all([
    db.select().from(productsTable).where(where).limit(limit).offset((page - 1) * limit),
    db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(where),
  ]);
  res.json({ items, total: countResult[0].count });
});

router.post("/products", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [shop] = await db.select().from(shopsTable).where(eq(shopsTable.ownerId, req.userId!));
  if (!shop) { res.status(403).json({ error: "You do not have a shop" }); return; }
  const [product] = await db.insert(productsTable).values({ shopId: shop.id, name: parsed.data.name, description: parsed.data.description ?? null, price: parsed.data.price, currency: parsed.data.currency, imageUrl: parsed.data.imageUrl ?? null, category: parsed.data.category ?? null, stock: parsed.data.stock }).returning();
  res.status(201).json(product);
});

router.get("/products/:productId", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.productId));
  if (!product) { res.status(404).json({ error: "Product not found" }); return; }
  res.json(product);
});

router.patch("/products/:productId", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  const parsed = UpdateProductBody.safeParse(req.body);
  if (!params.success || !parsed.success) { res.status(400).json({ error: "Invalid product update" }); return; }
  const [product] = await db.select({ id: productsTable.id, shopId: productsTable.shopId }).from(productsTable).where(eq(productsTable.id, params.data.productId));
  if (!product) { res.status(404).json({ error: "Product not found" }); return; }
  const [shop] = await db.select({ id: shopsTable.id }).from(shopsTable).where(and(eq(shopsTable.id, product.shopId), eq(shopsTable.ownerId, req.userId!)));
  if (!shop) { res.status(403).json({ error: "Not authorized" }); return; }
  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.flashSaleEnd) updates.flashSaleEnd = new Date(parsed.data.flashSaleEnd);
  const [updated] = await db.update(productsTable).set(updates).where(eq(productsTable.id, params.data.productId)).returning();
  res.json(updated);
});

router.delete("/products/:productId", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [product] = await db.select({ id: productsTable.id, shopId: productsTable.shopId }).from(productsTable).where(eq(productsTable.id, params.data.productId));
  if (!product) { res.status(404).json({ error: "Product not found" }); return; }
  const [shop] = await db.select({ id: shopsTable.id }).from(shopsTable).where(and(eq(shopsTable.id, product.shopId), eq(shopsTable.ownerId, req.userId!)));
  if (!shop) { res.status(403).json({ error: "Not authorized" }); return; }
  await db.delete(productsTable).where(eq(productsTable.id, params.data.productId));
  res.sendStatus(204);
});

export default router;
