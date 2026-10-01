import type { Metadata } from "next";
import Link from "next/link";
import { GeistMono } from "geist/font/mono";
import { inter } from "@/fonts";
import { getPages, getSite } from "@/lib/cms";
import "./(frontend)/globals.css";

export const metadata: Metadata = { title: "404" };

// Shown for any address that matches no page. The text comes from Pages → Labels in the CMS.
export default async function GlobalNotFound() {
  const [site, { labels }] = await Promise.all([getSite(), getPages()]);
  return (
    <html lang="en" className={`${inter.variable} ${GeistMono.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <header className="wrap flex h-18 items-center">
          <Link href="/" className="text-lead tracking-tight text-ink transition-colors hover:text-soft">
            {site.name}
          </Link>
        </header>
        <main className="wrap flex-1 pt-page">
          <h1 className="text-h1 font-light">{labels.notFoundTitle}</h1>
          <Link href="/" className="u mt-block inline-block text-lead">
            {labels.notFoundLink}
          </Link>
        </main>
      </body>
    </html>
  );
}
