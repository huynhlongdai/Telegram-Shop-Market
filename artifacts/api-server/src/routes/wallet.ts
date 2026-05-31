import { Router, type IRouter } from "express";
import { db, walletTransactionsTable, shopsTable, ordersTable } from "@workspace/db";
import { eq, desc, sql, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";
import { z } from "zod";

const router: IRouter = Router();

const WithdrawBody = z.object({
  amount: z.string(),
  currency: z.enum(["TON", "USDT"]),
  toAddress: z.string().min(5),
});

router.get("/wallet/balance", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const [inflow, outflow] = await Promise.all([
    db
      .select({ total: sql<string>`coalesce(sum(amount::numeric), 0)::text` })
      .from(walletTransactionsTable)
      .where(
        and(
          eq(walletTransactionsTable.userId, req.userId!),
          eq(walletTransactionsTable.status, "completed"),
          sql`${walletTransactionsTable.amount}::numeric > 0`,
        ),
      ),
    db
      .select({ total: sql<string>`coalesce(abs(sum(amount::numeric)), 0)::text` })
      .from(walletTransactionsTable)
      .where(
        and(
          eq(walletTransactionsTable.userId, req.userId!),
          eq(walletTransactionsTable.status, "completed"),
          sql`${walletTransactionsTable.amount}::numeric < 0`,
        ),
      ),
  ]);

  const available = (Number(inflow[0].total) - Number(outflow[0].total)).toFixed(6);

  const [escrowLocked] = await db
    .select({ total: sql<string>`coalesce(sum(total_amount::numeric), 0)::text` })
    .from(ordersTable)
    .where(
      and(
        eq(ordersTable.buyerId, req.userId!),
        eq(ordersTable.escrowStatus, "holding"),
      ),
    );

  res.json({
    balanceUsdt: available,
    balanceTon: "0",
    escrowLocked: escrowLocked.total,
    pendingCommission: "0",
  });
});

router.get("/wallet/transactions", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const offset = (page - 1) * limit;

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(walletTransactionsTable)
      .where(eq(walletTransactionsTable.userId, req.userId!))
      .orderBy(desc(walletTransactionsTable.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(walletTransactionsTable)
      .where(eq(walletTransactionsTable.userId, req.userId!)),
  ]);

  res.json({ items, total: countResult[0].count });
});

router.post("/wallet/withdraw", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = WithdrawBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const amount = Number(parsed.data.amount);
  if (amount <= 0) {
    res.status(400).json({ error: "Amount must be greater than 0" });
    return;
  }

  const [tx] = await db
    .insert(walletTransactionsTable)
    .values({
      userId: req.userId!,
      type: "withdrawal",
      amount: String(-amount),
      currency: parsed.data.currency,
      toAddress: parsed.data.toAddress,
      status: "pending",
      description: `Withdrawal to ${parsed.data.toAddress.slice(0, 8)}...`,
    })
    .returning();

  res.status(201).json(tx);
});

export default router;
