import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { CategoryCreate } from "@/components/admin/CategoryCreate";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Products</h1>
          <p className="mt-2 text-ink-soft">{products.length} items in the catalogue</p>
        </div>
        <Link href="/admin/products/new" className="bg-terracotta px-5 py-3 text-sm text-cream">
          Add product
        </Link>
      </div>

      <CategoryCreate />

      <div className="mt-8 overflow-x-auto border border-ink/10 bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-sand text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-ink/10">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category.name}</td>
                <td className="px-4 py-3">{formatPrice(product.price, product.priceUnit)}</td>
                <td className="px-4 py-3">
                  {product.featured ? "Featured · " : ""}
                  {product.inStock ? "In stock" : "Out of stock"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${product.id}`} className="mr-4">
                    Edit
                  </Link>
                  <DeleteProductButton id={product.id} name={product.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-ink-soft">{categories.length} categories available</p>
    </div>
  );
}
