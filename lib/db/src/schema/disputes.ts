import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const disputesTable = pgTable("disputes", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().unique(),
  openedById: integer("opened_by_id").notNull(),
  status: text("status").notNull().default("open"),
  buyerNote: text("buyer_note"),
  sellerNote: text("seller_note"),
  adminNote: text("admin_note"),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertDisputeSchema = createInsertSchema(disputesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDispute = z.infer<typeof insertDisputeSchema>;
export type Dispute = typeof disputesTable.$inferSelect;
