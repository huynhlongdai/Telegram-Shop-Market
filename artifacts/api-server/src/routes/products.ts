import { Router, type IRouter } from "express";
import { db, productsTable, shopsTable } from "@workspace/db";
import { eq, ilike, and, sql } from "drizzle-orm";
import {
  CreateProductBody,
  UpdateProductBody,
  GetProductParams,
  UpdateProductParams,
  DeleteProductParams,
  ListProductsQueryParams,
} from "@workspace/api-zod";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const params = ListProductsQueryParams.safeParse(req.query);
  const page = params.success ? (params.data.page ?? 1) : 1;
  const limit = params.success ? (params.data.limit ?? 20) : 20;
  const search = params.success ? params.data.search : undefined;
  const category = params.success ? params.data.category : undefined;
  const shopId = params.success ? params.data.shopId : undefined;
  const flashSale = params.success ? params.data.flashSale : undefined;
  const offset = (page - 1) * limit;

  const conditions = [
    eq(productsTable.status, "active"),
    search ? ilike(productsTable.name, `%${search}%`) : undefined,
    category ? eq(productsTable.category, category) : undefined,
    shopId ? eq(productsTable.shopId, shopId) : undefined,
    flashSale ? sql`${productsTable.flashSaleEnd} > NOW()` : undefined,
  ].filter(Boolean);

  const where = conditions.length > 0 ? and(...(conditions as Parameters<typeof and>)) : undefined;

  const [items, countResult] = await Promise.all([
    db.select().from(productsTable).where(where).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(where),
  ]);

  res.json({ items, total: countResult[0].count });
});

router.post("/products", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [shop] = await db.select().from(shopsTable).where(eq(shopsTable.ownerId, req.userId!));
  if (!shop) {
    res.status(403).json({ error: "You do not have a shop" });
    return;
  }

  const [product] = await db.insert(productsTable).values({
    shopId: shop.id,
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    price: parsed.data.price,
    currency: parsed.data.currency,
    imageUrl: parsed.data.imageUrl ?? null,
    category: parsed.data.category ?? null,
    stock: parsed.data.stock,
  }).returning();

  res.status(201).json(product);
});

router.get("/products/:productId", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db.select().from(productsTable)
    .where(eq(productsTable.id, params.data.productId));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

router.patch("/products/:productId", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [product] = await db.select({ id: productsTable.id, shopId: productsTable.shopId })
    .from(productsTable)
    .where(eq(productsTable.id, params.data.productId));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const [shop] = await db.select({ id: shopsTable.id }).from(shopsTable)
    .where(and(eq(shopsTable.id, product.shopId), eq(shopsTable.ownerId, req.userId!)));

  if (!shop) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.flashSaleEnd) {
    updates.flashSaleEnd = new Date(parsed.data.flashSaleEnd);
  }

  const [updated] = await db.update(productsTable)
    .set(updates)
    .where(eq(productsTable.id, params.data.productId))
    .returning();

  res.json(updated);
});

router.delete("/products/:productId", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db.select({ id: productsTable.id, shopId: productsTable.shopId })
    .from(productsTable)
    .where(eq(productsTable.id, params.data.productId));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const [shop] = await db.select({ id: shopsTable.id }).from(shopsTable)
    .where(and(eq(shopsTable.id, product.shopId), eq(shopsTable.ownerId, req.userId!)));

  if (!shop) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  await db.delete(productsTable).where(eq(productsTable.id, params.data.productId));
  res.sendStatus(204);
});

export default router;
