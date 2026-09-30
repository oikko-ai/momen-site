import "server-only";
import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Cover } from "@/content";

// Everything the site shows comes from here, read from the CMS.
const payload = cache(() => getPayload({ config }));

type MediaDoc = { url?: string | null; alt?: string | null; mimeType?: string | null } | number | null | undefined;
export type Media = { url: string; alt: string; video: boolean } | null;
const media = (m: MediaDoc): Media =>
  m && typeof m === "object" && m.url ? { url: m.url, alt: m.alt ?? "", video: !!m.mimeType?.startsWith("video/") } : null;

const all = cache(async (collection: "projects" | "notes" | "photos" | "clients" | "people" | "papers" | "awards" | "playground") => {
  const p = await payload();
  const { docs } = await p.find({ collection, limit: 500, sort: "order", depth: 1 });
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
  cover: Cover;
  image: Media;
  intro: string;
  sections: { heading: string; body: string; cover: Cover; image: Media }[];
};

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
    cover: ((d.cover as Cover) ?? "graph") as Cover,
    image: media(d.image as MediaDoc),
    intro: (d.intro as string) ?? "",
    sections: ((d.sections as Record<string, unknown>[]) ?? []).map((s) => ({
      heading: s.heading as string,
      body: s.body as string,
      cover: ((s.cover as Cover) ?? "graph") as Cover,
      image: media(s.image as MediaDoc),
    })),
  })),
);

const pick = <T,>(rows: Record<string, unknown>[], f: (d: Record<string, unknown>) => T) => rows.map(f);
const str = (v: unknown) => (typeof v === "string" ? v : "");

export const getNotes = cache(async () => pick(await all("notes"), (d) => ({ title: str(d.title), year: str(d.year), href: str(d.href) })));
export const getPhotos = cache(async () => pick(await all("photos"), (d) => ({ image: media(d.image as MediaDoc), caption: str(d.caption) })));
export const getClients = cache(async () =>
  pick(await all("clients"), (d) => ({ name: str(d.name), note: str(d.note), tags: (d.tags as string[]) ?? [], href: str(d.href) || undefined })),
);
export const getPeople = cache(async () =>
  pick(await all("people"), (d) => ({ name: str(d.name), role: str(d.role), tags: (d.tags as string[]) ?? [], href: str(d.href) || undefined, avatar: media(d.avatar as MediaDoc) })),
);
export const getPapers = cache(async () =>
  pick(await all("papers"), (d) => ({ title: str(d.title), venue: str(d.venue), year: str(d.year), status: str(d.status), href: str(d.href) || undefined, image: media(d.image as MediaDoc) })),
);
export const getAwards = cache(async () => pick(await all("awards"), (d) => ({ title: str(d.title), where: str(d.where), year: str(d.year) })));
export const getPlayground = cache(async () => pick(await all("playground"), (d) => ({ title: str(d.title), body: str(d.body), href: str(d.href) })));
