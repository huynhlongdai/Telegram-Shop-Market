import { pgTable, text, serial, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").notNull(),
  shopId: integer("shop_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  totalAmount: numeric("total_amount", { precision: 18, scale: 6 }).notNull(),
  currency: text("currency").notNull().default("USDT"),
  status: text("status").notNull().default("pending"),
  txHash: text("tx_hash"),
  escrowAddress: text("escrow_address"),
  deliveryAddress: text("delivery_address"),
  note: text("note"),
  voucherCode: text("voucher_code"),
  discountAmount: numeric("discount_amount", { precision: 18, scale: 6 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
