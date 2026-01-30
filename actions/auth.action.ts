"use server";

import { db } from "@/db";
import { users } from "@/db/schema/users";
import { userService } from "@/services/user.service";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { redirect } from "next/navigation";


import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Action pour la déconnexion
 * Supprime le cookie de session et redirige l'utilisateur
 */
export async function logoutAction() {
  const cookieStore = await cookies();

  // Suppression du cookie "session"
  cookieStore.delete("session");

  // Revalidation de toutes les routes pour mettre à jour la Navbar
  revalidatePath("/", "layout");

  // Redirection vers la page de login
  redirect("/login");
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "ton_secret_super_secure");

// Inscription
export async function signupAction(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();
  const role = formData.get("role")?.toString() as "customer" | "vendor";

  if (!email || !password || !name || !role) return { error: "Champs requis." };

  // on Vérifie si l'utilisateur existe déjà
  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) return { error: "Cet email est déjà utilisé." };

  // on Crée l'utilisateur avec password hashé
  const hashedPassword = await bcrypt.hash(password, 10);
   await userService.createUser({
    id: crypto.randomUUID(),
    email,
    password: hashedPassword,
    name,
    role,
  });

  redirect("/login");
}

// Connexion
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) return { error: "Email/Password requis." };

  //  Trouver l'utilisateur
  const user = await userService.getUserByEmail(email);
  if (!user) return { error: "Identifiants invalides." };

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return { error: "Identifiants invalides." };

  // Créer un JWT de session
  const token = await new SignJWT({ userId: user.id, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(JWT_SECRET);

  // Stocker dans un cookie sécurisé
  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}


export type ActionState = {
  error?: string;
  success?: boolean;
} | null;

