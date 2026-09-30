import type { Metadata } from "next";
import { getPeople } from "@/lib/cms";
import PageHead from "@/components/PageHead";
import People from "./People";

export const metadata: Metadata = { title: "People" };

export default async function Page() {
  const items = await getPeople();
  return (
    <div className="mx-auto max-w-[1040px] px-5 md:px-7">
      <PageHead title="People" intro="Good work is never solo. These are the people I build with, learn from and would happily work with again." />
      <People people={items} />
    </div>
  );
}
