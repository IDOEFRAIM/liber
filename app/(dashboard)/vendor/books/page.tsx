import { db } from "@/db";
import { books } from "@/db/schema/books";
import { shops } from "@/db/schema/shops";
import { getSession } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, Package, BookOpen, Search, Pencil } from "lucide-react";
import DeleteBookButton from "@/components/vendor/books/DeleteBookButton";
import Image from "next/image";

export default async function VendorBooksPage() {
  const session = await getSession();
  
  const shop = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session?.userId || ""),
  });

  if (!shop) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
        <p className="text-gray-500 mb-4">Vous n'avez pas encore de boutique.</p>
        <Link href="/vendor/setup" className="text-indigo-600 font-bold underline">
          Créer ma boutique
        </Link>
      </div>
    );
  }

  const vendorBooks = await db.query.books.findMany({
    where: eq(books.shopId, shop.id),
    orderBy: [desc(books.createdAt)],
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Mon Inventaire</h1>
          <p className="text-gray-500 tracking-tight">Gérez vos {vendorBooks.length} références en ligne.</p>
        </div>
        <Link
          href="/vendor/books/add"
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Ajouter un livre
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><BookOpen size={24} /></div>
          <div>
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Titres</p>
            <p className="text-2xl font-black">{vendorBooks.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Package size={24} /></div>
          <div>
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Stock Total</p>
            <p className="text-2xl font-black">{vendorBooks.reduce((acc, b) => acc + b.stock, 0)}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {vendorBooks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Livre</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Prix</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {vendorBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                          {book.imageUrl && (
                            <Image src={book.imageUrl} alt={book.title} fill className="object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-none mb-1">{book.title}</p>
                          <p className="text-xs text-gray-500 font-medium">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900">{book.price}€</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                        book.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {book.stock > 0 ? `${book.stock} en stock` : 'Rupture'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {/* BOUTON ÉDITER */}
                        <Link 
                          href={`/vendor/books/edit/${book.id}`}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Modifier le livre"
                        >
                          <Pencil size={18} />
                        </Link>
                        
                        <DeleteBookButton bookId={book.id} imageUrl={book.imageUrl || ""} shopId={shop.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-24 text-center">
            <div className="inline-flex p-6 bg-gray-50 rounded-full text-gray-300 mb-4">
              <Search size={40} />
            </div>
            <p className="text-gray-500 font-medium">Votre inventaire est vide.</p>
          </div>
        )}
      </div>
    </div>
  );
}