import { db } from "@/db";
import { reservations } from "@/db/schema/reservations";
import { getSession } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Clock, CheckCircle2, XCircle, ShoppingBag, MapPin, ReceiptText, ChevronRight } from "lucide-react";
import CancelReservationButton from "@/components/utils/CancelReservation";

export default async function MyReservationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const myReservations = await db.query.reservations.findMany({
    where: eq(reservations.userId, session.userId),
    with: {
      book: {
        with: {
          shop: true,
        },
      },
    },
    orderBy: [desc(reservations.createdAt)],
  });

  // Calcul du total pour les réservations actives
  const totalPrice = myReservations
    .filter((res) => (res.status as string) === "pending" || (res.status as string) === "confirmed")
    .reduce((acc, res) => acc + parseFloat(res.book.price || "0"), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header Statistique */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-2">
            <ShoppingBag size={16} />
            <span>Espace Client</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mes Réservations</h1>
          <p className="text-gray-500 font-medium mt-1">Suivez l'état de vos commandes en temps réel.</p>
        </div>
        
        <div className="bg-white p-2 rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-4 pr-6">
          <div className="bg-indigo-600 h-16 px-6 rounded-[24px] flex flex-col justify-center text-white">
            <span className="text-[10px] font-black uppercase opacity-80 tracking-tighter">Total à payer</span>
            <span className="text-2xl font-black">{totalPrice.toFixed(2)}€</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Paiement sur place</p>
            <p className="text-[10px] text-gray-400">Lors du retrait en librairie</p>
          </div>
        </div>
      </div>

      {myReservations.length > 0 ? (
        <div className="grid gap-4">
          {myReservations.map((res) => (
            <div 
              key={res.id} 
              className={`group relative bg-white border rounded-[32px] p-5 transition-all flex flex-col md:flex-row gap-6 items-center ${
                res.status === 'cancelled' 
                  ? 'opacity-60 grayscale-[0.4] border-gray-100' 
                  : 'border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5'
              }`}
            >
              {/* Cover Livre */}
              <div className="relative w-28 h-36 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 bg-gray-100 border border-gray-50">
                {res.book.imageUrl ? (
                  <Image 
                    src={res.book.imageUrl} 
                    alt={res.book.title} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">📚</div>
                )}
              </div>

              {/* Contenu / Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={res.status} />
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    {new Date(res.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                
                <h3 className={`text-xl font-black truncate ${res.status === 'cancelled' ? 'text-gray-400' : 'text-gray-900'}`}>
                  {res.book.title}
                </h3>
                <p className="text-gray-500 font-bold text-sm mb-4">par {res.book.author}</p>
                
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl text-[11px] font-black text-gray-500 border border-gray-100">
                  <MapPin size={12} className="text-indigo-500" />
                  {res.book.shop.name}
                </div>
              </div>

              {/* Prix & Bouton d'action */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                <div className="text-left md:text-right">
                  <p className={`text-2xl font-black ${res.status === 'cancelled' ? 'text-gray-300 line-through' : 'text-indigo-600'}`}>
                    {parseFloat(res.book.price).toFixed(2)}€
                  </p>
                </div>
                
                {(res.status === "pending" || res.status === "cancelled") && (
                   <CancelReservationButton 
                    reservationId={res.id} 
                    status={res.status} 
                   />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[48px] border-2 border-dashed border-gray-100 shadow-inner">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-gray-200" size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Votre panier est vide</h2>
          <p className="text-gray-400 max-w-xs mx-auto mb-8 font-medium">
            Vous n'avez aucune réservation en cours pour le moment.
          </p>
          <a href="/catalogue" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-gray-200">
            Explorer le catalogue
            <ChevronRight size={18} />
          </a>
        </div>
      )}

      {/* Info Card */}
      <div className="mt-10 p-6 bg-amber-50 rounded-[32px] border border-amber-100/50 flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
        <div className="p-3 bg-white rounded-2xl text-amber-500 shadow-sm shadow-amber-200/50">
            <ReceiptText size={24} />
        </div>
        <div>
          <h4 className="font-black text-amber-900 mb-1 tracking-tight">Comment ça marche ?</h4>
          <p className="text-sm text-amber-800/70 font-medium leading-relaxed">
            Vos réservations sont valables <strong>48 heures</strong>. Passé ce délai, le libraire peut remettre l'ouvrage en vente. Le règlement s'effectue directement en magasin lors du retrait.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs = {
    pending: { label: "En attente", icon: Clock, class: "bg-orange-50 text-orange-600 border-orange-100" },
    confirmed: { label: "Prêt", icon: CheckCircle2, class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    cancelled: { label: "Annulé", icon: XCircle, class: "bg-red-50 text-red-600 border-red-100" },
    collected: { label: "Récupéré", icon: ShoppingBag, class: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  };
  const config = configs[status as keyof typeof configs] || configs.pending;
  const Icon = config.icon;
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${config.class}`}>
      <Icon size={12} strokeWidth={3} />
      {config.label}
    </div>
  );
}