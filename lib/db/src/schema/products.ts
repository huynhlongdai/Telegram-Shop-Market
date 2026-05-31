import { pgTable, text, serial, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 18, scale: 6 }).notNull(),
  currency: text("currency").notNull().default("USDT"),
  imageUrl: text("image_url"),
  category: text("category"),
  stock: integer("stock").notNull().default(0),
  status: text("status").notNull().default("active"),
  flashSalePrice: numeric("flash_sale_price", { precision: 18, scale: 6 }),
  flashSaleEnd: timestamp("flash_sale_end", { withTimezone: true }),
  warrantyType: text("warranty_type").notNull().default("standard"),
  escrowReleaseDays: integer("escrow_release_days").notNull().default(3),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
