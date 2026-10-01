"use client";

import Link from "next/link";
import { Heart, Highlighter, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { Cover } from "@/content";
import type { Pages } from "@/lib/cms";
import { ago, flag, placeName, toActivity, type ActivityItem } from "@/lib/feed";
import Visual from "@/components/Visual";

const WEEK = 7 * 86_400_000;

// One clear symbol per kind of activity, on a soft tint of its colour.
const icons = {
  like: { Icon: Heart, tone: "bg-[#ff3b5c]/12 text-[#ff3b5c]", fill: true },
  highlight: { Icon: Highlighter, tone: "bg-[#ffd166]/12 text-[#ffd166]", fill: false },
  chat: { Icon: MessageCircle, tone: "bg-[#4f8cff]/12 text-[#4f8cff]", fill: true },
};

function Badge({ kind }: { kind: keyof typeof icons }) {
  const { Icon, tone, fill } = icons[kind];
  return (
    <span className={`grid h-8 w-8 place-items-center rounded-full md:h-9 md:w-9 ${tone}`}>
      <Icon className={`h-4 w-4 ${fill ? "fill-current" : ""}`} strokeWidth={fill ? 1.5 : 2} aria-hidden />
    </span>
  );
}

function Line({ a, t, now }: { a: ActivityItem; t: Pages["activity"]; now: number | null }) {
  const place = placeName(a);
  const verb = a.kind === "chat" ? t.startedChat : a.kind === "highlight" ? t.highlighted : a.target === "note" ? t.likedNote : a.target === "video" ? t.likedVideo : t.likedImage;
  const thumb = a.target === "image" || a.target === "video";
  return (
    <li className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 md:grid-cols-[36px_minmax(0,1fr)]">
      <Badge kind={a.kind} />
      <div className="flex items-start justify-between gap-6 border-b border-rule pb-5 pt-0.5">
        <div className="min-w-0 text-body">
          <p>
            <span className="text-soft">{place ? t.someoneFrom : t.someone}</span>
            {place && (
              <>
                {" "}
                {flag(a.country) && <span className="mr-1">{flag(a.country)}</span>}
                <span className="text-ink">{place}</span>
              </>
            )}{" "}
            <span className="text-soft">{verb}</span>
            {a.kind !== "chat" && a.title && (
              <>
                {" "}
                <Link href={a.href || "#"} className="text-ink underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white">
                  {a.title}
                </Link>
              </>
            )}
            {a.count > 1 && (
              <span className="text-soft">
                {" "}
                {a.count} {t.times}
              </span>
            )}
            {now && <span className="text-faint"> · {ago(a.at, now)}</span>}
          </p>
          {a.kind === "highlight" && a.quote && <p className="mt-2 border-l-2 border-white/15 pl-4 text-small text-soft">{a.quote}</p>}
          {a.kind === "chat" && a.title && (
            <Link href={a.href || "/chat"} className="mt-2 block border-l-2 border-[#4f8cff]/40 pl-4 text-small text-soft transition-colors hover:text-ink">
              {a.title}
            </Link>
          )}
        </div>
        {thumb && (
          <Link href={a.href || "#"} className="block h-14 w-10 shrink-0 overflow-hidden rounded-md bg-card md:h-[68px] md:w-12">
            <Visual media={a.thumb ? { url: a.thumb, alt: "", video: a.target === "video" } : null} cover={(a.cover || "graph") as Cover} sizes="64px" className="h-full w-full" />
          </Link>
        )}
      </div>
    </li>
  );
}

// The feed, rendered from the CMS at build time and refreshed live in the browser.
export default function Feed({ initial, t }: { initial: ActivityItem[]; t: Pages["activity"] }) {
  const [items, setItems] = useState(initial);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    queueMicrotask(tick);
    const timer = setInterval(tick, 60_000);
    if (process.env.NEXT_PUBLIC_PREVIEW) return () => clearInterval(timer);
    const load = () =>
      fetch("/api/activity?sort=-createdAt&limit=100&depth=0")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.docs && setItems(d.docs.map(toActivity)))
        .catch(() => null);
    load();
    const poll = setInterval(() => document.visibilityState === "visible" && load(), 30_000);
    return () => {
      clearInterval(timer);
      clearInterval(poll);
    };
  }, []);

  if (!items.length) return <p className="text-lead text-soft">{t.emptyText}</p>;
  const cutoff = (now ?? 0) - WEEK;
  const groups = now
    ? [
        { title: t.thisWeek, rows: items.filter((a) => new Date(a.at).getTime() >= cutoff) },
        { title: t.earlier, rows: items.filter((a) => new Date(a.at).getTime() < cutoff) },
      ].filter((g) => g.rows.length)
    : [{ title: t.thisWeek, rows: items }];
  return (
    <div className="max-w-[1000px]">
      {items.some((a) => a.demo) && t.sampleText && <p className="eyebrow mb-block">{t.sampleText}</p>}
      {groups.map((g) => (
        <section key={g.title} className="mb-block">
          <h2 className="mb-6 text-h3 font-light text-soft">{g.title}</h2>
          <ul className="space-y-5">
            {g.rows.map((a) => (
              <Line key={a.id} a={a} t={t} now={now} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
