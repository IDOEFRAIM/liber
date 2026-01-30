"use server";

import { db } from "@/db";
import { users } from "@/db/schema/users";
import { shops } from "@/db/schema/shops";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type UserRole = "admin" | "customer" | "vendor";

export async function toggleUserRoleAction(userId: string, currentRole: UserRole) {
  // on détermine le nouveau rôle en respectant les types autorisés
  const newRole: UserRole = currentRole === "admin" ? "customer" : "admin";
  
  await db.update(users)
    .set({ role: newRole })
    .where(eq(users.id, userId));

  revalidatePath("/admin");
  return { success: true };
}

export async function verifyShopAction(shopId: string, currentStatus: boolean) {
  try {
    await db.update(shops)
      .set({ isVerified: !currentStatus })
      .where(eq(shops.id, shopId));

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Impossible de modifier le statut." };
  }
}