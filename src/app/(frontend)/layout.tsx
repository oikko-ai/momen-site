import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/inter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getSite } from "@/lib/cms";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return { title: { default: site.name, template: `%s · ${site.name}` }, description: site.intro };
}

export const viewport: Viewport = { themeColor: "#050505" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await getSite();
  return (
    <html lang="en" className={`${GeistMono.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <Header name={site.name} />
        <Reveal />
        <main className="flex-1">{children}</main>
        <Footer site={site} />
      </body>
    </html>
  );
}
