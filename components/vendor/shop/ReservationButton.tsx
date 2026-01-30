"use client";

import { useState } from "react";
import { createReservationAction } from "@/actions/reservations.action";
import { Loader2, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner"; // Ou ta bibliothèque de notifications préférée
import { useRouter } from "next/navigation";

interface ReservationButtonProps {
  bookId: string;
  stock: number;
  userId?: string;
}

export default function ReservationButton({ bookId, stock, userId }: ReservationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleReservation = async (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation si le bouton est dans un lien
    
    if (!userId) {
      toast.error("Vous devez être connecté pour réserver.");
      return router.push("/login");
    }

    if (stock <= 0) return;

    setLoading(true);
    try {
      const result = await createReservationAction(bookId);

      if (result.error) {
        toast.error(result.error);
      } else {
        setSuccess(true);
        toast.success("Livre réservé avec succès !");
        router.refresh(); // Met à jour le stock visuellement
      }
    } catch (err) {
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // État : Rupture de stock
  if (stock <= 0) {
    return (
      <button 
        disabled 
        className="w-full py-3 px-6 bg-slate-100 text-slate-400 rounded-2xl font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
      >
        <AlertCircle size={18} />
        Rupture
      </button>
    );
  }

  // État : Succès temporaire après clic
  if (success) {
    return (
      <button 
        disabled 
        className="w-full py-3 px-6 bg-emerald-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
      >
        <CheckCircle size={18} />
        Réservé !
      </button>
    );
  }

  return (
    <button
      onClick={handleReservation}
      disabled={loading}
      className={`
        w-full py-3 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2
        ${loading 
          ? "bg-slate-100 text-slate-400 cursor-wait" 
          : "bg-white text-slate-900 hover:bg-indigo-600 hover:text-white shadow-xl active:scale-95"}
      `}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <>
          <ShoppingCart size={18} />
          Réserver
        </>
      )}
    </button>
  );
}