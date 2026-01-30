"use client";

import { deleteBookAction } from "@/actions/books.action";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

export default function DeleteBookButton({ bookId, imageUrl, shopId }: { bookId: string, imageUrl: string, shopId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer ce livre ?")) return;
    
    setLoading(true);
    await deleteBookAction(bookId, imageUrl, shopId);
    setLoading(false);
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
    </button>
  );
}