import { ImageResponse } from "next/og";
import { getSite } from "@/lib/cms";

// GET /og?t=Title&k=Kicker — the share image used when a page has none uploaded in the CMS.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const site = await getSite();
  const title = (q.get("t") || site.tagline).slice(0, 120);
  const kicker = (q.get("k") || site.jobTitle).slice(0, 80);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#050505", color: "#f1f1ef" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: "#a3a39f" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#f1f1ef", color: "#050505", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 600 }}>
            {site.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </div>
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: title.length > 48 ? 64 : 84, lineHeight: 1.04, letterSpacing: -2.5, maxWidth: 1000 }}>{title}</div>
          <div style={{ fontSize: 30, color: "#a3a39f" }}>{kicker}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800" } },
  );
}
