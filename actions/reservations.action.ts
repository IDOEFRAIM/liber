"use server";

import { db } from "@/db";
import { books } from "@/db/schema/books";
import { reservations } from "@/db/schema/reservations";
import { getSession } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid"; // Importation pour générer l'ID
import { reservationService } from "@/services/reservations.service";

export async function createReservationAction(bookId: string) {
  const session = await getSession();
  if (!session) return { error: "Vous devez être connecté." };

  try {
    const result = await db.transaction(async (tx) => {
      // On récupère le livre (qui contient l'info du shopId)
      const [book] = await tx.select().from(books).where(eq(books.id, bookId)).limit(1);

      if (!book || book.stock <= 0) {
        throw new Error("Livre indisponible.");
      }

      // Insertion avec le shopId 
      const [newReservation] = await tx.insert(reservations).values({
        id: uuidv4(),
        userId: session.userId,
        bookId: book.id,
        shopId: book.shopId,
        status: "pending",
      }).returning();

      // Mise à jour du stock
      await tx.update(books)
        .set({ stock: sql`${books.stock} - 1` })
        .where(eq(books.id, bookId));

      return newReservation;
    });

    revalidatePath("/catalogue");
    revalidatePath("/reservations");
    
    return { success: true, reservationId: result.id };
  } catch (error: any) {
    return { error: error.message || "Erreur lors de la réservation." };
  }
}



// Alignement sur les enums de ton schéma Drizzle
export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "collected" | "returned";

/**
 * Met à jour le statut d'une réservation (Vendeur ou Client)
 */
export async function updateReservationStatusAction(
  reservationId: string, 
  newStatus: ReservationStatus
) {
  // 1. Vérification de la session
  const session = await getSession();
  if (!session) {
    return { error: "Vous devez être connecté pour effectuer cette action." };
  }

  try {
    // 2. Appel du service (qui gère la transaction SQL et le stock)
    await reservationService.updateStatus(reservationId, newStatus);
    
    // 3. Revalidation des données pour mettre à jour l'UI sans recharger la page
    revalidatePath("/reservations"); // Pour le client
    revalidatePath("/dashboard/reservations"); // Pour le vendeur
    
    return { success: true };
  } catch (error: any) {
    console.error("[UPDATE_RESERVATION_ERROR]:", error);
    return { 
      error: error.message || "Une erreur est survenue lors de la mise à jour." 
    };
  }
}