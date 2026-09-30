import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/cms";
import ProjectView from "@/components/ProjectView";

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: (await getProjects()).find((x) => x.slug === slug)?.title ?? "Work" };
}

export default async function Project({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  if (!(await getProjects()).some((x) => x.slug === slug)) notFound();
  return <ProjectView slug={slug} />;
}
