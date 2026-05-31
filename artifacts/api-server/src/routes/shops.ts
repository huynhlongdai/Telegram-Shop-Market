import { Router, type IRouter } from "express";
import { db, shopsTable } from "@workspace/db";
import { eq, ilike, and, or, sql } from "drizzle-orm";
import { CreateShopBody, UpdateShopBody, GetShopParams, UpdateShopParams, ListShopsQueryParams } from "@workspace/api-zod";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";

const router: IRouter = Router();

router.get("/shops", async (req, res): Promise<void> => {
  const params = ListShopsQueryParams.safeParse(req.query);
  const page = params.success ? (params.data.page ?? 1) : 1;
  const limit = params.success ? (params.data.limit ?? 20) : 20;
  const search = params.success ? params.data.search : undefined;
  const offset = (page - 1) * limit;

  const where = and(
    eq(shopsTable.status, "active"),
    search ? ilike(shopsTable.name, `%${search}%`) : undefined,
  );

  const [items, countResult] = await Promise.all([
    db.select().from(shopsTable).where(where).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(shopsTable).where(where),
  ]);

  res.json({ items, total: countResult[0].count });
});

router.post("/shops", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = CreateShopBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select({ id: shopsTable.id })
    .from(shopsTable)
    .where(eq(shopsTable.slug, parsed.data.slug));

  if (existing) {
    res.status(409).json({ error: "Slug already taken" });
    return;
  }

  const [shop] = await db.insert(shopsTable).values({
    ownerId: req.userId!,
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description ?? null,
    plan: parsed.data.plan,
    walletAddress: parsed.data.walletAddress ?? null,
    telegramChannel: parsed.data.telegramChannel ?? null,
  }).returning();

  res.status(201).json(shop);
});

router.get("/shops/me", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const [shop] = await db.select().from(shopsTable).where(eq(shopsTable.ownerId, req.userId!));
  if (!shop) {
    res.status(404).json({ error: "No shop found" });
    return;
  }
  res.json(shop);
});

router.get("/shops/:shopId", async (req, res): Promise<void> => {
  const params = GetShopParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [shop] = await db.select().from(shopsTable).where(eq(shopsTable.id, params.data.shopId));
  if (!shop) {
    res.status(404).json({ error: "Shop not found" });
    return;
  }
  res.json(shop);
});

router.patch("/shops/:shopId", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = UpdateShopParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateShopBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [shop] = await db.select().from(shopsTable)
    .where(and(eq(shopsTable.id, params.data.shopId), eq(shopsTable.ownerId, req.userId!)));

  if (!shop) {
    res.status(404).json({ error: "Shop not found" });
    return;
  }

  const [updated] = await db.update(shopsTable)
    .set({ ...parsed.data })
    .where(eq(shopsTable.id, params.data.shopId))
    .returning();

  res.json(updated);
});

export default router;
