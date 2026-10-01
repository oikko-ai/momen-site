import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { inter } from "@/fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import HideOn from "@/components/HideOn";
import { getPages, getSite } from "@/lib/cms";
import { siteUrl } from "@/lib/url";
import { siteGraph } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: site.seo.title || `${site.name}: ${site.jobTitle}`, template: `%s · ${site.name}` },
    description: site.seo.description || site.intro,
    applicationName: site.name,
    authors: [{ name: site.name, url: siteUrl }],
    creator: site.name,
    openGraph: { siteName: site.name, type: "website", locale: "en_US" },
    twitter: { card: "summary_large_image" },
    alternates: { types: { "application/rss+xml": [{ url: "/notes/rss.xml", title: `${site.name}: Notes` }] } },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = { themeColor: "#050505" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [site, pages] = await Promise.all([getSite(), getPages()]);
  return (
    <html lang="en" className={`${inter.variable} ${GeistMono.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <HideOn prefix="/chat">
          <Header name={site.name} available={site.available ? site.availableText : undefined} menu={site.menu} moreLabel={pages.labels.moreLabel} menuLabel={pages.labels.menuLabel} />
        </HideOn>
        <JsonLd data={siteGraph(site)} />
        <Reveal />
        <main className="flex-1">{children}</main>
        <HideOn prefix="/chat">
          <Footer site={site} />
        </HideOn>
      </body>
    </html>
  );
}
