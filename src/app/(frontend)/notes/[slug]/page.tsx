import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNotes } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import NoteView from "@/components/NoteView";

export async function generateStaticParams() {
  return (await getNotes()).filter((n) => !n.href).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const n = (await getNotes()).find((x) => x.slug === slug);
  if (!n) return {};
  return pageMeta({
    title: n.title,
    description: n.summary,
    path: `/notes/${n.slug}`,
    seo: { ...n.seo, image: n.seo.image ?? (n.cover && !n.cover.video ? n.cover : null) },
    kicker: new Date(n.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    type: "article",
    published: n.date,
    modified: n.updatedAt,
  });
}

export default async function Note({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  if (!(await getNotes()).some((n) => n.slug === slug && !n.href)) notFound();
  return <NoteView slug={slug} />;
}
