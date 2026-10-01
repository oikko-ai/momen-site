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
    <div className="wrap">
      <PageHead title={pages.clients.title} intro={pages.clients.intro} />
      <Clients clients={items} tags={tagsOf(items, pages.labels.allLabel)} visitLabel={pages.clients.visitLabel} />
    </div>
  );
}
