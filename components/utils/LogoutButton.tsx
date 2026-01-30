"use client";
import { logoutAction } from "@/actions/auth.action";

export default function LogoutButton() {
  return (
    <button
      onClick={() => logoutAction()}
      className="text-sm font-medium text-red-500 hover:text-red-700"
    >
      Déconnexion
    </button>
  );
}