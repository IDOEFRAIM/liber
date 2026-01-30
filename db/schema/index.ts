import { relations } from "drizzle-orm";
import { users } from "./users";
import { shops } from "./shops";
import { books } from "./books";
import { reservations } from "./reservations";

// pour un accès centralisé
export * from "./users";
export * from "./shops";
export * from "./books";
export * from "./reservations";

// Relations Utilisateurs
export const usersRelations = relations(users, ({ one, many }) => ({
  // Un utilisateur (vendor) peut avoir UNE boutique
  // Note : On ne définit pas fields/references ici car la Foreign Key est dans shops
  shop: one(shops), 
  reservations: many(reservations),
}));

//  Relations Boutiques(shop)
export const shopsRelations = relations(shops, ({ one, many }) => ({
  // La boutique(user) appartient à UN propriétaire
  owner: one(users, {
    fields: [shops.ownerId], // La Foreign Key est bien ici
    references: [users.id],
  }),
  books: many(books),
}));

// Relations Livres
export const booksRelations = relations(books, ({ one, many }) => ({
  shop: one(shops, {
    fields: [books.shopId],
    references: [shops.id],
  }),
  reservations: many(reservations),
}));

// Relations Réservations
export const reservationsRelations = relations(reservations, ({ one }) => ({
  user: one(users, {
    fields: [reservations.userId],
    references: [users.id],
  }),
  book: one(books, {
    fields: [reservations.bookId],
    references: [books.id],
  }),
}));