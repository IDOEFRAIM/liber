import { db } from "@/db";
import { users } from "@/db/schema/users";
import { shops } from "@/db/schema/shops";
import { reservations } from "@/db/schema/reservations";
import { books } from "@/db/schema/books";
import { eq, sql, count, desc } from "drizzle-orm";
import { Users, Store, BarChart3, TrendingUp, ShieldCheck } from "lucide-react";
import VerificationToggle from "@/components/utils/VerificationToogle";

export default async function SuperAdminDashboard() {
  // Statistiques (Promesses exécutées en parallèle pour la performance)
  const [userCount] = await db.select({ value: count() }).from(users);
  const [shopCount] = await db.select({ value: count() }).from(shops);
  const [resCount] = await db.select({ value: count() }).from(reservations);

  //  Calcul du revenu (Somme des prix des livres dont le statut est 'collected')
  const [revenueResult] = await db
    .select({
      total: sql<number>`sum(CAST(${books.price} AS DECIMAL))`
    })
    .from(reservations)
    .innerJoin(books, eq(reservations.bookId, books.id))
    .where(eq(reservations.status, "collected"));

  //  LA REQUÊTE CLÉ : On utilise des alias (shopName, ownerName)
  const allShops = await db
    .select({
      id: shops.id,
      shopName: shops.name,      // Alias pour éviter le conflit
      logoUrl: shops.logoUrl,
      isVerified: shops.isVerified,
      createdAt: shops.createdAt,
      ownerName: users.name,     // Alias pour éviter le conflit
      ownerEmail: users.email,
    })
    .from(shops)
    .innerJoin(users, eq(shops.ownerId, users.id))
    .orderBy(desc(shops.createdAt));

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Console Master</h1>
        </div>

        {/* Grille de stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Utilisateurs" value={userCount.value} icon={<Users />} color="bg-blue-500" />
          <StatCard title="Librairies" value={shopCount.value} icon={<Store />} color="bg-indigo-500" />
          <StatCard title="Réservations" value={resCount.value} icon={<BarChart3 />} color="bg-emerald-500" />
          <StatCard 
            title="CA Global" 
            value={`${Number(revenueResult?.total || 0).toFixed(2)}€`} 
            icon={<TrendingUp />} 
            color="bg-amber-500" 
          />
        </div>

        {/* Tableau des boutiques */}
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Librairie</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Propriétaire</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">Contrôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allShops.map((shop) => (
                <tr key={shop.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-900">{shop.shopName}</td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-700">{shop.ownerName}</p>
                    <p className="text-xs text-slate-400">{shop.ownerEmail}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <VerificationToggle shopId={shop.id} isVerified={shop.isVerified} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center gap-5">
      <div className={`${color} p-4 rounded-2xl text-white`}>{icon}</div>
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}