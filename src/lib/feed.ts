// Shapes and formatting shared by the Activity and Chat pages (server and browser).

export type ActivityItem = {
  id: string;
  kind: "like" | "highlight" | "chat";
  target: "note" | "image" | "video" | "chat";
  title: string;
  href: string;
  quote: string;
  thumb: string;
  cover: string;
  count: number;
  city: string;
  region: string;
  country: string;
  demo: boolean;
  at: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: { role: "visitor" | "assistant"; text: string }[];
  city: string;
  region: string;
  country: string;
  lat?: number;
  lon?: number;
  demo: boolean;
  at: string;
};

type Row = Record<string, unknown>;
const s = (v: unknown) => (typeof v === "string" ? v : "");
const n = (v: unknown) => (typeof v === "number" ? v : undefined);

export const toActivity = (d: Row): ActivityItem => ({
  id: String(d.id),
  kind: (s(d.kind) || "like") as ActivityItem["kind"],
  target: (s(d.target) || "note") as ActivityItem["target"],
  title: s(d.title),
  href: s(d.href),
  quote: s(d.quote),
  thumb: s(d.thumb),
  cover: s(d.cover),
  count: n(d.count) ?? 1,
  city: s(d.city),
  region: s(d.region),
  country: s(d.country),
  demo: !!d.demo,
  at: s(d.createdAt),
});

export const toConversation = (d: Row): Conversation => ({
  id: String(d.id),
  title: s(d.title),
  messages: ((d.messages as Row[]) ?? []).map((m) => ({ role: m.role === "assistant" ? "assistant" : "visitor", text: s(m.text) })),
  city: s(d.city),
  region: s(d.region),
  country: s(d.country),
  lat: n(d.lat),
  lon: n(d.lon),
  demo: !!d.demo,
  at: s(d.createdAt),
});

// "Phoenix, AZ" in the US and Canada, "Dhaka, Bangladesh" elsewhere.
export function placeName(p: { city: string; region: string; country: string }, short = false) {
  let country = p.country;
  try {
    if (p.country && !short) country = new Intl.DisplayNames(["en"], { type: "region" }).of(p.country) ?? p.country;
  } catch {}
  const second = (p.country === "US" || p.country === "CA") && p.region ? p.region : country;
  return [p.city, second === p.city ? "" : second].filter(Boolean).join(", ");
}

export const flag = (code: string) =>
  /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65)) : "";

// "3h", "2d", "5w" from an ISO date.
export function ago(iso: string, now = Date.now()) {
  const m = Math.max(1, Math.round((now - new Date(iso).getTime()) / 60_000));
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return d < 14 ? `${d}d` : `${Math.round(d / 7)}w`;
}

export const shortDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "");
