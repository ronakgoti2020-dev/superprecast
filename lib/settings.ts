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

function coordsEmbed(lat: string, lng: string) {
  return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=17&output=embed`;
}

function embedFromMapsUrl(url: string) {
  const raw = url.trim();
  if (!raw) return "";

  if (raw.includes("/maps/embed")) {
    return raw.match(/https?:\/\/[^\s"'<>]+/)?.[0] || raw;
  }

  const pin = raw.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  const at = raw.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  const lat = pin?.[1] || at?.[1];
  const lng = pin?.[2] || at?.[2];
  if (lat && lng) return coordsEmbed(lat, lng);
  return "";
}

async function resolveShortMapsUrl(url: string) {
  let current = url;
  for (let i = 0; i < 8; i += 1) {
    const response = await fetch(current, {
      method: "GET",
      redirect: "manual",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      },
    });
    const location = response.headers.get("location");
    if (location) {
      current = new URL(location, current).toString();
      if (embedFromMapsUrl(current)) return current;
      continue;
    }
    const html = await response.text();
    const match = html.match(/https:\/\/www\.google\.com\/maps\/place\/[^\s"'<>]+/);
    if (match?.[0]) return match[0].replace(/&amp;/g, "&");
    return response.url || current;
  }
  return current;
}

const embedCache = new Map<string, string>();

export async function resolveMapsEmbedSrc(mapUrl?: string | null) {
  const raw = mapUrl?.trim() || "";
  if (!raw) return "";
  const cached = embedCache.get(raw);
  if (cached) return cached;

  let embed = embedFromMapsUrl(raw);
  if (!embed && /maps\.app\.goo\.gl|goo\.gl\/maps/i.test(raw)) {
    try {
      embed = embedFromMapsUrl(await resolveShortMapsUrl(raw));
    } catch {
      embed = "";
    }
  }
  if (embed) embedCache.set(raw, embed);
  return embed;
}

export function mapsEmbedSrc(mapUrl?: string | null) {
  return embedFromMapsUrl(mapUrl || "");
}
