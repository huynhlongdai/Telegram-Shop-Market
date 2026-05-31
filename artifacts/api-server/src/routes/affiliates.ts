import { Router, type IRouter } from "express";
import { db, affiliatesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";
import { nanoid } from "../lib/nanoid.js";

const router: IRouter = Router();

router.get("/affiliates/me", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const [affiliate] = await db.select().from(affiliatesTable)
    .where(eq(affiliatesTable.userId, req.userId!));

  if (!affiliate) {
    res.status(404).json({ error: "Not enrolled in affiliate program" });
    return;
  }

  res.json(affiliate);
});

router.post("/affiliates/me", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const [existing] = await db.select().from(affiliatesTable)
    .where(eq(affiliatesTable.userId, req.userId!));

  if (existing) {
    res.status(409).json({ error: "Already enrolled" });
    return;
  }

  const referralCode = "AFF" + nanoid(6).toUpperCase();

  const [affiliate] = await db.insert(affiliatesTable).values({
    userId: req.userId!,
    referralCode,
    tier: "standard",
    totalEarned: "0",
    pendingPayout: "0",
    totalReferrals: 0,
  }).returning();

  res.status(201).json(affiliate);
});

export default router;
