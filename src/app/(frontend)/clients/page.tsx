import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { getClients, getPages, getSite, tagsOf } from "@/lib/cms";
import PageHead from "@/components/PageHead";
import Clients from "./Clients";

export async function generateMetadata(): Promise<Metadata> {
  const [p, site, clients] = await Promise.all([getPages(), getSite(), getClients()]);
  const fallback = `Teams ${site.name} has built AI products and software with, including ${clients.slice(0, 4).map((c) => c.name).join(", ")}.`;
  return pageMeta({ title: p.clients.title, description: p.clients.intro || fallback, path: "/clients", seo: p.seo("clients") });
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
