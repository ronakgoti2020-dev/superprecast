"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ProductSearch({
  initialQ = "",
  category,
}: {
  initialQ?: string;
  category?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQ);

  useEffect(() => {
    setValue(initialQ);
  }, [initialQ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      const query = value.trim();
      if (query) params.set("q", query);
      if (category) params.set("category", category);
      const next = params.toString() ? `/products?${params}` : "/products";
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== next) router.replace(next);
    }, 250);
    return () => clearTimeout(timer);
  }, [value, category, router]);

  return (
    <input
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder="Search products"
      className="min-w-56 flex-1 border border-ink/15 bg-paper px-4 py-3"
    />
  );
}
