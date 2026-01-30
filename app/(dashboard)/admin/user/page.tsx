import { db } from "@/db";
import { users } from "@/db/schema/users";
import { desc } from "drizzle-orm";
import { UserCog, Mail, Calendar, Shield } from "lucide-react";

export default async function AdminUsersPage() {
  const allUsers = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
  });

  return (
    <div className="p-10">
      <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
        <UserCog size={32} className="text-indigo-600" />
        Gestion des Comptes
      </h2>

      <div className="grid gap-4">
        {allUsers.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                {user.name?.[0]}
              </div>
              <div>
                <p className="font-bold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Mail size={12} /> {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Rôle actuel</p>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                  user.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                }`}>
                  {user.role}
                </span>
              </div>
              
              <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-indigo-600">
                <Shield size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}