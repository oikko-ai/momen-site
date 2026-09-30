import { chromium } from "playwright-core";
const out = process.argv[2];
const routes = ["/", "/about", "/work", "/work/noteai", "/notes", "/photos", "/clients", "/people", "/colophon"];
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
for (const [tag, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: 1 });
  for (const r of routes) {
    await p.goto("http://localhost:3100" + r, { waitUntil: "networkidle" });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
    await p.waitForTimeout(900);
    const over = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    const name = (r === "/" ? "home" : r.slice(1).replace(/\//g, "-"));
    await p.screenshot({ path: `${out}/${tag}-${name}.png`, fullPage: true });
    console.log(tag, r, over ? "OVERFLOW" : "ok");
  }
}
await b.close();
