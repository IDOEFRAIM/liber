"use server";

import { getSession } from "@/lib/auth"; // <--- Indispensable pour ton nouveau système
import { shopService } from "@/services/shop.service";
import { uploadService } from "@/services/upload.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { db } from "@/db";
import { shops } from "@/db/schema/shops";
import { eq } from "drizzle-orm";

export type ShopActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function createShopAction(
  prevState: ShopActionState, 
  formData: FormData
): Promise<ShopActionState> {
  
  // UTILISATION DU JWT (Plus de supabase.auth)
  const session = await getSession();

  if (!session || session.role !== "vendor") {
    return { error: "Accès refusé. Seuls les libraires peuvent créer une boutique." };
  }

  // Extraction et validation
  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const address = formData.get("address")?.toString();
  const logoFile = formData.get("logo") as File | null;

  if (!name || name.length < 3) {
    return { error: "Le nom de la boutique doit contenir au moins 3 caractères." };
  }

  try {
    // Génération du slug
    const slug = `${slugify(name, { lower: true, strict: true })}-${Math.random().toString(36).substring(2, 5)}`;

    // Upload du logo (On garde Supabase Storage, c'est parfait)
    let logoUrl = "";
    if (logoFile && logoFile.size > 0) {
      logoUrl = await uploadService.uploadFile(logoFile, "shop-logos");
    }

    // Enregistrement en base de données
    await shopService.createShop({
      name,
      slug,
      description: description || null,
      address: address || null,
      logoUrl: logoUrl || "",
      ownerId: session.userId, 
    });

  } catch (error: any) {
    console.error("Erreur création boutique:", error);
    if (error.code === "23505") {
      return { error: "Vous possédez déjà une boutique ou ce nom est déjà utilisé." };
    }
    return { error: "Une erreur technique est survenue." };
  }

  // Succès
  revalidatePath("/", "layout");
  redirect("/vendor/books/add");
}



export async function updateShopAction(shopId: string, prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Non authentifié" };

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const address = formData.get("address")?.toString();
  const logoFile = formData.get("logo") as File | null;

  if (!name || name.length < 3) return { error: "Nom trop court" };

  try {
    let logoUrl: string | undefined;
    
    // Si un nouveau logo est envoyé, on l'uploade
    if (logoFile && logoFile.size > 0) {
      logoUrl = await uploadService.uploadFile(logoFile, "shop-logos");
    }

    await db.update(shops)
      .set({
        name,
        description,
        address,
        slug: slugify(name, { lower: true, strict: true }),
        ...(logoUrl && { logoUrl }),
        updatedAt: new Date(),
      })
      .where(eq(shops.id, shopId));

    revalidatePath("/vendor/");
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour" };
  }
}