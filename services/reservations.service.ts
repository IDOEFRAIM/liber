import { db } from "@/db";
import { reservations, type NewReservation, reservationStatusEnum } from "@/db/schema/reservations";
import { books } from "@/db/schema/books";
import { eq, sql } from "drizzle-orm";

export const reservationService = {
  /**
   * Créer une réservation avec transaction atomique
   */
  async createReservation(data: NewReservation) {
    return await db.transaction(async (tx) => {
      // Verrouillage de la ligne pour garantir l'exclusivité sur le stock
      const [book] = await tx
        .select()
        .from(books)
        .where(eq(books.id, data.bookId))
        .for("update");

      if (!book) throw new Error("Livre introuvable.");
      if (book.stock <= 0) throw new Error("Livre épuisé.");

      const [newReservation] = await tx
        .insert(reservations)
        .values(data)
        .returning();

      await tx
        .update(books)
        .set({ 
          stock: sql`${books.stock} - 1`,
          updatedAt: new Date()
        })
        .where(eq(books.id, data.bookId));

      return newReservation;
    });
  },

  /**
   * OPTIMISÉ : Récupérer les réservations d'un vendeur (libraire)
   * On utilise maintenant directement la colonne shopId indexée.
   */
  async getShopReservations(shopId: string) {
    return await db.query.reservations.findMany({
      // Plus besoin de "exists" complexe, on filtre directement !
      where: eq(reservations.shopId, shopId), 
      with: {
        book: true,
        user: {
          columns: { name: true, email: true }
        },
      },
      orderBy: (res, { desc }) => [desc(res.createdAt)],
    });
  },

  /**
   * Mettre à jour le statut avec gestion intelligente du restock
   */
  async updateStatus(reservationId: string, status: typeof reservationStatusEnum.enumValues[number]) {
    return await db.transaction(async (tx) => {
      const current = await tx.query.reservations.findFirst({
        where: eq(reservations.id, reservationId)
      });

      if (!current) throw new Error("Réservation introuvable.");
      if (current.status === status) return current;

      const [updated] = await tx
        .update(reservations)
        .set({ status, updatedAt: new Date() })
        .where(eq(reservations.id, reservationId))
        .returning();

      // Gestion du stock
      if (status === "cancelled" && current.status !== "cancelled") {
        await tx.update(books)
          .set({ stock: sql`${books.stock} + 1` })
          .where(eq(books.id, updated.bookId));
      } 
      else if (current.status === "cancelled" && status !== "cancelled") {
        const [book] = await tx.select().from(books).where(eq(books.id, updated.bookId)).for("update");
        
        if (!book || book.stock <= 0) {
          throw new Error("Impossible de réactiver : le livre n'est plus en stock.");
        }

        await tx.update(books)
          .set({ stock: sql`${books.stock} - 1` })
          .where(eq(books.id, updated.bookId));
      }

      return updated;
    });
  }
}