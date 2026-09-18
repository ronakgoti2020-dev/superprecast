import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";
import { collectProductImages, replaceProductImages } from "@/lib/product-images";

async function uniqueSlug(base: string, ignoreId?: string) {
  let slug = slugify(base) || "product";
  let i = 1;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${slugify(base)}-${i++}`;
  }
}

function num(value: FormDataEntryValue | null) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function productFields(form: FormData) {
  return {
    name: String(form.get("name") || "").trim(),
    description: String(form.get("description") || ""),
    details: String(form.get("details") || ""),
    price: num(form.get("price")),
    priceUnit: String(form.get("priceUnit") || "Piece"),
    moq: num(form.get("moq")) ? Math.round(num(form.get("moq"))!) : null,
    size: String(form.get("size") || "") || null,
    color: String(form.get("color") || "") || null,
    material: String(form.get("material") || "Concrete"),
    design: String(form.get("design") || "") || null,
    usage: String(form.get("usage") || "") || null,
    shape: String(form.get("shape") || "") || null,
    featured: form.get("featured") === "true" || form.get("featured") === "on",
    inStock: form.get("inStock") === "true" || form.get("inStock") === "on",
    categoryId: String(form.get("categoryId") || ""),
  };
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await request.formData();
  const fields = productFields(form);
  if (!fields.name || !fields.categoryId) {
    return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
  }

  const urls = await collectProductImages(form);
  const product = await prisma.product.create({
    data: {
      ...fields,
      slug: await uniqueSlug(String(form.get("slug") || fields.name)),
      image: urls[0] || null,
    },
  });
  await replaceProductImages(product.id, urls);

  return NextResponse.json(product);
}
