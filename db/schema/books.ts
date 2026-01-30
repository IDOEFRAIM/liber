import { pgTable, text, timestamp, uuid, integer, decimal } from "drizzle-orm/pg-core";
import { shops } from "./shops";

export const books = pgTable("books", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description"),
  isbn: text("isbn").unique(),
  imageUrl: text("image_url"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), 
  stock: integer("stock").default(1).notNull(),
  shopId: uuid("shop_id")
    .references(() => shops.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;