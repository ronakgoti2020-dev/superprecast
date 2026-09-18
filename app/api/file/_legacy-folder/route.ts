import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { mediaDir } from "@/lib/paths";

const types: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const folders = new Set(["products", "uploads"]);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ folder: string; name: string }> },
) {
  const { folder, name } = await params;
  if (
    !folders.has(folder) ||
    !name ||
    name.includes("..") ||
    name.includes("/") ||
    name.includes("\\")
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const data = await readFile(path.join(mediaDir(folder as "products" | "uploads"), name));
    const ext = path.extname(name).toLowerCase();
    return new NextResponse(data, {
      headers: {
        "Content-Type": types[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
