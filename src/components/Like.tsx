"use client";

import { Heart } from "lucide-react";
import { useSyncExternalStore } from "react";
import { visitorId } from "@/lib/visitor";

const EVENT = "like-change";
const read = (key: string) => {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};
const subscribe = (cb: () => void) => {
  addEventListener(EVENT, cb);
  addEventListener("storage", cb);
  return () => {
    removeEventListener(EVENT, cb);
    removeEventListener("storage", cb);
  };
};

type Target = { project: string; section: number; item: number };

// Heart with a count on a case study image. A visitor's own like is remembered in their browser,
// saved to the image's count in the CMS and shown on the Activity page.
export default function Like({ id, count, target }: { id: string; count: number; target?: Target }) {
  const key = `like:${id}`;
  const liked = useSyncExternalStore(subscribe, () => read(key), () => false);
  const toggle = () => {
    try {
      if (liked) localStorage.removeItem(key);
      else localStorage.setItem(key, "1");
    } catch {}
    dispatchEvent(new Event(EVENT));
    if (target && !process.env.NEXT_PUBLIC_PREVIEW)
      fetch(`/api/projects/${target.project}/like`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ section: target.section, item: target.item, on: !liked, visitor: visitorId() }),
      }).catch(() => null);
  };
  const n = count + (liked ? 1 : 0);
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      className={`absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-micro text-white backdrop-blur-md transition-opacity duration-300 focus-visible:opacity-100 ${
        liked ? "opacity-100" : "opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/m:opacity-100"
      }`}
    >
      <Heart className={`h-3.5 w-3.5 transition-transform duration-300 ${liked ? "scale-110 fill-[#ff4d6d] text-[#ff4d6d]" : ""}`} strokeWidth={2} aria-hidden />
      {n > 0 && <span>{n}</span>}
    </button>
  );
}
