import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";


export const shops = pgTable("shops", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  address: text("address"),
  logoUrl: text("logo_url"),

  isVerified: boolean("is_verified").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),

  ownerId: uuid("owner_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Shop = InferSelectModel<typeof shops>;
export type NewShop = InferInsertModel<typeof shops>;