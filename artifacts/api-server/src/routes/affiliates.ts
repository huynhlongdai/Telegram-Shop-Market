import { Router, type IRouter } from "express";
import { db, affiliatesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";
import { nanoid } from "../lib/nanoid.js";

const router: IRouter = Router();
const KolApplicationBody = z.object({ channelUsername: z.string().trim().regex(/^@[A-Za-z0-9_]{5,32}$/, "Enter a valid public Telegram channel username") });

router.get("/affiliates/me", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const [affiliate] = await db.select().from(affiliatesTable).where(eq(affiliatesTable.userId, req.userId!));
  if (!affiliate) { res.status(404).json({ error: "Not enrolled in affiliate program" }); return; }
  res.json(affiliate);
});

router.post("/affiliates/me", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const [existing] = await db.select().from(affiliatesTable).where(eq(affiliatesTable.userId, req.userId!));
  if (existing) { res.status(409).json({ error: "Already enrolled" }); return; }
  const referralCode = "AFF" + nanoid(6).toUpperCase();
  const [affiliate] = await db.insert(affiliatesTable).values({ userId: req.userId!, referralCode, tier: "standard", totalEarned: "0", pendingPayout: "0", totalReferrals: 0 }).returning();
  res.status(201).json(affiliate);
});

router.get("/affiliates/me/kol", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const [affiliate] = await db.select({
    affiliateId: affiliatesTable.id,
    tier: affiliatesTable.tier,
    channelUsername: affiliatesTable.channelUsername,
    status: affiliatesTable.kolApplicationStatus,
    appliedAt: affiliatesTable.kolAppliedAt,
    reviewedAt: affiliatesTable.kolReviewedAt,
    reviewNote: affiliatesTable.kolReviewNote,
  }).from(affiliatesTable).where(eq(affiliatesTable.userId, req.userId!));
  if (!affiliate) { res.status(404).json({ error: "Activate an affiliate account first" }); return; }
  res.json(affiliate);
});

router.post("/affiliates/me/kol", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = KolApplicationBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid channel" }); return; }

  const [affiliate] = await db.select().from(affiliatesTable).where(eq(affiliatesTable.userId, req.userId!));
  if (!affiliate) { res.status(404).json({ error: "Activate an affiliate account first" }); return; }
  if (affiliate.kolApplicationStatus === "pending") { res.status(409).json({ error: "A KOL application is already under review" }); return; }
  if (affiliate.tier === "kol" || affiliate.kolApplicationStatus === "approved") { res.status(409).json({ error: "KOL status is already active" }); return; }

  const [updated] = await db.update(affiliatesTable).set({
    channelUsername: parsed.data.channelUsername,
    kolApplicationStatus: "pending",
    kolAppliedAt: new Date(),
    kolReviewedAt: null,
    kolReviewNote: null,
  }).where(eq(affiliatesTable.id, affiliate.id)).returning();

  res.status(201).json({ affiliateId: updated.id, tier: updated.tier, channelUsername: updated.channelUsername, status: updated.kolApplicationStatus, appliedAt: updated.kolAppliedAt, reviewedAt: updated.kolReviewedAt, reviewNote: updated.kolReviewNote });
});

export default router;
