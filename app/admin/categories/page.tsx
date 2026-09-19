import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Categories</h1>
      <p className="mt-2 mb-8 text-ink-soft">{categories.length} categories in the catalogue</p>
      <CategoryManager categories={categories} />
    </div>
  );
}
