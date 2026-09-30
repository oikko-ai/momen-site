import type { Metadata } from "next";
import { getPages, getPhotos } from "@/lib/cms";
import Gallery from "./Gallery";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getPages()).photos.title };
}

export default async function Photos() {
  const photos = await getPhotos();
  // Until real photos are added in the CMS, show labelled placeholders.
  return <Gallery photos={photos.length ? photos : Array.from({ length: 20 }, (_, i) => ({ image: null, caption: `Photo ${i + 1}` }))} />;
}
