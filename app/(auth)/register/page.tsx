"use client";

import { useActionState } from "react";
import { signupAction } from "@/actions/auth.action";
import Link from "next/link";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Créer un compte
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Rejoignez notre marketplace de livres d'occasion.
          </p>
        </div>

        {/* Message d'erreur personnalisé (ex: email déjà pris) */}
        {state?.error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {state.error}
            </div>
          </div>
        )}

        <form action={formAction} className="mt-8 space-y-5">
          <div className="space-y-4">
            {/* Nom Complet */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Nom complet
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="Jean Dupont"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Adresse Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="jean@exemple.com"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Choix du Rôle */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
                Type de compte
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all cursor-pointer"
              >
                <option value="customer">Acheteur (Réserver des livres)</option>
                <option value="vendor">Libraire (Vendre des livres)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:bg-indigo-400 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Création en cours...
              </span>
            ) : "Créer mon compte"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm pt-4">
          <p className="text-gray-600">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}