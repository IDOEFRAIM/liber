"use client";

import { useAuth as useSupabaseAuth } from "@/components/providers/auth-provider";
import { useState, useEffect } from "react";

export const useUserRole = () => {
  const { user } = useSupabaseAuth();
  const [role, setRole] = useState<string | null>(null);
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    if (user) {
      const userRole = user.user_metadata?.role;
      setRole(userRole);
      setIsVendor(userRole === "vendor");
    }
  }, [user]);

  return { role, isVendor, isAuthenticated: !!user };
};