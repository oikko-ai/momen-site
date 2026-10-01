import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getNotes, getPages, getProjects, getTestimonials, type GalleryImage } from "@/lib/cms";
import Visual from "@/components/Visual";
import Team from "@/components/Team";
import Like from "@/components/Like";
import Words from "@/components/Words";
import Testimonials from "@/components/Testimonials";

// Share of the 12-column grid each width takes; small tiles pair up on phones.
const span: Record<GalleryImage["width"], string> = {
  full: "col-span-12",
  twoThirds: "col-span-12 md:col-span-8",
  half: "col-span-12 md:col-span-6",
  third: "col-span-6 md:col-span-4",
  quarter: "col-span-6 md:col-span-3",
};
const panel = { none: "bg-card", dark: "bg-[#141414]", light: "bg-[#eeeeea]" };

function Screen({ g, className = "" }: { g: GalleryImage; className?: string }) {
  if (g.embed)
    return (
      <div className={`relative overflow-hidden bg-black ${className}`}>
        <iframe src={g.embed} title={g.caption || "Video"} allow="autoplay; fullscreen; picture-in-picture" className="absolute inset-0 h-full w-full" />
      </div>
    );
  return <Visual media={g.media} cover={g.cover} fit={g.fit} className={className} />;
}

// One image or video with its frame, panel, caption and like button, all set in the CMS.
function Tile({ g, id, i, target }: { g: GalleryImage; id: string; i: number; target: { project: string; section: number; item: number } }) {
  const padded = g.frame !== "none" || (g.background !== "none" && g.fit === "contain");
  return (
    <figure id={`s${target.section}-${target.item}`} className={`scroll-mt-24 ${span[g.width]}`} data-inview style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
      {/* Full-width images stop short of the screen height, so one never fills the whole view. */}
      <div className={`group/m relative overflow-hidden rounded-2xl ${panel[g.background]} ${g.width === "full" ? "max-h-[min(78vh,780px)] w-full" : ""}`} style={{ aspectRatio: g.aspect }}>
        <div className={`settle absolute inset-0 ${padded ? "p-[5%]" : ""}`}>
          {g.frame === "browser" ? (
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-[#1b1b1b] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
              <div className="flex shrink-0 items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="mx-auto h-4 w-1/3 rounded-full bg-white/5" />
              </div>
              <Screen g={g} className="flex-1" />
            </div>
          ) : g.frame === "phone" ? (
            <div className="grid h-full place-items-center">
              <div className="relative aspect-[9/19.5] h-full overflow-hidden rounded-[26px] border-[4px] border-[#2a2a2a] bg-black shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]">
                <div className="absolute inset-0">
                  <Screen g={g} className="h-full w-full" />
                </div>
                <span className="absolute left-1/2 top-2 h-2.5 w-10 -translate-x-1/2 rounded-full bg-black" />
              </div>
            </div>
          ) : (
            <Screen g={g} className={`h-full w-full ${padded ? "rounded-lg" : ""}`} />
          )}
        </div>
        <Like id={`${id}-${i}`} count={g.likes} target={target} />
      </div>
      {g.caption && <figcaption className="mt-3 text-small text-soft">{g.caption}</figcaption>}
    </figure>
  );
}

const Label = ({ children }: { children: string }) => <dt className="eyebrow pt-2">{children}</dt>;

// Case study body, shared by the /work/[slug] route and the single-page preview.
export default async function ProjectView({ slug }: { slug: string }) {
  const [projects, pages, quotes, notes] = await Promise.all([getProjects(), getPages(), getTestimonials(), getNotes()]);
  const i = projects.findIndex((x) => x.slug === slug);
  const p = projects[i];
  if (!p) return null;
  const next = projects[(i + 1) % projects.length];
  const said = quotes.filter((t) => t.project?.slug === p.slug);
  const writing = notes.filter((n) => n.projects.includes(p.id));
  return (
    <article className="wrap">
      <Words text={p.title} className="pt-page text-display font-light" />

      <div className="mt-block grid gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16">
        <div className="rise" style={{ ["--i" as string]: 3 }}>
          <p className="max-w-[58ch] text-lead text-ink/90">{p.intro}</p>
          {p.credit && <p className="mt-6 max-w-[58ch] text-body italic text-soft">{p.credit}</p>}
        </div>
        <dl className="rise grid h-max grid-cols-[110px_1fr] items-start gap-x-6 gap-y-6 text-small" style={{ ["--i" as string]: 4 }}>
          {p.client && (
            <>
              <Label>{pages.work.clientLabel}</Label>
              <dd className="pt-1 text-ink/90">
                {p.client.href ? (
                  <a href={p.client.href} target="_blank" rel="noreferrer" className="u">
                    {p.client.name} <ArrowUpRight className="inline-block align-[-0.1em]" size="1em" strokeWidth={1.75} aria-hidden />
                  </a>
                ) : (
                  p.client.name
                )}
              </dd>
            </>
          )}
          <Label>{pages.labels.teamLabel}</Label>
          <dd>{p.teamMembers.length ? <Team people={p.teamMembers} viewProfile={pages.labels.viewProfileLabel} /> : <span className="text-soft">{p.team}</span>}</dd>
          <Label>{pages.labels.servicesLabel}</Label>
          <dd className="flex flex-wrap gap-2">
            {p.services.map((s) => (
              <span key={s} className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-label uppercase text-ink/90">
                {s}
              </span>
            ))}
          </dd>
          <Label>{pages.labels.dateLabel}</Label>
          <dd className="pt-1 text-ink/90">{p.year}</dd>
        </dl>
      </div>

      {p.sections.map((s, k) => (
        <section key={k} className={s.heading || s.body ? "mt-section" : "mt-block"}>
          {(s.heading || s.body) && (
            <div className="grid gap-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16" data-inview>
              <h2 className="text-h3 font-light">{s.heading}</h2>
              <p className="max-w-[60ch] text-lead text-soft">{s.body}</p>
            </div>
          )}
          {s.gallery.length > 0 && (
            <div className={`grid grid-cols-12 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10 ${s.heading || s.body ? "mt-block" : ""}`}>
              {s.gallery.map((g, j) => (
                <Tile key={j} g={g} id={`${p.slug}-${k}`} i={j} target={{ project: p.id, section: k, item: j }} />
              ))}
            </div>
          )}
        </section>
      ))}

      {said.length > 0 && (
        <section className="mt-section border-t border-rule pt-block" data-inview>
          <Testimonials items={said} placeholderLabel={pages.labels.placeholderLabel} />
        </section>
      )}

      {writing.length > 0 && (
        <section className="mt-section" data-inview>
          <p className="eyebrow">{pages.work.relatedNotesLabel}</p>
          <ul className="mt-6">
            {writing.map((n) => (
              <li key={n.slug} className="border-t border-rule">
                <Link href={n.href ?? `/notes/${n.slug}`} className="group flex items-baseline justify-between gap-6 py-6">
                  <span className="text-h3 font-light transition-colors group-hover:text-soft">{n.title}</span>
                  <ArrowRight className="shrink-0 self-center text-soft transition-transform duration-300 group-hover:translate-x-1" size="1em" strokeWidth={1.75} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {next && next.slug !== p.slug && (
        <Link href={`/work/${next.slug}`} className="group mt-section block border-t border-rule pt-8" data-inview>
          <span className="eyebrow">{pages.work.nextLabel}</span>
          <span className="mt-4 flex items-baseline justify-between gap-6">
            <span className="text-h1 font-light transition-colors duration-300 group-hover:text-soft">{next.title}</span>
            <ArrowRight className="shrink-0 self-center text-h2 transition-transform duration-500 ease-[var(--ease)] group-hover:translate-x-2" size="1em" strokeWidth={1.25} aria-hidden />
          </span>
        </Link>
      )}
    </article>
  );
}
