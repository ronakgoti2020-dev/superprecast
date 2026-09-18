export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatPrice(price?: number | null, unit = "Piece") {
  if (price == null) return "Ask for price";
  return `₹ ${price.toLocaleString("en-IN")} / ${unit}`;
}

export function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
