import type { Metadata } from "next";
import { getPeople, getPages, tagsOf } from "@/lib/cms";
import PageHead from "@/components/PageHead";
import People from "./People";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getPages()).people.title };
}

export default async function Page() {
  const [items, pages] = await Promise.all([getPeople(), getPages()]);
  return (
    <div className="mx-auto max-w-[1040px] px-5 md:px-7">
      <PageHead title={pages.people.title} intro={pages.people.intro} />
      <People people={items} tags={tagsOf(items)} />
    </div>
  );
}
