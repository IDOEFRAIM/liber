import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/utils/Navbar";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookMarket | Marketplace de livres d'occasion",
  description: "Achetez et vendez des livres d'occasion en toute simplicité.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} h-full bg-white text-slate-900`}>
        <QueryProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            
            <main className="flex-1">
              {children}
            </main>

            <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
              © {new Date().getFullYear()} BookMarket. Fait avec passion.
            </footer>
          </div>
        
          <Toaster richColors position="top-center" closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}