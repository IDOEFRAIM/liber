"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

// On définit le TYPE avec un nom clair
export type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

// On crée le CONTEXTE avec un nom qui ne sera pas exporté directement pour éviter les conflits
const AuthContextValue = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // useMemo garantit que le client n'est pas recréé à chaque rendu
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    user,
    loading,
    signOut,
  };

  return (
    <AuthContextValue.Provider value={value}>
      {children}
    </AuthContextValue.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContextValue);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};