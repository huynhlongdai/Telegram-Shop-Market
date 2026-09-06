import { pgTable, text, serial, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const affiliatesTable = pgTable("affiliates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  referralCode: text("referral_code").notNull().unique(),
  tier: text("tier").notNull().default("standard"),
  totalEarned: numeric("total_earned", { precision: 18, scale: 6 }).notNull().default("0"),
  pendingPayout: numeric("pending_payout", { precision: 18, scale: 6 }).notNull().default("0"),
  totalReferrals: integer("total_referrals").notNull().default(0),
  status: text("status").notNull().default("active"),
  channelUsername: text("channel_username"),
  kolApplicationStatus: text("kol_application_status").notNull().default("not_applied"),
  kolAppliedAt: timestamp("kol_applied_at", { withTimezone: true }),
  kolReviewedAt: timestamp("kol_reviewed_at", { withTimezone: true }),
  kolReviewNote: text("kol_review_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const affiliateCommissionsTable = pgTable("affiliate_commissions", {
  id: serial("id").primaryKey(),
  affiliateId: integer("affiliate_id").notNull(),
  orderId: integer("order_id").notNull(),
  amount: numeric("amount", { precision: 18, scale: 6 }).notNull(),
  rate: numeric("rate", { precision: 5, scale: 4 }).notNull(),
  status: text("status").notNull().default("pending"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAffiliateSchema = createInsertSchema(affiliatesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAffiliate = z.infer<typeof insertAffiliateSchema>;
export type Affiliate = typeof affiliatesTable.$inferSelect;
