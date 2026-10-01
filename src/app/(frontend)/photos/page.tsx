import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { getPages, getPhotos, getSite } from "@/lib/cms";
import Gallery from "./Gallery";
import PageHead from "@/components/PageHead";

export async function generateMetadata(): Promise<Metadata> {
  const [p, site] = await Promise.all([getPages(), getSite()]);
  return pageMeta({ title: p.photos.title, description: p.photos.intro || `Photos by ${site.name}.`, path: "/photos", seo: p.seo("photos") });
}

export default async function Photos() {
  const [photos, pages] = await Promise.all([getPhotos(), getPages()]);
  // Until real photos are added in the CMS, show labelled placeholders.
  return (
    <div className="wrap">
      <PageHead title={pages.photos.title} intro={pages.photos.intro} />
      <Gallery photos={photos.length ? photos : Array.from({ length: 20 }, (_, i) => ({ image: null, caption: `Photo ${i + 1}` }))} />
    </div>
  );
}
