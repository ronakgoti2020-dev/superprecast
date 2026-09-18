import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { uploadsDir } from "./paths";

const allowedExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const typeToExt: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function extensionFor(file: File) {
  const fromName = path.extname(file.name).toLowerCase();
  if (allowedExt.includes(fromName)) return fromName;
  return typeToExt[file.type] || "";
}

export async function saveUpload(file: File) {
  const ext = extensionFor(file);
  if (!ext) {
    throw new Error("Only JPG, PNG, WEBP, or GIF images are allowed.");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const dir = uploadsDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}

function isUploadedFile(value: FormDataEntryValue): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as File).arrayBuffer === "function" &&
    typeof (value as File).size === "number" &&
    (value as File).size > 0
  );
}

export function formFiles(form: FormData, key: string) {
  return form.getAll(key).filter(isUploadedFile);
}
