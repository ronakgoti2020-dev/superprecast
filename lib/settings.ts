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

function embedFromMapsUrl(url: string) {
  const raw = url.trim();
  if (!raw) return "";

  if (raw.includes("/maps/embed")) {
    return raw.match(/https?:\/\/[^\s"'<>]+/)?.[0] || raw;
  }

  const nameMatch = raw.match(/\/maps\/place\/([^/@]+)/);
  const name = nameMatch
    ? decodeURIComponent(nameMatch[1].replace(/\+/g, " "))
    : "";
  const at = raw.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  const pin = raw.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  const lat = pin?.[1] || at?.[1];
  const lng = pin?.[2] || at?.[2];

  if (name && lat && lng) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(name)}&ll=${lat},${lng}&z=17&output=embed`;
  }
  if (lat && lng) {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
  }
  if (name) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(name)}&z=17&output=embed`;
  }
  return "";
}

async function resolveShortMapsUrl(url: string) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "Mozilla/5.0 Super Precast" },
  });
  return response.url || url;
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
  if (!embed) {
    embed = `https://maps.google.com/maps?q=${encodeURIComponent(raw)}&z=17&output=embed`;
  }
  embedCache.set(raw, embed);
  return embed;
}

export function mapsEmbedSrc(mapUrl?: string | null) {
  return embedFromMapsUrl(mapUrl || "") ||
    (mapUrl?.trim()
      ? `https://maps.google.com/maps?q=${encodeURIComponent(mapUrl.trim())}&z=17&output=embed`
      : "");
}
