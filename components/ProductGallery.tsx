"use client";

import { useState } from "react";
import { ProductVisual } from "./ProductVisual";
import { ProductPhoto } from "./ProductPhoto";

export function ProductGallery({
  images,
  name,
  design,
  color,
}: {
  images: string[];
  name: string;
  design?: string | null;
  color?: string | null;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden border border-ink/10 bg-paper">
        {current ? (
          <ProductPhoto src={current} alt={name} />
        ) : (
          <ProductVisual design={design} color={color} className="h-full w-full" />
        )}
      </div>
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-square overflow-hidden border ${
                index === active ? "border-terracotta" : "border-ink/10"
              }`}
              aria-label={`Show photo ${index + 1}`}
            >
              <ProductPhoto src={src} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
