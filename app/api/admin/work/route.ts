import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { collectProjectImages, replaceProjectImages } from "@/lib/project-images";

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await request.formData();
  const title = String(form.get("title") || "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  let urls: string[] = [];
  try {
    urls = await collectProjectImages(form);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save photos";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      title,
      location: String(form.get("location") || "").trim(),
      year: String(form.get("year") || "").trim(),
      description: String(form.get("description") || ""),
      featured: form.get("featured") === "true" || form.get("featured") === "on",
      image: urls[0] || null,
    },
  });
  await replaceProjectImages(project.id, urls);
  return NextResponse.json(project);
}
