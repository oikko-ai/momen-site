import type { Note, Project, Site } from "./cms";
import { siteUrl } from "./url";

// Structured data (schema.org JSON-LD) so search engines and AI assistants can read who Momen is,
// what he made and what each page is about. Everything is built from the CMS.
const abs = (path?: string) => (!path ? undefined : path.startsWith("http") ? path : `${siteUrl}${path}`);
export const ids = { person: `${siteUrl}/#person`, org: `${siteUrl}/#organization`, site: `${siteUrl}/#website` };

export const siteGraph = (site: Site) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": ids.site,
      url: siteUrl,
      name: site.name,
      description: site.seo.description || site.intro,
      inLanguage: "en",
      publisher: { "@id": ids.person },
    },
    {
      "@type": "Person",
      "@id": ids.person,
      name: site.name,
      url: siteUrl,
      ...(site.portrait && { image: abs(site.portrait.url) }),
      jobTitle: site.jobTitle,
      description: site.intro,
      email: `mailto:${site.email}`,
      ...(site.city && { address: { "@type": "PostalAddress", addressLocality: site.city } }),
      ...(site.orgName && { worksFor: { "@id": ids.org } }),
      knowsAbout: site.knowsAbout,
      sameAs: site.socials.map((s) => s.href).filter((h) => h.startsWith("http")),
    },
    ...(site.orgName
      ? [{ "@type": "Organization", "@id": ids.org, name: site.orgName, url: site.orgUrl || undefined, description: site.orgDescription || undefined, founder: { "@id": ids.person } }]
      : []),
  ],
});

const crumbs = (items: [string, string][]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});

export const projectGraph = (p: Project, workTitle: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CreativeWork",
      "@id": `${siteUrl}/work/${p.slug}#work`,
      name: p.title,
      headline: p.subtitle || p.title,
      description: p.seo.description || p.intro,
      url: abs(`/work/${p.slug}`),
      ...(p.image && !p.image.video && { image: abs(p.image.url) }),
      creator: { "@id": ids.person },
      // Sample personas are left out: only real people go into structured data.
      contributor: p.teamMembers.filter((m) => !m.demo).map((m) => ({ "@type": "Person", name: m.name, ...(m.href && { url: m.href }) })),
      ...(p.client && { sponsor: { "@type": "Organization", name: p.client.name, ...(p.client.href && { url: p.client.href }) } }),
      keywords: p.services.join(", "),
      ...(/^\d{4}/.test(p.year) && { dateCreated: p.year.slice(0, 4) }),
      ...(p.updatedAt && { dateModified: p.updatedAt }),
    },
    crumbs([["Home", "/"], [workTitle, "/work"], [p.title, `/work/${p.slug}`]]),
  ],
});

export const noteGraph = (n: Note, notesTitle: string, siteName: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": `${siteUrl}/notes/${n.slug}#article`,
      headline: n.title,
      description: n.seo.description || n.summary,
      url: abs(`/notes/${n.slug}`),
      mainEntityOfPage: abs(`/notes/${n.slug}`),
      datePublished: n.date,
      dateModified: n.updatedAt || n.date,
      ...(n.cover && !n.cover.video && { image: abs(n.cover.url) }),
      author: { "@id": ids.person },
      publisher: { "@id": ids.person },
      isPartOf: { "@type": "Blog", name: `${siteName}: ${notesTitle}`, url: abs("/notes") },
      interactionStatistic: { "@type": "InteractionCounter", interactionType: "https://schema.org/LikeAction", userInteractionCount: n.likes },
    },
    crumbs([["Home", "/"], [notesTitle, "/notes"], [n.title, `/notes/${n.slug}`]]),
  ],
});

export const aboutGraph = (faq: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "ProfilePage", "@id": `${siteUrl}/about#page`, url: abs("/about"), mainEntity: { "@id": ids.person } },
    ...(faq.length
      ? [{ "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }]
      : []),
  ],
});
