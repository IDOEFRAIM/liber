"use client";

import { useActionState, useState } from "react";
import { createShopAction } from "@/actions/shop.action";
import { Store, Upload, Loader2, MapPin } from "lucide-react";
import Image from "next/image";

export default function ShopSetupForm() {
  const [state, formAction, isPending] = useActionState(createShopAction, null);
  const [preview, setPreview] = useState<string | null>(null);

  // Gérer la preview du logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form action={formAction} className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
      <div className="p-8 space-y-8">
        {state?.error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
            {state.error}
          </div>
        )}

        {/* Upload du Logo */}
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative w-24 h-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group">
            {preview ? (
              <Image src={preview} alt="Preview" fill className="object-cover" />
            ) : (
              <Upload className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
            )}
            <input 
              type="file" 
              name="logo" 
              accept="image/*" 
              onChange={handleLogoChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Logo de la boutique</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Store size={16} className="text-indigo-500" /> Nom de la boutique
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="ex: Le Repaire du Lecteur"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <MapPin size={16} className="text-indigo-500" /> Adresse physique
            </label>
            <input
              name="address"
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="ex: 12 rue des Archives, Paris"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Description</label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Racontez l'histoire de votre librairie..."
            />
          </div>
        </div>
      </div>

      <div className="p-8 bg-gray-50 border-t border-gray-100">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Ouverture de la boutique...
            </>
          ) : (
            "Lancer ma boutique"
          )}
        </button>
      </div>
    </form>
  );
}