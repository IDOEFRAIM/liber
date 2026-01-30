"use server";

import { bookService } from "@/services/books.service";
import { uploadService } from "@/services/upload.service";
import { getSession } from "@/lib/auth"; // <--- On utilise ton nouveau décodeur JWT
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { books } from "@/db/schema/books";
import { eq, and } from "drizzle-orm";

export async function createBookAction(prevState: any, formData: FormData) {
  const session = await getSession();
  
  if (!session || session.role !== "vendor") {
    return { error: "Accès refusé. Vous devez être connecté en tant que libraire." };
  }

  // Extraction des données
  const title = formData.get("title")?.toString();
  const author = formData.get("author")?.toString();
  const priceRaw = formData.get("price")?.toString();
  const stockRaw = formData.get("stock")?.toString();
  const imageFile = formData.get("image") as File | null;
  const shopId = formData.get("shopId")?.toString();

  if (!title || !author || !priceRaw || !stockRaw || !shopId) {
    return { error: "Tous les champs sont obligatoires." };
  }

  try {
    let imageUrl = "";

    // Upload de l'image
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadService.uploadFile(imageFile, "book-covers");
    }

    //  Insertion en DB 
    await bookService.createBook({
      title,
      author,
      price: parseFloat(priceRaw).toString(), 
      stock: parseInt(stockRaw),
      imageUrl,
      shopId,
    });

  } catch (error: any) {
    console.error("Erreur lors de la création du livre:", error);
    return { error: "Erreur lors de l'enregistrement du livre." };
  }

  // Mise à jour et redirection
  revalidatePath("/vendor/books");
  revalidatePath("/");
  redirect("/vendor/books");
}

export async function deleteBookAction(bookId: string, imageUrl: string, shopId: string) {
  // Ici aussi, on pourrait vérifier la session pour plus de sécurité
  try {
    if (imageUrl && imageUrl.includes("supabase")) {
      await uploadService.deleteFile(imageUrl, "book-covers");
    }

    await bookService.deleteBook(bookId, shopId);

    revalidatePath("/vendor/books");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression:", error);
    return { error: "Erreur lors de la suppression." };
  }
}




export async function updateBookAction(bookId: string, shopId: string, prevState: any, formData: FormData) {
  const title = formData.get("title")?.toString();
  const author = formData.get("author")?.toString();
  const price = parseFloat(formData.get("price")?.toString() || "0");
  const stock = parseInt(formData.get("stock")?.toString() || "0");
  const imageFile = formData.get("image") as File | null;

  try {
    let imageUrl: string | undefined;

    // Si une nouvelle image est uploadée
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadService.uploadFile(imageFile, "book-covers");
    }

    await db.update(books)
      .set({
        title,
        author,
        price: price.toString(),
        stock,
        ...(imageUrl && { imageUrl }), // On n'update l'URL que si une nouvelle image existe
        updatedAt: new Date(),
      })
      .where(and(eq(books.id, bookId), eq(books.shopId, shopId)));

  } catch (error) {
    return { error: "Erreur lors de la mise à jour." };
  }

  revalidatePath("/vendor/books");
  redirect("/vendor/books");
}