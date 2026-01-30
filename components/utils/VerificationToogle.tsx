"use client";

import { useTransition } from "react";
import { verifyShopAction } from "@/actions/admin.action";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function VerificationToggle({ 
  shopId, 
  isVerified 
}: { 
  shopId: string; 
  isVerified: boolean; 
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await verifyShopAction(shopId, isVerified);
      if (result?.error) alert(result.error);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
        isVerified 
          ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" 
          : "bg-slate-50 text-slate-400 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
      }`}
    >
      {isPending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isVerified ? (
        <CheckCircle size={14} />
      ) : (
        <XCircle size={14} />
      )}
      {isVerified ? "Vérifié" : "En attente"}
    </button>
  );
}