import { Router, type IRouter } from "express";
import { db, commissionTiersTable, shopsTable } from "@workspace/db";
import { eq, and, isNull, or } from "drizzle-orm";
import {
  ListCommissionTiersQueryParams,
  CreateCommissionTierBody,
  UpdateCommissionTierBody,
  UpdateCommissionTierParams,
  DeleteCommissionTierParams,
  PreviewCommissionBody,
} from "@workspace/api-zod";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";

const router: IRouter = Router();

export async function resolveCommission(
  orderAmount: number,
  shopId?: number,
): Promise<{
  tierId: number | null;
  commissionPercent: number;
  commissionAmount: number;
  sellerReceives: number;
}> {
  const tiers = await db
    .select()
    .from(commissionTiersTable)
    .where(
      and(
        eq(commissionTiersTable.isActive, true),
        shopId
          ? or(eq(commissionTiersTable.shopId, shopId), isNull(commissionTiersTable.shopId))
          : isNull(commissionTiersTable.shopId),
      ),
    )
    .orderBy(commissionTiersTable.minOrderAmount);

  const shopTiers = shopId ? tiers.filter((t) => t.shopId === shopId) : [];
  const platformTiers = tiers.filter((t) => t.shopId === null);
  const activeTiers = shopTiers.length > 0 ? shopTiers : platformTiers;

  const matched = activeTiers
    .slice()
    .sort((a, b) => Number(b.minOrderAmount) - Number(a.minOrderAmount))
    .find((t) => {
      const min = Number(t.minOrderAmount);
      const max = t.maxOrderAmount ? Number(t.maxOrderAmount) : Infinity;
      return orderAmount >= min && orderAmount <= max;
    });

  const fallback = activeTiers[0];
  const tier = matched ?? fallback;

  const commissionPercent = tier ? Number(tier.commissionPercent) : 5;
  const commissionAmount = (orderAmount * commissionPercent) / 100;
  const sellerReceives = orderAmount - commissionAmount;

  return {
    tierId: tier?.id ?? null,
    commissionPercent,
    commissionAmount,
    sellerReceives,
  };
}

router.get("/commission/tiers", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = ListCommissionTiersQueryParams.safeParse(req.query);
  const shopId = params.success ? params.data.shopId : undefined;

  const where = shopId
    ? or(eq(commissionTiersTable.shopId, shopId), isNull(commissionTiersTable.shopId))
    : isNull(commissionTiersTable.shopId);

  const items = await db
    .select()
    .from(commissionTiersTable)
    .where(where)
    .orderBy(commissionTiersTable.minOrderAmount);

  res.json({ items });
});

router.post("/commission/tiers", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = CreateCommissionTierBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.shopId) {
    const [shop] = await db
      .select({ id: shopsTable.id })
      .from(shopsTable)
      .where(and(eq(shopsTable.id, parsed.data.shopId), eq(shopsTable.ownerId, req.userId!)));

    if (!shop) {
      res.status(403).json({ error: "Not authorized for this shop" });
      return;
    }
  }

  const [tier] = await db
    .insert(commissionTiersTable)
    .values({
      shopId: parsed.data.shopId ?? null,
      minOrderAmount: parsed.data.minOrderAmount,
      maxOrderAmount: parsed.data.maxOrderAmount ?? null,
      commissionPercent: parsed.data.commissionPercent,
    })
    .returning();

  res.status(201).json(tier);
});

router.patch("/commission/tiers/:tierId", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = UpdateCommissionTierParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCommissionTierBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [tier] = await db
    .select()
    .from(commissionTiersTable)
    .where(eq(commissionTiersTable.id, params.data.tierId));

  if (!tier) {
    res.status(404).json({ error: "Tier not found" });
    return;
  }

  if (tier.shopId) {
    const [shop] = await db
      .select({ id: shopsTable.id })
      .from(shopsTable)
      .where(and(eq(shopsTable.id, tier.shopId), eq(shopsTable.ownerId, req.userId!)));

    if (!shop) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.minOrderAmount !== undefined) updates.minOrderAmount = parsed.data.minOrderAmount;
  if (parsed.data.maxOrderAmount !== undefined) updates.maxOrderAmount = parsed.data.maxOrderAmount ?? null;
  if (parsed.data.commissionPercent !== undefined) updates.commissionPercent = parsed.data.commissionPercent;
  if (parsed.data.isActive !== undefined) updates.isActive = parsed.data.isActive;

  const [updated] = await db
    .update(commissionTiersTable)
    .set(updates)
    .where(eq(commissionTiersTable.id, params.data.tierId))
    .returning();

  res.json(updated);
});

router.delete("/commission/tiers/:tierId", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = DeleteCommissionTierParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(commissionTiersTable).where(eq(commissionTiersTable.id, params.data.tierId));
  res.status(204).send();
});

router.post("/commission/preview", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = PreviewCommissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const orderAmount = Number(parsed.data.orderAmount);
  const result = await resolveCommission(orderAmount, parsed.data.shopId);

  res.json({
    orderAmount: String(orderAmount),
    commissionPercent: String(result.commissionPercent),
    commissionAmount: result.commissionAmount.toFixed(6),
    sellerReceives: result.sellerReceives.toFixed(6),
    tierId: result.tierId,
  });
});

export default router;
