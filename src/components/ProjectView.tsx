import Link from "next/link";
import { getPages, getProjects, type GalleryImage } from "@/lib/cms";
import Visual from "@/components/Visual";
import Team from "@/components/Team";
import Like from "@/components/Like";

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
function Tile({ g, id, i }: { g: GalleryImage; id: string; i: number }) {
  const padded = g.frame !== "none" || (g.background !== "none" && g.fit === "contain");
  return (
    <figure className={span[g.width]} data-inview style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
      <div className={`group/m relative overflow-hidden rounded-2xl ${panel[g.background]}`} style={{ aspectRatio: g.aspect }}>
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
        <Like id={`${id}-${i}`} count={g.likes} />
      </div>
      {g.caption && <figcaption className="mt-3 text-[14px] leading-relaxed text-soft">{g.caption}</figcaption>}
    </figure>
  );
}

const Label = ({ children }: { children: string }) => <dt className="pt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{children}</dt>;

// Case study body, shared by the /work/[slug] route and the single-page preview.
export default async function ProjectView({ slug }: { slug: string }) {
  const [projects, pages] = await Promise.all([getProjects(), getPages()]);
  const i = projects.findIndex((x) => x.slug === slug);
  const p = projects[i];
  if (!p) return null;
  const next = projects[(i + 1) % projects.length];
  return (
    <article className="mx-auto max-w-[1120px] px-5 md:px-7">
      <h1 className="rise pt-10 text-[60px] font-light leading-[0.95] tracking-[-0.045em] md:pt-16 md:text-[120px] lg:text-[148px]">{p.title}</h1>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1.15fr_1fr] md:gap-16">
        <div className="rise" style={{ ["--i" as string]: 1 }}>
          <p className="text-[18px] leading-relaxed text-ink/90 md:text-[19px]">{p.intro}</p>
          {p.credit && <p className="mt-6 text-[16px] italic leading-relaxed text-soft">{p.credit}</p>}
        </div>
        <dl className="rise grid h-max grid-cols-[100px_1fr] items-start gap-x-5 gap-y-5 text-[15px]" style={{ ["--i" as string]: 2 }}>
          <Label>Team</Label>
          <dd>{p.teamMembers.length ? <Team people={p.teamMembers} /> : <span className="text-soft">{p.team}</span>}</dd>
          <Label>Services</Label>
          <dd className="flex flex-wrap gap-2">
            {p.services.map((s) => (
              <span key={s} className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink/90">
                {s}
              </span>
            ))}
          </dd>
          <Label>Date</Label>
          <dd className="pt-1 text-ink/90">{p.year}</dd>
        </dl>
      </div>

      {p.sections.map((s, k) => (
        <section key={k} className={s.heading || s.body ? "mt-24 md:mt-32" : "mt-14 md:mt-20"}>
          {(s.heading || s.body) && (
            <div className="grid gap-4 md:grid-cols-[1fr_2.2fr] md:gap-16" data-inview>
              <h2 className="text-[19px] md:text-[20px]">{s.heading}</h2>
              <p className="text-[17px] leading-relaxed text-soft md:text-[18px]">{s.body}</p>
            </div>
          )}
          {s.gallery.length > 0 && (
            <div className={`grid grid-cols-12 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10 ${s.heading || s.body ? "mt-12 md:mt-16" : ""}`}>
              {s.gallery.map((g, j) => (
                <Tile key={j} g={g} id={`${p.slug}-${k}`} i={j} />
              ))}
            </div>
          )}
        </section>
      ))}

      {next && next.slug !== p.slug && (
        <Link href={`/work/${next.slug}`} className="group mt-32 flex items-center justify-between border-t border-rule pt-7 text-[16px]" data-inview>
          <span className="text-soft">{pages.work.nextLabel}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">{next.title} →</span>
        </Link>
      )}
    </article>
  );
}
