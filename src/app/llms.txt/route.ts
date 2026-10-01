import { getAbout, getNotes, getPages, getProjects, getSite } from "@/lib/cms";
import { siteUrl } from "@/lib/url";

export const dynamic = "force-static";

// /llms.txt: a plain summary of the site for AI assistants (llmstxt.org), rebuilt whenever the CMS changes.
export async function GET() {
  const [site, about, projects, notes, pages] = await Promise.all([getSite(), getAbout(), getProjects(), getNotes(), getPages()]);
  const url = (p: string) => `${siteUrl}${p}`;
  const text = [
    `# ${site.name}`,
    `> ${site.intro}`,
    [`${site.jobTitle}. Based in ${site.city}.`, site.orgName && `Founder of ${site.orgName} (${site.orgUrl}). ${site.orgDescription}`, `Contact: ${site.email}`].filter(Boolean).join("\n"),
    `## About\n${about.body.join("\n\n")}`,
    `## ${pages.work.title}\n${projects.map((p) => `- [${p.title}](${url(`/work/${p.slug}`)}): ${p.subtitle}${p.client ? ` For ${p.client.name}.` : ""}`).join("\n")}`,
    notes.length && `## ${pages.notes.title}\n${notes.map((n) => `- [${n.title}](${n.href ?? url(`/notes/${n.slug}`)}): ${n.summary}`).join("\n")}`,
    about.faq.length && `## ${about.faqTitle}\n${about.faq.map((f) => `### ${f.question}\n${f.answer}`).join("\n\n")}`,
    `## Links\n- [About](${url("/about")})\n- [Chat with an AI that knows this site](${url("/chat")})\n- [Notes RSS](${url("/notes/rss.xml")})\n${site.socials.map((s) => `- [${s.label}](${s.href})`).join("\n")}`,
  ]
    .filter(Boolean)
    .join("\n\n");
  return new Response(text + "\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
