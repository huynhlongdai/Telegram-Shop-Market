import { pgTable, text, serial, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const walletTransactionsTable = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  amount: numeric("amount", { precision: 18, scale: 6 }).notNull(),
  currency: text("currency").notNull().default("USDT"),
  orderId: integer("order_id"),
  txHash: text("tx_hash"),
  toAddress: text("to_address"),
  status: text("status").notNull().default("completed"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWalletTransactionSchema = createInsertSchema(walletTransactionsTable).omit({ id: true, createdAt: true });
export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;
export type WalletTransaction = typeof walletTransactionsTable.$inferSelect;
