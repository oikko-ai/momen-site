import type { Metadata } from "next";
import { getClients } from "@/lib/cms";
import PageHead from "@/components/PageHead";
import Clients from "./Clients";

export const metadata: Metadata = { title: "Clients" };

export default async function Page() {
  const items = await getClients();
  return (
    <div className="mx-auto max-w-[1040px] px-5 md:px-7">
      <PageHead title="Clients" />
      <Clients clients={items} />
    </div>
  );
}
