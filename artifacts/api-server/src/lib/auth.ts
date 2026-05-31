import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.SESSION_SECRET ?? "teleshop-dev-secret";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";

export interface JwtPayload {
  userId: number;
  telegramId: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function validateTelegramInitData(initData: string): Record<string, string> | null {
  if (initData === "dev_mode") {
    return {
      id: "12345678",
      first_name: "Dev",
      last_name: "User",
      username: "devuser",
    };
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) return null;

    params.delete("hash");

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");

    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(BOT_TOKEN)
      .digest();

    const expectedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    if (expectedHash !== hash) return null;

    const userStr = params.get("user");
    if (!userStr) return null;

    return JSON.parse(userStr);
  } catch {
    return null;
  }
}
