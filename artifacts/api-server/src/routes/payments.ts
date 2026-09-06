import { Router, type IRouter } from "express";
import { timingSafeEqual } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db, ordersTable, productsTable, usersTable } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

type TelegramResult<T> = { ok: boolean; result?: T; description?: string };

function telegramConfig() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  return { botToken, webhookSecret };
}

function starsFor(totalAmount: string, currency: string): number {
  const rateName = currency === "TON" ? "TELEGRAM_STARS_PER_TON" : "TELEGRAM_STARS_PER_USDT";
  const rate = Number(process.env[rateName]);
  const total = Number(totalAmount);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error(`${rateName} must be a positive number`);
  if (!Number.isFinite(total) || total <= 0) throw new Error("Order total must be positive");
  return Math.max(1, Math.ceil(total * rate));
}

async function telegramCall<T>(botToken: string, method: string, body: Record<string, unknown>): Promise<T> {
  const url = "https://" + "api.telegram.org/bot" + botToken + "/" + method;
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const result = await response.json() as TelegramResult<T>;
  if (!response.ok || !result.ok || result.result === undefined) throw new Error(result.description || `Telegram ${method} failed`);
  return result.result;
}

function parsePayload(payload: unknown): { orderId: number; stars: number } | null {
  if (typeof payload !== "string") return null;
  const match = /^order:(\d+):(\d+)$/.exec(payload);
  if (!match) return null;
  return { orderId: Number(match[1]), stars: Number(match[2]) };
}

function secretMatches(received: unknown, expected: string | undefined): boolean {
  if (!expected || typeof received !== "string") return false;
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

router.post("/orders/:orderId/stars-invoice", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const orderId = Number(req.params.orderId);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    res.status(400).json({ error: "Invalid orderId" });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(and(eq(ordersTable.id, orderId), eq(ordersTable.buyerId, req.userId!)));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  if (order.status !== "pending") {
    res.status(409).json({ error: "Only pending orders can receive an invoice" });
    return;
  }

  try {
    const { botToken } = telegramConfig();
    const stars = starsFor(order.totalAmount, order.currency);
    const [product] = await db.select({ name: productsTable.name }).from(productsTable).where(eq(productsTable.id, order.productId));
    const payload = `order:${order.id}:${stars}`;
    const invoiceUrl = await telegramCall<string>(botToken, "createInvoiceLink", {
      title: (product?.name || `Order #${order.id}`).slice(0, 32),
      description: `Digital product order #${order.id}`,
      payload,
      provider_token: "",
      currency: "XTR",
      prices: [{ label: `Order #${order.id}`, amount: stars }],
    });
    res.json({ invoiceUrl, stars, currency: "XTR" });
  } catch (error) {
    logger.error({ err: error, orderId }, "Could not create Telegram Stars invoice");
    res.status(503).json({ error: error instanceof Error ? error.message : "Payment service unavailable" });
  }
});

router.post("/telegram/webhook", async (req, res): Promise<void> => {
  let botToken: string;
  let webhookSecret: string | undefined;
  try {
    ({ botToken, webhookSecret } = telegramConfig());
  } catch {
    res.status(503).json({ error: "Telegram is not configured" });
    return;
  }

  if (!secretMatches(req.header("x-telegram-bot-api-secret-token"), webhookSecret)) {
    res.status(401).json({ error: "Invalid webhook secret" });
    return;
  }

  const preCheckout = req.body?.pre_checkout_query;
  if (preCheckout) {
    const parsed = parsePayload(preCheckout.invoice_payload);
    let ok = false;
    let errorMessage = "This order is no longer payable";
    if (parsed && preCheckout.currency === "XTR" && preCheckout.total_amount === parsed.stars) {
      const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, parsed.orderId));
      if (order && order.status === "pending") {
        try {
          ok = starsFor(order.totalAmount, order.currency) === parsed.stars;
          if (!ok) errorMessage = "The order price changed. Please request a new invoice.";
        } catch {
          errorMessage = "Payment conversion is unavailable";
        }
      }
    }
    await telegramCall<boolean>(botToken, "answerPreCheckoutQuery", { pre_checkout_query_id: preCheckout.id, ok, ...(ok ? {} : { error_message: errorMessage }) });
    res.json({ ok: true });
    return;
  }

  const message = req.body?.message;
  const payment = message?.successful_payment;
  if (payment) {
    const parsed = parsePayload(payment.invoice_payload);
    if (!parsed || payment.currency !== "XTR" || payment.total_amount !== parsed.stars) {
      res.json({ ok: true });
      return;
    }

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, parsed.orderId));
    if (!order || order.status !== "pending") {
      res.json({ ok: true });
      return;
    }

    const [buyer] = await db.select({ telegramId: usersTable.telegramId }).from(usersTable).where(eq(usersTable.id, order.buyerId));
    if (!buyer || String(message.from?.id) !== buyer.telegramId || starsFor(order.totalAmount, order.currency) !== parsed.stars) {
      logger.warn({ orderId: order.id }, "Rejected mismatched Telegram Stars payment update");
      res.json({ ok: true });
      return;
    }

    await db.update(ordersTable).set({ status: "confirmed", txHash: payment.telegram_payment_charge_id }).where(and(eq(ordersTable.id, order.id), eq(ordersTable.status, "pending")));
    logger.info({ orderId: order.id }, "Telegram Stars payment confirmed");
  }

  res.json({ ok: true });
});

export default router;
