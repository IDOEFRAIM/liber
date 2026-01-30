import { db } from "@/db";
import { books, type NewBook, type Book } from "@/db/schema/books";
import { eq, desc, ilike, and } from "drizzle-orm";

export const bookService = {
  /**
   * Créer un nouveau livre
   */
  async createBook(data: NewBook) {
    const [newBook] = await db
      .insert(books)
      .values(data)
      .returning();
    return newBook;
  },

  /**
   * Récupérer tous les livres (avec pagination ou filtres optionnels)
   */
  async getAllBooks() {
    return await db.query.books.findMany({
      with: {
        shop: true, // Inclut les infos de la boutique (nom, logo)
      },
      orderBy: [desc(books.createdAt)],
    });
  },

  /**
   * Rechercher des livres par titre
   */
  async searchBooks(query: string) {
    return await db.query.books.findMany({
      where: ilike(books.title, `%${query}%`),
      with: {
        shop: true,
      },
    });
  },

  /**
   * Récupérer les livres d'une boutique spécifique
   */
  async getBooksByShop(shopId: string) {
    return await db.query.books.findMany({
      where: eq(books.shopId, shopId),
      orderBy: [desc(books.createdAt)],
    });
  },

  /**
   * Récupérer un livre par son ID
   */
  async getBookById(id: string) {
    return await db.query.books.findFirst({
      where: eq(books.id, id),
      with: {
        shop: true,
      },
    });
  },

  /**
   * Mettre à jour un livre
   */
  async updateBook(id: string, data: Partial<NewBook>) {
    const [updatedBook] = await db
      .update(books)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(books.id, id))
      .returning();
    return updatedBook;
  },

  /**
   * Supprimer un livre
   */
  async deleteBook(id: string, shopId: string) {
  return await db
    .delete(books)
    .where(
      and(
        eq(books.id, id),
        eq(books.shopId, shopId) // Sécurité : vérifie que le livre appartient au shop
      )
    );
    }
};