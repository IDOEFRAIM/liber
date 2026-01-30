import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const user = await getSession();

  return (
    <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo & Section Principale */}
          <div className="flex items-center gap-10">
            <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tighter">
              Li<span className="text-gray-900">ber</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/catalogue" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                Explorer
              </Link>
            </div>
          </div>

          {/* Navigation Dynamique par Profil */}
          <div className="hidden md:flex items-center gap-6">
            {user?.role === "vendor" && (
              <div className="flex items-center gap-4 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Espace Pro</span>
                <Link href="/vendor/books" className="text-sm font-semibold text-indigo-900 hover:text-indigo-600">
                  Gestion Stock
                </Link>
                <Link href="/vendor/orders" className="text-sm font-semibold text-indigo-900 hover:text-indigo-600">
                  Commandes
                </Link>
              </div>
            )}

            {user?.role === "customer" && (
              <div className="flex items-center gap-6">
                <Link href="/reservations" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                  Mes Achats
                </Link>
                <Link href="/favorites" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                  Favoris
                </Link>
              </div>
            )}
          </div>

          {/* Actions & Profil */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-5">
                {/* Badge de rôle visuel */}
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-bold text-gray-900 leading-none">
                    {user.email ? user.email.split('@')[0] : 'Utilisateur'}
                  </p>                  <p className={`text-[10px] font-medium uppercase ${user.role === 'vendor' ? 'text-orange-500' : 'text-green-500'}`}>
                    {user.role === 'vendor' ? 'Libraire' : 'Lecteur'}
                  </p>
                </div>

                <Link
                  href={user.role === 'vendor' ? '/vendor' : '/'}
                  className="text-sm font-bold px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-sm"
                >
                  Dashboard
                </Link>

                <div className="h-4 w-[1px] bg-gray-200"></div>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-bold bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                >
                  S'ouvrir un compte
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}