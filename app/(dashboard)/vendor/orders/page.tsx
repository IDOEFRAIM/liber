import { db } from "@/db";
import { reservations } from "@/db/schema/reservations";
import { books } from "@/db/schema/books";
import { users } from "@/db/schema/users";
import { shops } from "@/db/schema/shops";
import { eq, desc, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth"; // Ton utilitaire d'auth
import { redirect } from "next/navigation";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Search, 
  ShoppingBag 
} from "lucide-react";
import AdminStatusSelector from "@/components/vendor/AdminStatusCollector";

export default async function ShopOrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Récupérer le shop du vendeur connecté
  const shop = await db.query.shops.findFirst({
    where: eq(shops.ownerId, session.userId),
  });

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag size={64} className="text-slate-200 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Aucune boutique trouvée</h2>
        <p className="text-slate-500">Vous devez créer une boutique pour recevoir des commandes.</p>
      </div>
    );
  }

  // Récupérer les réservations avec les infos client et livre
  const orders = await db
    .select({
      id: reservations.id,
      status: reservations.status,
      createdAt: reservations.createdAt,
      bookTitle: books.title,
      bookPrice: books.price,
      customerName: users.name,
      customerEmail: users.email,
    })
    .from(reservations)
    .innerJoin(books, eq(reservations.bookId, books.id))
    .innerJoin(users, eq(reservations.userId, users.id))
    .where(eq(reservations.shopId, shop.id))
    .orderBy(desc(reservations.createdAt));

  const pendingCount = orders.filter(o => o.status === "pending").length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header avec Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Commandes Clients</h1>
          <p className="text-slate-500 font-medium">Gérez les réservations pour <span className="text-indigo-600 font-bold">{shop.name}</span></p>
        </div>

        <div className="flex gap-4">
          <div className="bg-orange-50 border border-orange-100 px-6 py-3 rounded-2xl flex items-center gap-3">
            <Clock className="text-orange-500" size={20} />
            <div>
              <p className="text-[10px] font-black uppercase text-orange-400 leading-none">En attente</p>
              <p className="text-xl font-black text-orange-600">{pendingCount}</p>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="text-emerald-500" size={20} />
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-400 leading-none">Terminées</p>
              <p className="text-xl font-black text-emerald-600">{orders.length - pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche  */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher un client ou un livre..." 
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
        />
      </div>

      {/* Tableau des commandes */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Livre</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Client</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {order.bookTitle}
                    </p>
                    <p className="text-sm font-black text-indigo-500">{order.bookPrice} €</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-700">{order.customerName}</p>
                    <p className="text-xs text-slate-400">{order.customerEmail}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-slate-500 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {/* Le sélecteur de statut que nous avons créé précédemment */}
                    <AdminStatusSelector 
                      reservationId={order.id} 
                      currentStatus={order.status} 
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400">
                  <Package size={40} className="mx-auto mb-3 opacity-20" />
                  <p>Aucune commande pour le moment.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}