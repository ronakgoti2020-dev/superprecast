import { existsSync } from "fs";
import path from "path";

export function projectRoot() {
  const candidates = [process.cwd(), "/var/www/superprecast"];
  for (const dir of candidates) {
    if (existsSync(path.join(dir, "package.json"))) return dir;
  }
  return process.cwd();
}

export function mediaDir(folder: "products" | "uploads") {
  return path.join(projectRoot(), "public", folder);
}

export function uploadsDir() {
  return mediaDir("uploads");
}
