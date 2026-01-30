"use client";

import { useActionState } from "react";
import { updateBookAction } from "@/actions/books.action";
import Link from "next/link"; //
import { ArrowLeft, Loader2, Save, X } from "lucide-react"; // Optionnel pour le style

export default function EditBookForm({ book }: { book: any }) {
  const updateBookWithId = updateBookAction.bind(null, book.id, book.shopId);
  const [state, formAction, isPending] = useActionState(updateBookWithId, null);

  return (
    <form action={formAction} className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      {state?.error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-bold border-l-4 border-red-500">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm text-gray-700">Titre</label>
          <input 
            name="title" 
            defaultValue={book.title} 
            className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm text-gray-700">Auteur</label>
          <input 
            name="author" 
            defaultValue={book.author} 
            className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm text-gray-700">Prix (€)</label>
          <input 
            name="price" 
            type="number" 
            step="0.01" 
            defaultValue={book.price} 
            className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm text-gray-700">Stock</label>
          <input 
            name="stock" 
            type="number" 
            defaultValue={book.stock} 
            className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm text-gray-700">Changer la couverture (laisser vide pour garder l'actuelle)</label>
        <input 
          name="image" 
          type="file" 
          accept="image/*" 
          className="border border-gray-200 p-3 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
        />
      </div>

      <hr className="border-gray-50 my-6" />

      {/* BOUTONS D'ACTION */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Bouton Annuler : renvoie à la liste des livres */}
        <Link
          href="/vendor/books"
          className="flex-1 py-4 px-6 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          <X size={18} />
          Annuler
        </Link>

        {/* Bouton Enregistrer */}
        <button
          type="submit"
          disabled={isPending}
          className="flex-[2] bg-indigo-600 text-white py-4 px-6 rounded-xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Enregistrement...
            </>
          ) : (
            <>
              <Save size={18} />
              Enregistrer les modifications
            </>
          )}
        </button>
      </div>
    </form>
  );
}