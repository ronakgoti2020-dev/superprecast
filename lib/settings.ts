import { prisma } from "./prisma";

export async function getSettings() {
  const existing = await prisma.setting.findUnique({ where: { id: "site" } });
  if (existing) return existing;
  return prisma.setting.create({
    data: { id: "site" },
  });
}

export function instagramHref(value?: string | null) {
  const raw = value?.trim() || "";
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://instagram.com/${raw.replace(/^@/, "")}`;
}

export function mapsHref(value?: string | null) {
  const raw = value?.trim() || "";
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`;
}
