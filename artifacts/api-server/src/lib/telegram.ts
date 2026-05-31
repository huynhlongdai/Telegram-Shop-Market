import { logger } from "./logger.js";

interface TelegramMessage {
  botToken: string;
  chatId: string;
  text: string;
}

export async function sendTelegramMessage({ botToken, chatId, text }: TelegramMessage): Promise<void> {
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      logger.warn({ chatId, status: response.status, body }, "Telegram notification failed");
    }
  } catch (err) {
    logger.warn({ err, chatId }, "Telegram notification error");
  }
}

export function buildOrderNotification(params: {
  orderId: number;
  productName: string;
  quantity: number;
  totalAmount: string;
  currency: string;
  buyerUsername?: string | null;
  warrantyType: string;
  escrowReleaseDays?: number;
  status?: string;
}): string {
  const {
    orderId,
    productName,
    quantity,
    totalAmount,
    currency,
    buyerUsername,
    warrantyType,
    escrowReleaseDays,
    status,
  } = params;

  const amt = parseFloat(totalAmount).toFixed(2);
  const buyer = buyerUsername ? `@${buyerUsername}` : "Anonymous";
  const warranty = warrantyType === "none"
    ? `No warranty — funds released automatically after ${escrowReleaseDays ?? 3} day(s)`
    : "Standard warranty (buyer confirmation required)";

  if (status) {
    return `<b>Order #${orderId} — Status Update</b>\n\nNew status: <b>${status.toUpperCase()}</b>\nProduct: ${productName}\nAmount: ${amt} ${currency}`;
  }

  return `<b>New Order #${orderId}</b>\n\nProduct: ${productName} x${quantity}\nAmount: <b>${amt} ${currency}</b>\nBuyer: ${buyer}\nWarranty: ${warranty}`;
}
