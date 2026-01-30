
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { books } from "./books";
import { shops } from "./shops"; 


export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending", 
  "confirmed", 
  "collected", 
  "completed",
  "cancelled",
  "returned"
]);

export const reservations = pgTable("reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Utilise l'enum exporté pour la colonne status
  status: reservationStatusEnum("status")
    .default("pending")
    .notNull(),

  shopId: uuid("shop_id")
    .references(() => shops.id, { onDelete: "cascade" })
    .notNull(),

  bookId: uuid("book_id")
    .references(() => books.id, { onDelete: "cascade" })
    .notNull(),
    
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Reservation = InferSelectModel<typeof reservations>;
export type NewReservation = InferInsertModel<typeof reservations>;