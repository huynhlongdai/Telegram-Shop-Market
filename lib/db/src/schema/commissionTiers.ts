import { pgTable, text, serial, timestamp, integer, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const commissionTiersTable = pgTable("commission_tiers", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id"),
  minOrderAmount: numeric("min_order_amount", { precision: 18, scale: 6 }).notNull().default("0"),
  maxOrderAmount: numeric("max_order_amount", { precision: 18, scale: 6 }),
  commissionPercent: numeric("commission_percent", { precision: 5, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCommissionTierSchema = createInsertSchema(commissionTiersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCommissionTier = z.infer<typeof insertCommissionTierSchema>;
export type CommissionTier = typeof commissionTiersTable.$inferSelect;
