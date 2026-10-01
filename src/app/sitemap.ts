import type { MetadataRoute } from "next";
import { getAbout, getChat, getNotes, getPages, getProjects, getSite } from "@/lib/cms";
import { siteUrl as site } from "@/lib/url";

export const dynamic = "force-static";

// Every page, case study and note, for search engines. Refreshed whenever the CMS changes.
// Pages ticked "Hide from search engines" in the CMS are left out.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, notes, pages, about, chat, home] = await Promise.all([getProjects(), getNotes(), getPages(), getAbout(), getChat(), getSite()]);
  const list: [string, boolean][] = [
    ["", home.seo.noindex],
    ["/about", about.seo.noindex],
    ["/work", pages.seo("work").noindex],
    ["/notes", pages.seo("notes").noindex],
    ["/photos", pages.seo("photos").noindex],
    ["/clients", pages.seo("clients").noindex],
    ["/people", pages.seo("people").noindex],
    ["/activity", pages.seo("activity").noindex],
    ["/chat", chat.seo.noindex],
    ["/credits", pages.seo("credits").noindex],
  ];
  return [
    ...list.filter(([, hidden]) => !hidden).map(([p]) => ({ url: `${site}${p}`, changeFrequency: "monthly" as const, priority: p ? 0.7 : 1 })),
    ...projects.filter((p) => !p.seo.noindex).map((p) => ({ url: `${site}/work/${p.slug}`, lastModified: p.updatedAt || undefined, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...notes
      .filter((n) => !n.href && !n.seo.noindex)
      .map((n) => ({ url: `${site}/notes/${n.slug}`, lastModified: n.updatedAt || n.date || undefined, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
