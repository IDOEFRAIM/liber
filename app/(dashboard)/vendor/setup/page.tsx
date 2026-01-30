import { db } from "@/db";
import { shops } from "@/db/schema/shops";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import ShopSetupForm from "@/components/vendor/shop/ShopSetupForm";

export default async function ShopSetupPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Vérification de sécurité : si la boutique existe déjà, on redirige vers l'ajout de livre
  const existingShop = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session.userId),
  });

  if (existingShop) {
    redirect("/vendor/books/add");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Configurez votre boutique
          </h1>
          <p className="text-gray-500 mt-2">
            Il ne manque que ces quelques infos pour commencer à vendre.
          </p>
        </div>
        
        <ShopSetupForm />
      </div>
    </div>
  );
}