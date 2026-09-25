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

function extractMapsUrl(value: string) {
  const iframe = value.match(/src=["']([^"']+)["']/i);
  if (iframe?.[1]) return iframe[1];
  return value.trim();
}

function placeEmbed(cid: string, name: string, lat: string, lng: string) {
  const encodedCid = encodeURIComponent(cid);
  const encodedName = encodeURIComponent(name);
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3700!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${encodedCid}!2s${encodedName}!5e0!3m2!1sen!2sin`;
}

function embedFromMapsUrl(url: string) {
  const raw = extractMapsUrl(url);
  if (!raw) return "";

  if (raw.includes("/maps/embed")) {
    return raw.match(/https?:\/\/[^\s"'<>]+/)?.[0] || raw;
  }

  const nameMatch = raw.match(/\/maps\/place\/([^/@?]+)/);
  const name = nameMatch
    ? decodeURIComponent(nameMatch[1].replace(/\+/g, " "))
    : "";
  const cid = raw.match(/1s(0x[0-9a-fA-F]+:0x[0-9a-fA-F]+)/i)?.[1] || "";
  const pin = raw.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  const at = raw.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  const lat = pin?.[1] || at?.[1] || "";
  const lng = pin?.[2] || at?.[2] || "";

  if (cid && name && lat && lng) return placeEmbed(cid, name, lat, lng);
  if (cid && lat && lng) return placeEmbed(cid, name || "Super Precast", lat, lng);
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
