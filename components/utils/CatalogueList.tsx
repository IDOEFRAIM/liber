"use client";

import { useState, useTransition } from "react";
import { Search, ShoppingCart, Store, Loader2 } from "lucide-react";
import NextLink from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createReservationAction } from "@/actions/reservations.action";

export default function CatalogueList({ allBooks }: { allBooks: any[] }) {
  const [search, setSearch] = useState("");

  const [reservingId, setReservingId] = useState<string | null>(null);


  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredBooks = allBooks.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

const handleReserve = (bookId: string) => {
  setReservingId(bookId);
  startTransition(async () => {
    const result = await createReservationAction(bookId);
    if (result?.success) {
      router.push("/reservations");
    } else {
      alert(result?.error);
      setReservingId(null);
    }
  });
};

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">
            Explorer le <span className="text-indigo-600">Market</span>
          </h1>
          <p className="text-gray-500 text-lg">Découvrez les pépites de nos libraires.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un titre, un auteur..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map((book) => (
            <div key={book.id} className="group flex flex-col animate-in fade-in duration-500">
               <NextLink 
                href={`/catalogue/${book.id}`} 
                className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 mb-4 shadow-sm group-hover:shadow-xl transition-all"
               >
                {book.imageUrl && (
                  <Image 
                    src={book.imageUrl} 
                    alt={book.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-all" 
                  />
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                  <span className="text-sm font-black text-gray-900">{book.price} €</span>
                </div>
              </NextLink>

              <div className="flex-1">
                <h3 className="font-bold text-gray-900 leading-tight mb-1">{book.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{book.author}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                  <Store size={14} className="text-indigo-500" />
                  {book.shop?.name || "Librairie locale"}
                </div>
              </div>

              <button
                onClick={() => handleReserve(book.id)}
                disabled={isPending || book.stock === 0}
                className="mt-4 w-full py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <ShoppingCart size={18} />
                )}
                {book.stock === 0 ? "En rupture" : "Réserver"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-[40px]">
          <p className="text-gray-400 font-medium text-lg">Aucun livre ne correspond à votre recherche.</p>
        </div>
      )}
    </>
  );
}