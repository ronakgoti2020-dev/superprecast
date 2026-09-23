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

export function logoSrc(value?: string | null) {
  const raw = value?.trim() || "";
  return raw || "/logo.png";
}

export function mapsHref(value?: string | null) {
  const raw = value?.trim() || "";
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`;
}

export function mapsEmbedSrc(mapUrl?: string | null, address?: string | null) {
  const raw = mapUrl?.trim() || "";
  const place = address?.trim() || "";
  if (!raw) return "";

  if (raw.includes("/maps/embed")) {
    return raw.match(/https?:\/\/[^\s"'<>]+/)?.[0] || raw;
  }

  const at = raw.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (at) {
    return `https://maps.google.com/maps?q=${at[1]},${at[2]}&z=16&output=embed`;
  }

  const coords = raw.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (coords) {
    return `https://maps.google.com/maps?q=${coords[1]},${coords[2]}&z=16&output=embed`;
  }

  const named = raw.match(/\/maps\/place\/([^/]+)/);
  if (named) {
    return `https://maps.google.com/maps?q=${named[1]}&z=16&output=embed`;
  }

  const query = place || raw;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
}
