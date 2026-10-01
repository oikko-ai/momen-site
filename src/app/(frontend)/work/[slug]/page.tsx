import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPages, getProjects } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import ProjectView from "@/components/ProjectView";

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [projects, pages] = await Promise.all([getProjects(), getPages()]);
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return pageMeta({
    title: p.title,
    description: [p.subtitle, p.intro].filter(Boolean).join(". "),
    path: `/work/${p.slug}`,
    seo: { ...p.seo, image: p.seo.image ?? (p.image && !p.image.video ? p.image : null) },
    kicker: [pages.work.title, p.client?.name, p.year].filter(Boolean).join(" · "),
  });
}

export default async function Project({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  if (!(await getProjects()).some((x) => x.slug === slug)) notFound();
  return <ProjectView slug={slug} />;
}
