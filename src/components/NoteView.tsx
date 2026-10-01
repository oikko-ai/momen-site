import Link from "next/link";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { getNotes, getPages, getSite, linked, media as toMedia, type MediaDoc } from "@/lib/cms";
import Subscribe from "@/app/(frontend)/notes/Subscribe";
import NoteReader from "./NoteReader";
import Visual from "./Visual";

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
          {f.caption && <figcaption className="mt-3 text-center text-[14px] text-soft">{f.caption}</figcaption>}
        </figure>
      );
    },
  },
});

const date = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }) : "");

// A note's page, shared by /notes/[slug] and the single-page preview.
export default async function NoteView({ slug }: { slug: string }) {
  const [notes, pages, site] = await Promise.all([getNotes(), getPages(), getSite()]);
  const own = notes.filter((n) => !n.href);
  const i = own.findIndex((n) => n.slug === slug);
  const n = own[i];
  if (!n) return null;
  const next = own[(i + 1) % own.length];
  const p = pages.notes;
  return (
    <article className="mx-auto max-w-[720px] px-5 md:px-7">
      <header className="pb-12 pt-10 text-center md:pb-16 md:pt-16">
        <h1 className="rise text-[40px] font-light leading-[1.08] tracking-[-0.03em] md:text-[60px]">{n.title}</h1>
        <p className="rise mt-4 text-[15px] text-soft" style={{ ["--i" as string]: 1 }}>
          {date(n.date)}
        </p>
      </header>
      {n.cover && <Visual media={n.cover} cover="graph" className="rise mb-12 aspect-[16/9] rounded-xl md:-mx-24" />}
      <div className="rise" style={{ ["--i" as string]: 2 }}>
        <NoteReader id={n.id} likes={n.likes} views={n.views} highlights={n.highlights}>
          {n.body ? <RichText data={n.body as never} converters={converters} disableContainer /> : null}
        </NoteReader>
      </div>
      <div className="mt-16">
        <Subscribe wide email={site.email} title={p.signupTitle} text={p.signupText} doneText={p.signedUpText} />
      </div>
      <nav className="mt-12 flex items-center justify-between text-[16px]">
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
