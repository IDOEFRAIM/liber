import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="relative bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              Donnez une seconde vie <br />
              <span className="text-indigo-600 font-serif italic">à vos lectures.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
              La marketplace dédiée aux libraires indépendants et aux amoureux des livres d'occasion. 
              Achetez local, vendez facilement.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
              >
                Commencer maintenant
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-gray-700 font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Côté Libraire */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vous êtes Libraire ?</h3>
              <p className="text-gray-600 mb-6">
                Ouvrez votre boutique en quelques clics, listez vos ouvrages d'occasion et touchez de nouveaux lecteurs dans votre région.
              </p>
              <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
                Créer ma boutique &rarr;
              </Link>
            </div>

            {/* Côté Acheteur */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Envie de lire ?</h3>
              <p className="text-gray-600 mb-6">
                Parcourez des milliers de livres d'occasion vérifiés, réservez vos pépites en ligne et récupérez-les en librairie.
              </p>
              <Link href="/books" className="text-green-600 font-semibold hover:underline">
                Explorer les livres &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="mt-auto py-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} BookMarket - Tous droits réservés.
      </footer>
    </div>
  );
}