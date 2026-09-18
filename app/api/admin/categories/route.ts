import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { name, description } = await request.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const base = slugify(String(name)) || "category";
  let slug = base;
  let i = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  const category = await prisma.category.create({
    data: {
      name: String(name),
      slug,
      description: String(description || ""),
    },
  });
  return NextResponse.json(category);
}
