import "server-only";
import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { pages as startPages, type Cover } from "@/content";

// Everything the site shows comes from here, read from the CMS.
const payload = cache(() => getPayload({ config }));

type MediaDoc = { url?: string | null; alt?: string | null; mimeType?: string | null } | number | null | undefined;
export type Media = { url: string; alt: string; video: boolean } | null;
const media = (m: MediaDoc): Media =>
  m && typeof m === "object" && m.url ? { url: m.url, alt: m.alt ?? "", video: !!m.mimeType?.startsWith("video/") } : null;

const str = (v: unknown) => (typeof v === "string" ? v : "");

const all = cache(async (collection: "projects" | "notes" | "photos" | "clients" | "people" | "papers" | "awards" | "playground") => {
  const p = await payload();
  const { docs } = await p.find({ collection, limit: 500, sort: "order", depth: 2 });
  return docs as unknown as Record<string, unknown>[];
});

export type Project = {
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  year: string;
  featured: boolean;
  services: string[];
  team: string;
  teamMembers: Person[];
  credit: string;
  device: Device;
  cover: Cover;
  image: Media;
  intro: string;
  sections: { heading: string; body: string; gallery: GalleryImage[] }[];
};
export type Device = "phone" | "tablet" | "laptop" | "none";
export type Person = { name: string; role: string; bio: string; href?: string; avatar: Media; demo: boolean };
export type GalleryImage = {
  media: Media;
  embed?: string;
  cover: Cover;
  caption: string;
  width: "full" | "twoThirds" | "half" | "third" | "quarter";
  aspect: string;
  fit: "cover" | "contain";
  background: "none" | "dark" | "light";
  frame: "none" | "browser" | "phone";
  likes: number;
};

const person = (m: Record<string, unknown>): Person => ({
  name: str(m.name),
  role: str(m.role),
  bio: str(m.bio),
  href: str(m.href) || undefined,
  avatar: media(m.avatar as MediaDoc),
  demo: !!m.demo,
});

// A linked image or video: YouTube and Vimeo become embeds, video files play inline.
const linked = (url: string): { media: Media; embed?: string } => {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (yt) return { media: null, embed: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0` };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { media: null, embed: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1&loop=1&background=1` };
  return { media: { url, alt: "", video: /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) } };
};
const widths = ["full", "twoThirds", "half", "third", "quarter"] as const;

export const getSite = cache(async () => {
  const s = (await (await payload()).findGlobal({ slug: "site", depth: 1 })) as unknown as Record<string, never>;
  return {
    name: (s.name as string) ?? "",
    email: (s.email as string) ?? "",
    city: (s.city as string) ?? "",
    portrait: media(s.portrait),
    socials: ((s.socials as { label: string; href: string }[]) ?? []).map(({ label, href }) => ({ label, href })),
    tagline: (s.tagline as string) ?? "",
    intro: (s.intro as string) ?? "",
    aboutHeading: (s.aboutHeading as string) ?? "",
    aboutBody: ((s.aboutBody as { text: string }[]) ?? []).map((p) => p.text),
    approach: ((s.approach as { title: string; body: string }[]) ?? []).map(({ title, body }) => ({ title, body })),
    contactHeading: (s.contactHeading as string) ?? "",
  };
});
export type Site = Awaited<ReturnType<typeof getSite>>;

export const getAbout = cache(async () => {
  const a = (await (await payload()).findGlobal({ slug: "about" })) as unknown as { heading?: string; body?: { text: string }[] };
  return { heading: a.heading ?? "", body: (a.body ?? []).map((p) => p.text) };
});

export const getProjects = cache(async (): Promise<Project[]> =>
  (await all("projects")).map((d) => ({
    slug: d.slug as string,
    code: (d.code as string) ?? "",
    title: d.title as string,
    subtitle: d.subtitle as string,
    year: (d.year as string) ?? "",
    featured: !!d.featured,
    services: ((d.services as { name: string }[]) ?? []).map((s) => s.name),
    team: (d.team as string) ?? "",
    teamMembers: ((d.teamMembers as Record<string, unknown>[]) ?? []).filter((m) => m && typeof m === "object").map(person),
    credit: (d.credit as string) ?? "",
    device: ((d.device as Device) ?? "phone") as Device,
    cover: ((d.cover as Cover) ?? "graph") as Cover,
    image: media(d.image as MediaDoc),
    intro: (d.intro as string) ?? "",
    sections: ((d.sections as Record<string, unknown>[]) ?? []).map((s) => ({
      heading: str(s.heading),
      body: str(s.body),
      gallery: ((s.gallery as Record<string, unknown>[]) ?? []).map((g): GalleryImage => {
        const source = str(g.source) || "upload";
        const file = source === "url" && str(g.url) ? linked(str(g.url)) : { media: source === "upload" ? media(g.image as MediaDoc) : null };
        return {
          ...file,
          cover: ((g.cover as Cover) ?? "graph") as Cover,
          caption: str(g.caption),
          width: widths.find((w) => w === g.width) ?? "full",
          aspect: str(g.aspect) || "16/10",
          fit: g.fit === "contain" ? "contain" : "cover",
          background: g.background === "dark" || g.background === "light" ? g.background : "none",
          frame: g.frame === "browser" || g.frame === "phone" ? g.frame : "none",
          likes: typeof g.likes === "number" ? g.likes : 0,
        };
      }),
    })),
  })),
);

const pick = <T,>(rows: Record<string, unknown>[], f: (d: Record<string, unknown>) => T) => rows.map(f);

export const getNotes = cache(async () => pick(await all("notes"), (d) => ({ title: str(d.title), year: str(d.year), href: str(d.href) })));
export const getPhotos = cache(async () => pick(await all("photos"), (d) => ({ image: media(d.image as MediaDoc), caption: str(d.caption) })));
export const getClients = cache(async () =>
  pick(await all("clients"), (d) => ({ name: str(d.name), note: str(d.note), tags: (d.tags as string[]) ?? [], href: str(d.href) || undefined })),
);
export const getPeople = cache(async () => pick(await all("people"), (d) => ({ ...person(d), tags: (d.tags as string[]) ?? [] })));
export const getPapers = cache(async () =>
  pick(await all("papers"), (d) => ({ title: str(d.title), venue: str(d.venue), year: str(d.year), status: str(d.status), href: str(d.href) || undefined, image: media(d.image as MediaDoc) })),
);
export const getAwards = cache(async () => pick(await all("awards"), (d) => ({ title: str(d.title), where: str(d.where), year: str(d.year) })));
export const getPlayground = cache(async () => pick(await all("playground"), (d) => ({ title: str(d.title), body: str(d.body), href: str(d.href) })));

// Page titles and texts. Empty fields fall back to the starting text so a page never shows blank.
export const getPages = cache(async () => {
  const g = (await (await payload()).findGlobal({ slug: "pages" })) as unknown as Record<string, Record<string, unknown> | undefined>;
  const merge = <T extends Record<string, unknown>>(key: string, start: T): T => {
    const v = g[key] ?? {};
    return Object.fromEntries(Object.entries(start).map(([k, d]) => [k, Array.isArray(d) ? ((v[k] as unknown[])?.length ? v[k] : d) : str(v[k]) || (k === "intro" ? "" : d)])) as T;
  };
  return {
    work: merge("work", startPages.work),
    notes: merge("notes", startPages.notes),
    photos: merge("photos", startPages.photos),
    clients: merge("clients", startPages.clients),
    people: merge("people", startPages.people),
    colophon: merge("colophon", startPages.colophon),
  };
});
export type Pages = Awaited<ReturnType<typeof getPages>>;

// Filter chips: "All" plus every tag used, in first-seen order.
export const tagsOf = (rows: { tags: string[] }[]) => ["All", ...new Set(rows.flatMap((r) => r.tags))];
