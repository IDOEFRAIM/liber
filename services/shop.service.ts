import { db } from "@/db";
import { shops, type NewShop, type Shop } from "@/db/schema/shops";
import { eq } from "drizzle-orm";


export const shopService = {
  /**
   * Créer une nouvelle boutique
   * On utilise Omit pour ne pas exiger l'ID dans les arguments
   */
  async createShop(data: Omit<NewShop, "id">) {
    const [newShop] = await db
      .insert(shops)
      .values({
        id: crypto.randomUUID(), // Génération manuelle de l'ID pour satisfaire le schéma
        ...data,
      })
      .returning();
    return newShop;
  },

  /**
   * Récupérer une boutique par l'ID de son propriétaire
   */
  async getShopByOwnerId(ownerId: string): Promise<Shop | null> {
    const [shop] = await db
      .select()
      .from(shops)
      .where(eq(shops.ownerId, ownerId))
      .limit(1);
    return shop || null;
  },

  /**
   * Récupérer une boutique par son slug
   */
  async getShopBySlug(slug: string) {
    return await db.query.shops.findFirst({
      where: eq(shops.slug, slug),
      with: {
        books: true, 
        owner: true,
      },
    });
  },

  /**
   * Mettre à jour les infos de la boutique
   */
  async updateShop(shopId: string, data: Partial<NewShop>) {
    // Sécurité : on extrait id et ownerId pour ne jamais les modifier par erreur
    const { id: _id, ownerId: _ownerId, ...updateData } = data; 

    const [updatedShop] = await db
      .update(shops)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(shops.id, shopId))
      .returning();
    return updatedShop;
  }
};