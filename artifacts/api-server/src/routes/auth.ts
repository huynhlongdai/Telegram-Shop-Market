import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AuthTelegramBody } from "@workspace/api-zod";
import { validateTelegramInitData, signToken } from "../lib/auth.js";
import { nanoid } from "../lib/nanoid.js";

const router: IRouter = Router();

router.post("/auth/telegram", async (req, res): Promise<void> => {
  const parsed = AuthTelegramBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const telegramUser = validateTelegramInitData(parsed.data.initData);
  if (!telegramUser) {
    res.status(401).json({ error: "Invalid Telegram initData" });
    return;
  }

  const telegramId = String(telegramUser.id);

  let [user] = await db.select().from(usersTable).where(eq(usersTable.telegramId, telegramId));

  if (!user) {
    const referralCode = nanoid(8).toUpperCase();
    const [created] = await db.insert(usersTable).values({
      telegramId,
      username: telegramUser.username ?? null,
      firstName: telegramUser.first_name ?? null,
      lastName: telegramUser.last_name ?? null,
      photoUrl: telegramUser.photo_url ?? null,
      referralCode,
      referredBy: parsed.data.referralCode ?? null,
    }).returning();
    user = created;
  }

  const token = signToken({ userId: user.id, telegramId: user.telegramId });

  res.json({ token, user });
});

export default router;
