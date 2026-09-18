import Link from "next/link";
import Image from "next/image";
import { ProductVisual } from "./ProductVisual";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: {
    name: string;
    slug: string;
    price: number | null;
    priceUnit: string;
    color: string | null;
    design: string | null;
    image: string | null;
    category: { name: string };
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden border border-ink/10 bg-paper transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <ProductVisual design={product.design} color={product.color} className="h-full w-full" />
        )}
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-terracotta">
          {product.category.name}
        </p>
        <h3 className="mt-2 font-display text-xl leading-snug">{product.name}</h3>
        <p className="mt-3 text-sm text-ink-soft">
          {formatPrice(product.price, product.priceUnit)}
        </p>
      </div>
    </Link>
  );
}
