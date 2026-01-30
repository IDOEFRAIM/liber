"use client";

import { useTransition } from "react";
import { updateReservationStatusAction, type ReservationStatus } from "@/actions/reservations.action";
import { Loader2, Lock } from "lucide-react";

export default function AdminStatusSelector({ 
  reservationId, 
  currentStatus 
}: { 
  reservationId: string, 
  currentStatus: string 
}) {
  const [isPending, startTransition] = useTransition();

  // On détermine si le statut est "final" (Annulé ou Récupéré)
  const isFinalStatus = currentStatus === "cancelled" || currentStatus === "collected";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as ReservationStatus;
    
    startTransition(async () => {
      const result = await updateReservationStatusAction(reservationId, nextStatus);
      if (result?.error) {
        alert(result.error);
      }
    });
  };

  return (
    <div className="relative inline-block">
      {isPending && (
        <div className="absolute -left-6 top-1/2 -translate-y-1/2">
          <Loader2 size={14} className="animate-spin text-indigo-600" />
        </div>
      )}

      <div className="flex items-center gap-2">
        <select
          value={currentStatus}
          onChange={handleChange}
          // On désactive si c'est en cours de chargement OU si le statut est déjà final
          disabled={isPending || isFinalStatus}
          className={`text-xs font-black uppercase tracking-widest px-3 py-2 rounded-xl border-none ring-1 ring-inset outline-none transition-all
            ${isFinalStatus ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:ring-indigo-300'}
            ${currentStatus === 'collected' ? 'bg-indigo-50 text-indigo-700 ring-indigo-100' : 
              currentStatus === 'cancelled' ? 'bg-red-50 text-red-700 ring-red-100' : 
              currentStatus === 'confirmed' ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' :
              'bg-orange-50 text-orange-700 ring-orange-100'}
          `}
        >
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmé</option>
          <option value="collected">Récupéré (Payé)</option>
          <option value="cancelled">Annulé</option>
        </select>

        {isFinalStatus && (
          <Lock size={12} className="text-gray-300">
            <title>Statut final verrouillé</title>
          </Lock>
        )}
      </div>
    </div>
  );
}