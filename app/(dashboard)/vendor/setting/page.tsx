import { db } from "@/db";
import { shops } from "@/db/schema/shops";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import EditShopForm from "@/components/vendor/shop/EditShopForm";

export default async function ShopSettingsPage() {
  const session = await getSession();
  const shop = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session?.userId || ""),
  });

  if (!shop) redirect("/vendor/shop/setup");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Paramètres de la boutique</h1>
        <p className="text-gray-500">Modifiez l'identité visuelle et les infos de votre librairie.</p>
      </header>
      
      <EditShopForm shop={shop} />
    </div>
  );
}