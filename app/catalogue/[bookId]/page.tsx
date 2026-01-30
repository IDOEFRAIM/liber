import { db } from "@/db";
import { books } from "@/db/schema/books";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  ShoppingBag, 
  Store, 
  ShieldCheck, 
  Truck, 
  BookOpen 
} from "lucide-react";

export default async function BookDetailPage({ 
  params 
}: { 
  params: Promise<{ bookId: string }> 
}) {
  // ATTENDRE LES PARAMS (Obligatoire en Next 15/16)
  const { bookId } = await params;

  // Récupérer le livre avec sa boutique
  const book = await db.query.books.findFirst({
    where: eq(books.id, bookId),
    with: {
      shop: true,
    },
  });

  if (!book) notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Bouton Retour */}
      <Link 
        href="/catalogue" 
        className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Colonne GAUCHE : Image */}
        <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden bg-gray-50 shadow-2xl border border-gray-100">
          {book.imageUrl ? (
            <Image 
              src={book.imageUrl} 
              alt={book.title} 
              fill 
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <BookOpen size={80} />
            </div>
          )}
        </div>

        {/* Colonne DROITE : Infos & Achat */}
        <div className="flex flex-col">
          <div className="mb-8">
            <h1 className="text-5xl font-black text-gray-900 leading-tight mb-4">
              {book.title}
            </h1>
            <p className="text-2xl text-gray-500 font-medium tracking-tight">
              par <span className="text-gray-900">{book.author}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="text-4xl font-black text-indigo-600">
              {book.price}€
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
              book.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
              {book.stock > 0 ? `En stock (${book.stock})` : 'Rupture de stock'}
            </div>
          </div>

          {/* Vendeur */}
          <Link 
            href={`/shop/${book.shop?.slug}`}
            className="flex items-center gap-4 p-4 rounded-3xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all mb-8 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 border border-gray-100">
              <Store size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Vendu par</p>
              <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {book.shop?.name}
              </p>
            </div>
          </Link>

          {/* Actions */}
          <div className="space-y-4 mb-10">
            <button 
              disabled={book.stock === 0}
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-gray-900"
            >
              <ShoppingBag size={22} />
              Ajouter au panier
            </button>
          </div>

          {/* Garanties */}
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
              <Truck size={20} className="text-indigo-500" />
              Livraison suivie
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
              <ShieldCheck size={20} className="text-indigo-500" />
              Paiement sécurisé
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}