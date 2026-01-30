import { db } from "@/db";
import { shops } from "@/db/schema/shops";
import { books } from "@/db/schema/books";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; 
import { MapPin, BookOpen, ShieldCheck, ArrowLeft } from "lucide-react";
import ReservationButton from "@/components/vendor/shop/ReservationButton";
import { getSession } from "@/lib/auth";

interface PageProps {
  params: Promise<{ shopId: string }>;
}

export default async function ShopPublicPage({ params }: PageProps) {
  const session = await getSession();
  const { shopId } = await params;

  const shop = await db.query.shops.findFirst({
    where: eq(shops.slug, shopId),
  });

  if (!shop) notFound();

  const shopBooks = await db.query.books.findMany({
    where: eq(books.shopId, shop.id),
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- BANNIÈRE / HEADER --- */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* BOUTON RETOUR */}
          <Link 
            href="/catalogue" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors group"
          >
            <div className="p-2 bg-slate-50 group-hover:bg-indigo-50 rounded-xl transition-colors">
              <ArrowLeft size={16} />
            </div>
            Retour au catalogue
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            {/* Logo Shop */}
            <div className="relative w-36 h-36 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl bg-indigo-50 flex-shrink-0">
              {shop.logoUrl ? (
                <Image src={shop.logoUrl} alt={shop.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">📚</div>
              )}
            </div>

            {/* Infos Shop */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  {shop.name}
                </h1>
                {shop.isVerified && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 mx-auto md:mx-0">
                    <ShieldCheck size={14} />
                    Librairie Certifiée
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-5 text-slate-500 font-bold mb-6">
                <div className="flex items-center gap-1.5 text-sm">
                  <MapPin size={18} className="text-indigo-500" />
                  {shop.address || "Adresse physique"}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <BookOpen size={18} className="text-indigo-500" />
                  {shopBooks.length} références en rayon
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed max-w-2xl text-lg">
                {shop.description || "Cette librairie n'a pas encore rédigé sa présentation."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- GRILLE DE LIVRES --- */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic underline decoration-indigo-500 decoration-4 underline-offset-8">
            Catalogue de la boutique
          </h2>
        </div>

        {shopBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            {shopBooks.map((book) => (
              <div key={book.id} className="group flex flex-col bg-white p-4 rounded-[32px] border border-transparent hover:border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[2/3] rounded-[24px] overflow-hidden mb-5 shadow-md">
                  {book.imageUrl ? (
                    <Image 
                      src={book.imageUrl} 
                      alt={book.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl">📖</div>
                  )}
                  
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 backdrop-blur-[2px]">
                     <ReservationButton bookId={book.id} stock={book.stock} userId={session?.userId} />
                  </div>

                  {book.stock > 0 && book.stock <= 3 && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-orange-500 text-white text-[9px] font-black uppercase rounded-full shadow-lg">
                      Rare
                    </div>
                  )}
                </div>

                <div className="px-1">
                  <h3 className="font-black text-slate-900 leading-snug mb-1 truncate text-lg">
                    {book.title}
                  </h3>
                  <p className="text-xs text-indigo-500 font-black uppercase tracking-widest mb-4">
                    {book.author}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                    <span className="text-2xl font-black text-slate-900">{book.price}€</span>
                    <div className="text-right">
                       <p className={`text-[10px] font-black uppercase tracking-tighter ${book.stock > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                        {book.stock > 0 ? `En Stock (${book.stock})` : 'Épuisé'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[60px] border-2 border-dashed border-slate-100">
            <div className="text-6xl mb-4">🏜️</div>
            <p className="text-slate-400 font-black text-xl">Aucun trésor trouvé dans ce rayon...</p>
          </div>
        )}
      </div>
    </div>
  );
}