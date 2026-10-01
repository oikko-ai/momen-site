import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { getActivity, getPages } from "@/lib/cms";
import PageHead from "@/components/PageHead";
import Feed from "./Feed";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getPages();
  return pageMeta({ title: p.activity.title, description: p.activity.intro, path: "/activity", seo: p.seo("activity") });
}

export default async function Activity() {
  const [items, pages] = await Promise.all([getActivity(), getPages()]);
  return (
    <div className="wrap">
      <PageHead title={pages.activity.title} intro={pages.activity.intro} />
      <Feed initial={items} t={pages.activity} />
    </div>
  );
}
