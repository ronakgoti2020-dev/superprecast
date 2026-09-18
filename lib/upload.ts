import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function saveUpload(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  if (!allowed.includes(ext)) {
    throw new Error("Only JPG, PNG, WEBP, or GIF images are allowed.");
  }
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}

export function formFiles(form: FormData, key: string) {
  return form
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

