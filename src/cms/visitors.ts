import { createHash } from "crypto";
import type { Payload, PayloadRequest, Where } from "payload";

export type Place = { city: string; region: string; country: string; lat?: number; lon?: number };

// Rough location from the hosting platform's request headers (Vercel, then Cloudflare). No IP address is stored.
export function placeOf(req: PayloadRequest): Place {
  const h = (k: string) => {
    const v = req.headers.get(k) ?? "";
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  const num = (k: string) => {
    const n = parseFloat(h(k));
    return Number.isFinite(n) ? Math.round(n * 10) / 10 : undefined;
  };
  return {
    city: h("x-vercel-ip-city") || h("cf-ipcity"),
    region: h("x-vercel-ip-country-region") || h("cf-region-code"),
    country: (h("x-vercel-ip-country") || h("cf-ipcountry")).toUpperCase().slice(0, 2),
    lat: num("x-vercel-ip-latitude") ?? num("cf-iplatitude"),
    lon: num("x-vercel-ip-longitude") ?? num("cf-iplongitude"),
  };
}

// The browser's anonymous id, hashed so the stored value can't be traced back to it.
export const visitorHash = (id: unknown) =>
  typeof id === "string" && id.length >= 8 && id.length <= 64 ? createHash("sha256").update(`visitor:${id}`).digest("hex").slice(0, 24) : "";

export const ipOf = (req: PayloadRequest) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";

// Simple per-address limit kept in memory: at most `max` actions per window.
const buckets = new Map<string, number[]>();
export function allow(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const times = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (times.length >= max) return false;
  buckets.set(key, [...times, now]);
  return true;
}

export type ActivityInput = {
  kind: "like" | "highlight" | "chat";
  target: "note" | "image" | "video" | "chat";
  title?: string;
  href?: string;
  thumb?: string;
  cover?: string;
  quote?: string;
};

// One line on the Activity page. Repeat likes of the same thing by the same visitor within a day add to its count.
export async function logActivity(payload: Payload, req: PayloadRequest, visitor: string, a: ActivityInput) {
  const place = placeOf(req);
  if (visitor && a.kind === "like") {
    const where: Where = {
      and: [
        { visitor: { equals: visitor } },
        { kind: { equals: a.kind } },
        { href: { equals: a.href ?? "" } },
        { createdAt: { greater_than: new Date(Date.now() - 86_400_000).toISOString() } },
      ],
    };
    const { docs } = await payload.find({ collection: "activity", where, limit: 1, depth: 0 });
    const hit = docs[0] as unknown as { id: number; count?: number } | undefined;
    if (hit) {
      await payload.update({ collection: "activity", id: hit.id, data: { count: (hit.count ?? 1) + 1 } as never, context: { skipRefresh: true } });
      return;
    }
  }
  await payload.create({
    collection: "activity",
    data: { ...a, href: a.href ?? "", visitor, count: 1, city: place.city, region: place.region, country: place.country } as never,
    context: { skipRefresh: true },
  });
}

// Visitors see everything that isn't hidden; signed-in editors see all of it.
export const publicUnlessHidden = ({ req }: { req: PayloadRequest }) => (req.user ? true : { hidden: { not_equals: true } });
export const editorsOnly = ({ req }: { req: PayloadRequest }) => !!req.user;
