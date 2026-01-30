"use client";

import { useTransition } from "react";
import { updateReservationStatusAction } from "@/actions/reservations.action";
import { Trash2, RotateCcw, Loader2 } from "lucide-react";

export default function CancelReservationButton({ 
  reservationId, 
  status 
}: { 
  reservationId: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  const isCancelled = status === "cancelled";

  const handleToggleStatus = () => {
    const nextStatus = isCancelled ? "pending" : "cancelled";
    
    const message = isCancelled 
      ? "Voulez-vous restaurer cette réservation ?" 
      : "Voulez-vous vraiment annuler cette réservation ?";

    if (!confirm(message)) return;

    startTransition(async () => {
      const result = await updateReservationStatusAction(reservationId, nextStatus);
      if (result?.error) {
        alert(result.error);
      }
    });
  };

  return (
    <button
      onClick={handleToggleStatus}
      disabled={isPending}
      className={`flex items-center gap-2 text-xs font-bold transition-colors disabled:opacity-50 ${
        isCancelled 
          ? "text-indigo-500 hover:text-indigo-700" 
          : "text-red-400 hover:text-red-600"
      }`}
    >
      {isPending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isCancelled ? (
        <RotateCcw size={14} />
      ) : (
        <Trash2 size={14} />
      )}
      {isCancelled ? "Restaurer" : "Annuler"}
    </button>
  );
}