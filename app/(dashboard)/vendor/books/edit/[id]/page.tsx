import { db } from "@/db";
import { books } from "@/db/schema/books";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditBookForm from "@/components/vendor/books/EditBookForm";

export default async function EditBookPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  if (!id) notFound();

  const book = await db.query.books.findFirst({
    where: eq(books.id, id),
  });

  if (!book) notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-black mb-6">Modifier : {book.title}</h1>
      <EditBookForm book={book} />
    </div>
  );
}