import type { MetadataRoute } from "next";
import { getNotes, getProjects } from "@/lib/cms";

export const dynamic = "force-static";

const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

// Every page, case study and note, for search engines. Refreshed whenever the CMS changes.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, notes] = await Promise.all([getProjects(), getNotes()]);
  const pages = ["", "/about", "/work", "/notes", "/photos", "/clients", "/people", "/activity", "/chat", "/colophon"];
  return [
    ...pages.map((p) => ({ url: `${site}${p}`, changeFrequency: "monthly" as const, priority: p ? 0.7 : 1 })),
    ...projects.map((p) => ({ url: `${site}/work/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...notes.filter((n) => !n.href).map((n) => ({ url: `${site}/notes/${n.slug}`, lastModified: n.date || undefined, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
