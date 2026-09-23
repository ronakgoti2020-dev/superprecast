import { prisma } from "./prisma";

export type SiteSettings = {
  id: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  gst: string;
  owner: string;
  instagram: string;
  mapUrl: string;
  logo: string;
};

function readSettings(row: object): SiteSettings {
  const value = row as Record<string, unknown>;
  return {
    id: String(value.id ?? "site"),
    phone: String(value.phone ?? ""),
    email: String(value.email ?? ""),
    whatsapp: String(value.whatsapp ?? ""),
    address: String(value.address ?? ""),
    gst: String(value.gst ?? ""),
    owner: String(value.owner ?? ""),
    instagram: String(value.instagram ?? ""),
    mapUrl: String(value.mapUrl ?? ""),
    logo: String(value.logo ?? ""),
  };
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      "SELECT * FROM Setting WHERE id = ?",
      "site",
    );
    if (rows[0]) return readSettings(rows[0]);
  } catch {
    // Fall back to Prisma types if the raw table read fails.
  }
  const existing = await prisma.setting.findUnique({ where: { id: "site" } });
  if (existing) return readSettings(existing);
  return readSettings(
    await prisma.setting.create({
      data: { id: "site" },
    }),
  );
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
