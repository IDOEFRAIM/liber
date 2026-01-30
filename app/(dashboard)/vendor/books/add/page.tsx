import { db } from "@/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Store, ArrowRight, AlertCircle } from "lucide-react";
import AddBookForm from "@/components/vendor/books/AddBookForm"; 


export default async function AddBookPage() {
  const session = await getSession();
  
  // Récupérer la boutique du vendeur
  const shop = await db.query.shops.findFirst({
    where: (shops, { eq }) => eq(shops.ownerId, session?.userId || ""),
  });

  // Si pas de boutique : Afficher un état vide (Empty State) avec bouton d'action
  if (!shop) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 text-center bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Store size={32} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Boutique introuvable</h1>
        <p className="text-gray-500 mb-8">
          Vous devez configurer votre profil de libraire et créer une boutique avant de pouvoir mettre des livres en vente.
        </p>
        <Link 
          href="/vendor/setup" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Créer ma boutique maintenant
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  // Si la boutique existe : On affiche le formulaire et on passe le shopId réel
  return <AddBookForm shopId={shop.id} />;
}