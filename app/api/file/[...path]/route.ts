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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const parts = (await params).path || [];
  let folder: "products" | "uploads" = "uploads";
  let name = "";
  if (parts.length >= 2 && (parts[0] === "products" || parts[0] === "uploads")) {
    folder = parts[0];
    name = parts[1];
  } else if (parts.length === 1) {
    name = parts[0];
  }

  if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const data = await readFile(path.join(mediaDir(folder), name));
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
