import type { MetadataRoute } from "next";
import { siteUrl as site } from "@/lib/url";

export const dynamic = "force-static";


export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }, sitemap: `${site}/sitemap.xml` };
}
