import { db } from "@/db";
import CatalogueList from "@/components/utils/CatalogueList";

export default async function CataloguePage() {
  const allBooks = await db.query.books.findMany({
    with: { shop: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <CatalogueList allBooks={allBooks} />
    </div>
  );
}