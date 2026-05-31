import { Router, type IRouter } from "express";
import { db, disputesTable, ordersTable, shopsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";
import { z } from "zod";

const router: IRouter = Router();

const OpenDisputeBody = z.object({
  reason: z.string().min(10),
});

const AddEvidenceBody = z.object({
  note: z.string().optional(),
  role: z.enum(["buyer", "seller"]),
});

router.post("/orders/:orderId/dispute", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const orderId = Number(req.params.orderId);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid orderId" });
    return;
  }

  const parsed = OpenDisputeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const [shop] = await db.select({ ownerId: shopsTable.ownerId }).from(shopsTable)
    .where(eq(shopsTable.id, order.shopId));

  const isBuyer = order.buyerId === req.userId;
  const isSeller = shop?.ownerId === req.userId;

  if (!isBuyer && !isSeller) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  const [existing] = await db.select().from(disputesTable).where(eq(disputesTable.orderId, orderId));
  if (existing) {
    res.status(409).json({ error: "Dispute already exists for this order" });
    return;
  }

  const [dispute] = await db.insert(disputesTable).values({
    orderId,
    openedById: req.userId!,
    status: "open",
    buyerNote: isBuyer ? parsed.data.reason : null,
    sellerNote: isSeller ? parsed.data.reason : null,
  }).returning();

  await db.update(ordersTable)
    .set({ status: "disputed", escrowStatus: "disputed" })
    .where(eq(ordersTable.id, orderId));

  res.status(201).json(dispute);
});

router.get("/orders/:orderId/dispute", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const orderId = Number(req.params.orderId);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid orderId" });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
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

  const [dispute] = await db.select().from(disputesTable).where(eq(disputesTable.orderId, orderId));
  if (!dispute) {
    res.status(404).json({ error: "No dispute found for this order" });
    return;
  }

  res.json(dispute);
});

router.patch("/orders/:orderId/dispute", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const orderId = Number(req.params.orderId);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid orderId" });
    return;
  }

  const parsed = AddEvidenceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [dispute] = await db.select().from(disputesTable).where(eq(disputesTable.orderId, orderId));
  if (!dispute) {
    res.status(404).json({ error: "Dispute not found" });
    return;
  }

  if (dispute.openedById !== req.userId) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.role === "buyer" && parsed.data.note) updates.buyerNote = parsed.data.note;
  if (parsed.data.role === "seller" && parsed.data.note) updates.sellerNote = parsed.data.note;

  const [updated] = await db.update(disputesTable)
    .set(updates)
    .where(eq(disputesTable.orderId, orderId))
    .returning();

  res.json(updated);
});

export default router;
