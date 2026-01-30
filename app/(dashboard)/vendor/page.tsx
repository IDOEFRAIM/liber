import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { shops } from "@/db/schema/shops";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { reservationService } from "@/services/reservations.service";
import { Store, Package, User, Calendar } from "lucide-react";
import AdminStatusSelector from "@/components/vendor/AdminStatusCollector";

export default async function VendorDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // 1. Trouver le shop de l'utilisateur
  const shop = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session.userId),
  });

  if (!shop) {
    return (
      <div className="p-12 text-center bg-white rounded-[40px] shadow-sm">
        <Store className="mx-auto text-gray-200 mb-4" size={48} />
        <h2 className="text-xl font-bold">Aucun magasin trouvé</h2>
        <p className="text-gray-500">Vous devez créer un magasin pour gérer des réservations.</p>
      </div>
    );
  }

  // 2. Récupérer les réservations via ton service
  const shopReservations = await reservationService.getShopReservations(shop.id);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Gestion des Réservations</h1>
        <p className="text-gray-500">Gérez les retraits pour <span className="text-indigo-600 font-bold">{shop.name}</span></p>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Livre</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Client</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Date</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {shopReservations.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-14 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                      {res.book.imageUrl && <img src={res.book.imageUrl} className="object-cover w-full h-full" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 leading-tight">{res.book.title}</p>
                      <p className="text-xs text-gray-400">{res.book.price} €</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700">{res.user.name}</span>
                    <span className="text-xs text-gray-400">{res.user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-gray-500">
                    {new Date(res.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  {/* Sélecteur de statut interactif */}
                  <AdminStatusSelector reservationId={res.id} currentStatus={res.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {shopReservations.length === 0 && (
          <div className="p-20 text-center">
            <Package className="mx-auto text-gray-200 mb-2" size={40} />
            <p className="text-gray-400 font-medium">Aucune réservation pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}