"use client";

import { useActionState, useState } from "react";
import { createBookAction } from "@/actions/books.action";
import Link from "next/link";
import { ImagePlus, Loader2, ArrowLeft, Book, User, Euro, Box } from "lucide-react";

interface AddBookFormProps {
  shopId: string;
}

export default function AddBookForm({ shopId }: AddBookFormProps) {
  const [state, formAction, isPending] = useActionState(createBookAction, null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link 
        href="/vendor/books" 
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Retour à l'inventaire
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Ajouter un livre</h1>
        <p className="text-gray-500">Remplissez les détails pour mettre votre ouvrage en vente.</p>
      </div>

      <form action={formAction} className="space-y-8">
        {state?.error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm font-medium">
            {state.error}
          </div>
        )}

        {/* Section Image / Couverture */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-sm font-bold text-gray-700 mb-4">Couverture du livre</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all overflow-hidden relative">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImagePlus className="w-12 h-12 mb-4 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Cliquez pour choisir l'image</span>
                  </p>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">PNG ou JPG (Max 2MB)</p>
                </div>
              )}
              <input 
                name="image" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                required 
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Section Informations Détails */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Book size={16} className="text-indigo-500" /> Titre du livre
              </label>
              <input
                name="title"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="ex: L'Écume des jours"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <User size={16} className="text-indigo-500" /> Auteur
              </label>
              <input
                name="author"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Boris Vian"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Euro size={16} className="text-indigo-500" /> Prix de vente
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Box size={16} className="text-indigo-500" /> Exemplaires en stock
              </label>
              <input
                name="stock"
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="1"
              />
            </div>
          </div>

          {/* Champ caché sécurisé avec le shopId injecté par le serveur */}
          <input type="hidden" name="shopId" value={shopId} />

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-70 flex items-center justify-center gap-3 mt-4"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                Publication en cours...
              </>
            ) : (
              "Publier l'ouvrage"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}