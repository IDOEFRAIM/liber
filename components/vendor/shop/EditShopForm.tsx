"use client";

import { useActionState, useState } from "react";
import { updateShopAction } from "@/actions/shop.action";
import { Store, MapPin, Upload, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function EditShopForm({ shop }: { shop: any }) {
  const updateShopWithId = updateShopAction.bind(null, shop.id);
  const [state, formAction, isPending] = useActionState(updateShopWithId, null);
  const [preview, setPreview] = useState(shop.logoUrl);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <form action={formAction} className="space-y-6 bg-white p-8 rounded-3xl border shadow-sm">
      {state?.success && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold">
          <CheckCircle2 size={18} /> Modifications enregistrées !
        </div>
      )}

      {/* Logo Preview */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="relative w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden group">
          {preview ? (
            <Image src={preview} alt="Logo" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
              <Upload />
            </div>
          )}
          <input type="file" name="logo" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoChange} />
        </div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Logo de la boutique</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Store size={16} className="text-indigo-500" /> Nom
          </label>
          <input name="name" defaultValue={shop.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <MapPin size={16} className="text-indigo-500" /> Adresse
          </label>
          <input name="address" defaultValue={shop.address} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Description</label>
          <textarea name="description" defaultValue={shop.description} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
      </div>

      <button
        disabled={isPending}
        className="w-full py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all disabled:opacity-50"
      >
        {isPending ? "Mise à jour..." : "Mettre à jour la boutique"}
      </button>
    </form>
  );
}