import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { ArrowRight, Plus } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { aboutGraph } from "@/lib/schema";
import { getAbout, getAwards, getPages, getPapers, getPlayground, getSite } from "@/lib/cms";
import Portrait from "@/components/Portrait";
import Visual from "@/components/Visual";
import PageHead from "@/components/PageHead";

export async function generateMetadata(): Promise<Metadata> {
  const [p, about, site] = await Promise.all([getPages(), getAbout(), getSite()]);
  return pageMeta({ title: p.about.title, description: about.body[0] || site.intro, path: "/about", seo: about.seo, kicker: site.jobTitle, type: "profile" });
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-section grid gap-8 border-t border-rule pt-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16" data-inview>
      <h2 className="text-h2 font-light">{title}</h2>
      <ul className="space-y-6">{children}</ul>
    </section>
  );
}

// An outside link, or plain content when there is no address yet.
function Ext({ href, className, children }: { href?: string; className?: string; children: React.ReactNode }) {
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <div className={className}>{children}</div>
  );
}

const paperCovers = ["fusion", "graph"] as const;

export default async function About() {
  const [site, about, papers, awards, playground, pages] = await Promise.all([getSite(), getAbout(), getPapers(), getAwards(), getPlayground(), getPages()]);
  const t = pages.about;
  const github = site.socials.find((s) => s.label.toLowerCase() === "github");
  return (
    <div className="wrap">
      <PageHead title={t.title} />

      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 xl:grid-cols-[minmax(0,480px)_minmax(0,1fr)] xl:gap-24">
        <Portrait src={site.portrait?.url} name={site.name} label={pages.labels.portraitPlaceholder} className="rise aspect-[4/5] w-full" />
        <div className="rise md:pt-4" style={{ ["--i" as string]: 2 }}>
          <h2 className="whitespace-pre-line text-h2 font-light">{about.heading}</h2>
          <div className="mt-8 max-w-[62ch] space-y-6 text-lead text-soft">
            {about.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {papers.length > 0 && (
        <Group title={t.researchTitle}>
          {papers.map((p, i) => (
            <li key={p.title}>
              <Ext href={p.href} className="flex items-center gap-5">
                <Visual media={p.image} cover={paperCovers[i % 2]} sizes="160px" className="aspect-[16/10] w-28 shrink-0 rounded-lg md:w-40" />
                <div>
                  <p className="text-lead">{p.title}</p>
                  <p className="mt-1 text-small text-soft">{[p.venue && `${p.venue}, ${p.year}`, p.status].filter(Boolean).join(" · ")}</p>
                </div>
              </Ext>
            </li>
          ))}
        </Group>
      )}

      {awards.length > 0 && (
        <Group title={t.recognitionTitle}>
          {awards.map((a) => (
            <li key={a.title + a.where} className="text-lead">
              {a.title}{" "}
              <span className="text-soft">
                {a.where}
                {a.year && `, ${a.year}`}
              </span>
            </li>
          ))}
        </Group>
      )}

      {playground.length > 0 && (
        <Group title={t.playgroundTitle}>
          {playground.map((p) => (
            <li key={p.title} className="text-lead">
              <Ext href={p.href} className="group">
                {p.title} <span className="text-soft transition-colors group-hover:text-ink">{p.body}</span>
              </Ext>
            </li>
          ))}
          {github && (
            <li>
              <a href={github.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-small text-soft hover:text-ink">
                {t.githubLabel} <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size="1em" strokeWidth={1.75} aria-hidden />
              </a>
            </li>
          )}
        </Group>
      )}
      {about.faq.length > 0 && (
        <section className="mt-section grid gap-8 border-t border-rule pt-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16" data-inview>
          <h2 className="text-h2 font-light">{about.faqTitle}</h2>
          <div className="divide-y divide-rule">
            {about.faq.map((f) => (
              <details key={f.question} className="group py-5 first:pt-0" name="faq">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lead [&::-webkit-details-marker]:hidden">
                  <h3 className="font-normal">{f.question}</h3>
                  <Plus className="mt-1.5 h-5 w-5 shrink-0 text-soft transition-transform duration-300 group-open:rotate-45" strokeWidth={1.5} aria-hidden />
                </summary>
                <p className="mt-3 max-w-[60ch] text-body text-soft">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
      <JsonLd data={aboutGraph(about.faq)} />
    </div>
  );
}
