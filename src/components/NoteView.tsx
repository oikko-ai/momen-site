import Link from "next/link";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { getNotes, getPages, getProjects, getSite, linked, media as toMedia, type MediaDoc } from "@/lib/cms";
import Subscribe from "@/app/(frontend)/notes/Subscribe";
import NoteReader from "./NoteReader";
import Visual from "./Visual";
import Words from "./Words";
import DeviceFrame from "./DeviceFrame";
import ReadingProgress from "./ReadingProgress";

type MediaBlock = { source?: string; image?: MediaDoc; url?: string; caption?: string; size?: string };

// Images and videos placed inside a note.
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    noteMedia: ({ node }: { node: { fields: MediaBlock } }) => {
      const f = node.fields;
      const file = f.source === "url" && f.url ? linked(f.url) : { media: toMedia(f.image) };
      return (
        <figure className={`my-10 ${f.size === "wide" ? "md:-mx-24" : ""}`}>
          <div className="overflow-hidden rounded-xl bg-card">
            {file.embed ? (
              <div className="relative aspect-video">
                <iframe src={file.embed} title={f.caption || "Video"} allow="autoplay; fullscreen; picture-in-picture" className="absolute inset-0 h-full w-full" />
              </div>
            ) : (
              <Visual media={file.media} cover="graph" className="aspect-[16/9]" />
            )}
          </div>
          {f.caption && <figcaption className="mt-3 text-center text-small text-soft">{f.caption}</figcaption>}
        </figure>
      );
    },
  },
});

const date = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }) : "");

// A note's page, shared by /notes/[slug] and the single-page preview.
export default async function NoteView({ slug }: { slug: string }) {
  const [notes, pages, site, projects] = await Promise.all([getNotes(), getPages(), getSite(), getProjects()]);
  const own = notes.filter((n) => !n.href);
  const i = own.findIndex((n) => n.slug === slug);
  const n = own[i];
  if (!n) return null;
  const next = own[(i + 1) % own.length];
  const p = pages.notes;
  const related = projects.filter((x) => n.projects.includes(x.id));
  return (
    <article className="wrap">
      <ReadingProgress />
      <header className="mx-auto max-w-[1000px] pb-block pt-page text-center">
        <p className="rise eyebrow">{date(n.date)}</p>
        <Words text={n.title} className="mt-6 text-h2 font-light" start={1} />
        {n.summary && (
          <p className="rise mx-auto mt-6 max-w-[48ch] text-lead text-soft" style={{ ["--i" as string]: 3 }}>
            {n.summary}
          </p>
        )}
      </header>
      {n.cover && <Visual media={n.cover} cover="graph" className="rise mx-auto mb-block aspect-[16/9] max-w-[1000px] rounded-2xl" />}
      <div className="rise mx-auto max-w-read" style={{ ["--i" as string]: 4 }}>
        <NoteReader id={n.id} likes={n.likes} views={n.views} highlights={n.highlights}>
          {n.body ? <RichText data={n.body as never} converters={converters} disableContainer /> : null}
        </NoteReader>
      </div>
      {related.length > 0 && (
        <section className="mx-auto mt-section max-w-[1000px]" data-inview>
          <p className="eyebrow">{p.relatedLabel}</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {related.map((x) => (
              <li key={x.slug}>
                <Link href={`/work/${x.slug}`} data-spot className="group flex items-center gap-6 rounded-3xl bg-card p-5 transition-colors hover:bg-[#191919]">
                  <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#0e0e0e]">
                    <div className={x.device === "phone" ? "w-[36%]" : "w-[78%]"}>
                      <DeviceFrame device={x.device} media={x.image} cover={x.cover} className="w-full" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-h3 font-light">{x.title}</p>
                    <p className="mt-1 text-small text-soft">{x.subtitle}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="mx-auto mt-block max-w-[1000px]">
        <Subscribe wide email={site.email} title={p.signupTitle} text={p.signupText} doneText={p.signedUpText} />
      </div>
      <nav className="mx-auto mt-12 flex max-w-[1000px] items-center justify-between text-body">
        <Link href="/notes" className="group flex items-center gap-2 text-soft transition-colors hover:text-ink">
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> {p.allLabel}
        </Link>
        {next && next.slug !== n.slug && (
          <Link href={`/notes/${next.slug}`} className="group flex items-center gap-2 text-soft transition-colors hover:text-ink" title={next.title}>
            {p.nextLabel} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
