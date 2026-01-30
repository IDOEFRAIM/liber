import { db } from "@/db";
import { users, type NewUser, type User } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export const userService = {
  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user || null;
  },

  // Récupérer un utilisateur par son ID (UUID de Supabase)
  async getUserById(id: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user || null;
  },

  /**
   * Créer un nouvel utilisateur
   * Note: 'data' doit maintenant contenir le mot de passe (hashé)
   */
  async createUser(data: NewUser) {
    const [newUser] = await db
      .insert(users)
      .values(data)
      .returning();
    return newUser;
  },

  /**
   * Récupérer un utilisateur avec sa boutique
   */
  async getUserWithShop(userId: string) {

    return await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        shop: true,
      },
    });
  },

  /**
   * Mettre à jour le profil
   */
  async updateUser(userId: string, data: Partial<NewUser>) {

    const { id: _, createdAt: __, ...updateData } = data;

    const [updatedUser] = await db
      .update(users)
      .set({ 
        ...updateData, 
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
      
    return updatedUser;
  }
};