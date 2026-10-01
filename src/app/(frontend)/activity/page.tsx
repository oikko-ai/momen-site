import type { Metadata } from "next";
import { getActivity, getPages } from "@/lib/cms";
import PageHead from "@/components/PageHead";
import Feed from "./Feed";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getPages()).activity.title };
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
