import { Router, type IRouter } from "express";
import { db, shopsTable, ordersTable, disputesTable, usersTable } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";

const router: IRouter = Router();

function requireAdmin(req: AuthRequest, res: any, next: any): void {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.get("/admin/stats", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  const [shopCount, orderCount, disputeCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(shopsTable).where(eq(shopsTable.status, "active")),
    db.select({ count: sql<number>`count(*)::int` }).from(ordersTable),
    db.select({ count: sql<number>`count(*)::int` }).from(disputesTable).where(eq(disputesTable.status, "open")),
  ]);

  const [revenue] = await db
    .select({ total: sql<string>`coalesce(sum(total_amount::numeric), 0)::text` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "completed"));

  res.json({
    activeShops: shopCount[0].count,
    totalOrders: orderCount[0].count,
    openDisputes: disputeCount[0].count,
    totalRevenue: revenue.total,
  });
});

router.get("/admin/shops", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  const status = (req.query.status as string) ?? "pending";
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const offset = (page - 1) * limit;

  const where = status === "all" ? undefined : eq(shopsTable.status, status);

  const [items, countResult] = await Promise.all([
    db.select().from(shopsTable).where(where).orderBy(desc(shopsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(shopsTable).where(where),
  ]);

  res.json({ items, total: countResult[0].count });
});

router.patch("/admin/shops/:shopId", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  const shopId = Number(req.params.shopId);
  if (isNaN(shopId)) {
    res.status(400).json({ error: "Invalid shopId" });
    return;
  }

  const { status } = req.body;
  if (!status || !["active", "suspended", "pending"].includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  const [updated] = await db.update(shopsTable)
    .set({ status })
    .where(eq(shopsTable.id, shopId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Shop not found" });
    return;
  }

  res.json(updated);
});

router.get("/admin/disputes", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  const status = (req.query.status as string) ?? "open";
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const offset = (page - 1) * limit;

  const where = status === "all" ? undefined : eq(disputesTable.status, status);

  const [items, countResult] = await Promise.all([
    db.select().from(disputesTable).where(where).orderBy(desc(disputesTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(disputesTable).where(where),
  ]);

  res.json({ items, total: countResult[0].count });
});

router.patch("/admin/disputes/:disputeId", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  const disputeId = Number(req.params.disputeId);
  if (isNaN(disputeId)) {
    res.status(400).json({ error: "Invalid disputeId" });
    return;
  }

  const { status, resolution, adminNote } = req.body;
  if (!status) {
    res.status(400).json({ error: "status is required" });
    return;
  }

  const updates: Record<string, unknown> = { status };
  if (resolution) updates.resolution = resolution;
  if (adminNote) updates.adminNote = adminNote;
  if (status === "resolved") updates.resolvedAt = new Date();

  const [updated] = await db.update(disputesTable)
    .set(updates)
    .where(eq(disputesTable.id, disputeId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Dispute not found" });
    return;
  }

  res.json(updated);
});

export default router;
