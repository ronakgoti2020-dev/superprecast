import { existsSync } from "fs";
import path from "path";

export function projectRoot() {
  const candidates = [process.cwd(), "/var/www/superprecast"];
  for (const dir of candidates) {
    if (existsSync(path.join(dir, "package.json"))) return dir;
  }
  return process.cwd();
}

export function uploadsDir() {
  return path.join(projectRoot(), "public", "uploads");
}
