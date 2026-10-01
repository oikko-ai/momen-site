import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { getPages, getPeople, getSite, tagsOf } from "@/lib/cms";
import PageHead from "@/components/PageHead";
import People from "./People";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPages();
  return pageMeta({ title: p.people.title, description: p.people.intro, path: "/people", seo: p.seo("people") });
}

export default async function Page() {
  const [all, pages, site] = await Promise.all([getPeople(), getPages(), getSite()]);
  // Momen is a person in the CMS so he can appear on project teams, but not on his own People page.
  const items = all.filter((p) => p.name !== site.name);
  return (
    <div className="wrap">
      <PageHead title={pages.people.title} intro={pages.people.intro} />
      <People people={items} tags={tagsOf(items, pages.labels.allLabel)} projectsLabel={pages.people.projectsLabel} labels={pages.labels} />
    </div>
  );
}
