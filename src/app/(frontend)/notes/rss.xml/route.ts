import { getNotes, getPages, getSite } from "@/lib/cms";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// RSS feed of notes. Set NEXT_PUBLIC_SITE_URL to the site's address so links are absolute.
export async function GET() {
  const [notes, site, pages] = await Promise.all([getNotes(), getSite(), getPages()]);
  const base = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "")).replace(/\/$/, "");
  const items = notes
    .map((n) => {
      const link = n.href || `${base}/notes/${n.slug}`;
      return `<item><title>${esc(n.title)}</title><link>${esc(link)}</link><guid>${esc(link)}</guid>${n.date ? `<pubDate>${new Date(n.date).toUTCString()}</pubDate>` : ""}${n.summary ? `<description>${esc(n.summary)}</description>` : ""}</item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(`${site.name} · ${pages.notes.title}`)}</title><link>${esc(`${base}/notes`)}</link><description>${esc(pages.notes.signupText)}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
