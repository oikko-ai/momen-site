import type { Metadata } from "next";
import { getClients, getPages, tagsOf } from "@/lib/cms";
import PageHead from "@/components/PageHead";
import Clients from "./Clients";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getPages()).clients.title };
}

export default async function Page() {
  const [items, pages] = await Promise.all([getClients(), getPages()]);
  return (
    <div className="mx-auto max-w-[1040px] px-5 md:px-7">
      <PageHead title={pages.clients.title} intro={pages.clients.intro} />
      <Clients clients={items} tags={tagsOf(items)} />
    </div>
  );
}
