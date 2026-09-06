import { Router, type IRouter, type NextFunction, type Response } from "express";
import { db, shopsTable, ordersTable, disputesTable, usersTable, affiliatesTable } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";

const router: IRouter = Router();

async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  if (!req.userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const [user] = await db.select({ role: usersTable.role }).from(usersTable).where(eq(usersTable.id, req.userId));
  if (!user || user.role !== "admin") { res.status(403).json({ error: "Admin access required" }); return; }
  next();
}

router.get("/admin/stats", requireAuth, requireAdmin, async (_req: AuthRequest, res): Promise<void> => {
  const [shopCount, orderCount, disputeCount, kolCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(shopsTable).where(eq(shopsTable.status, "active")),
    db.select({ count: sql<number>`count(*)::int` }).from(ordersTable),
    db.select({ count: sql<number>`count(*)::int` }).from(disputesTable).where(eq(disputesTable.status, "open")),
    db.select({ count: sql<number>`count(*)::int` }).from(affiliatesTable).where(eq(affiliatesTable.kolApplicationStatus, "pending")),
  ]);
  const [revenue] = await db.select({ total: sql<string>`coalesce(sum(total_amount::numeric), 0)::text` }).from(ordersTable).where(eq(ordersTable.status, "completed"));
  res.json({ activeShops: shopCount[0].count, totalOrders: orderCount[0].count, openDisputes: disputeCount[0].count, pendingKolApplications: kolCount[0].count, totalRevenue: revenue.total });
});

router.get("/admin/shops", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  const status = (req.query.status as string) ?? "pending";
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  if (!["all", "pending", "active", "suspended"].includes(status)) { res.status(400).json({ error: "Invalid status" }); return; }
  const where = status === "all" ? undefined : eq(shopsTable.status, status);
  const [items, countResult] = await Promise.all([
    db.select().from(shopsTable).where(where).orderBy(desc(shopsTable.createdAt)).limit(limit).offset((page - 1) * limit),
    db.select({ count: sql<number>`count(*)::int` }).from(shopsTable).where(where),
  ]);
  res.json({ items, total: countResult[0].count });
});

router.patch("/admin/shops/:shopId", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  const shopId = Number(req.params.shopId);
  if (!Number.isInteger(shopId) || shopId <= 0) { res.status(400).json({ error: "Invalid shopId" }); return; }
  const { status } = req.body;
  if (!status || !["active", "suspended", "pending"].includes(status)) { res.status(400).json({ error: "Invalid status" }); return; }
  const [updated] = await db.update(shopsTable).set({ status }).where(eq(shopsTable.id, shopId)).returning();
  if (!updated) { res.status(404).json({ error: "Shop not found" }); return; }
  res.json(updated);
});

router.get("/admin/disputes", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  const status = (req.query.status as string) ?? "open";
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  if (!["all", "open", "notified", "reviewing", "admin_review", "resolved"].includes(status)) { res.status(400).json({ error: "Invalid status" }); return; }
  const where = status === "all" ? undefined : eq(disputesTable.status, status);
  const [items, countResult] = await Promise.all([
    db.select().from(disputesTable).where(where).orderBy(desc(disputesTable.createdAt)).limit(limit).offset((page - 1) * limit),
    db.select({ count: sql<number>`count(*)::int` }).from(disputesTable).where(where),
  ]);
  res.json({ items, total: countResult[0].count });
});

router.patch("/admin/disputes/:disputeId", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  const disputeId = Number(req.params.disputeId);
  if (!Number.isInteger(disputeId) || disputeId <= 0) { res.status(400).json({ error: "Invalid disputeId" }); return; }
  const { status, resolution, adminNote } = req.body;
  if (!status || !["notified", "reviewing", "admin_review", "resolved"].includes(status)) { res.status(400).json({ error: "Invalid status" }); return; }
  if (status === "resolved" && (!resolution || typeof resolution !== "string")) { res.status(400).json({ error: "resolution is required when resolving a dispute" }); return; }
  const updates: Record<string, unknown> = { status };
  if (resolution) updates.resolution = resolution;
  if (adminNote) updates.adminNote = adminNote;
  if (status === "resolved") updates.resolvedAt = new Date();
  const [updated] = await db.update(disputesTable).set(updates).where(eq(disputesTable.id, disputeId)).returning();
  if (!updated) { res.status(404).json({ error: "Dispute not found" }); return; }
  res.json(updated);
});

router.get("/admin/kol-applications", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  const status = (req.query.status as string) ?? "pending";
  if (!["all", "pending", "approved", "rejected"].includes(status)) { res.status(400).json({ error: "Invalid status" }); return; }
  const where = status === "all" ? undefined : eq(affiliatesTable.kolApplicationStatus, status);
  const items = await db.select({ id: affiliatesTable.id, userId: affiliatesTable.userId, referralCode: affiliatesTable.referralCode, tier: affiliatesTable.tier, channelUsername: affiliatesTable.channelUsername, status: affiliatesTable.kolApplicationStatus, appliedAt: affiliatesTable.kolAppliedAt, reviewNote: affiliatesTable.kolReviewNote }).from(affiliatesTable).where(where).orderBy(desc(affiliatesTable.kolAppliedAt)).limit(100);
  res.json({ items });
});

router.patch("/admin/kol-applications/:affiliateId", requireAuth, requireAdmin, async (req: AuthRequest, res): Promise<void> => {
  const affiliateId = Number(req.params.affiliateId);
  if (!Number.isInteger(affiliateId) || affiliateId <= 0) { res.status(400).json({ error: "Invalid affiliateId" }); return; }
  const { status, reviewNote } = req.body;
  if (!["approved", "rejected"].includes(status)) { res.status(400).json({ error: "Status must be approved or rejected" }); return; }
  if (reviewNote !== undefined && typeof reviewNote !== "string") { res.status(400).json({ error: "reviewNote must be a string" }); return; }
  const [existing] = await db.select().from(affiliatesTable).where(eq(affiliatesTable.id, affiliateId));
  if (!existing) { res.status(404).json({ error: "KOL application not found" }); return; }
  if (existing.kolApplicationStatus !== "pending") { res.status(409).json({ error: "Only pending applications can be reviewed" }); return; }
  const [updated] = await db.update(affiliatesTable).set({ kolApplicationStatus: status, kolReviewedAt: new Date(), kolReviewNote: reviewNote?.trim() || null, tier: status === "approved" ? "kol" : "standard" }).where(eq(affiliatesTable.id, affiliateId)).returning();
  res.json(updated);
});

export default router;
