import type { Metadata } from "next";
import type { Seo } from "./cms";

type Page = {
  title: string;
  description?: string;
  path: string;
  seo?: Seo;
  // Headline and subtitle on the generated share image, when it should differ from the title.
  ogTitle?: string;
  kicker?: string;
  type?: "website" | "article" | "profile";
  published?: string;
  modified?: string;
};

// Title, description, canonical address and share card for one page.
// CMS "Search & sharing" fields win; otherwise the page's own title and text are used.
export function pageMeta({ title, description, path, seo, ogTitle, kicker, type = "website", published, modified }: Page): Metadata {
  const t = seo?.title || title;
  const d = seo?.description || description || undefined;
  const image = seo?.image?.url || `/og?${new URLSearchParams({ t: ogTitle || title, ...(kicker && { k: kicker }) })}`;
  return {
    title: t,
    description: d,
    alternates: { canonical: path },
    openGraph: {
      title: t,
      description: d,
      url: path,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(type === "article" && { publishedTime: published, modifiedTime: modified }),
    },
    twitter: { card: "summary_large_image", title: t, description: d, images: [image] },
    ...(seo?.noindex && { robots: { index: false, follow: true } }),
  };
}
