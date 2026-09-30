"use client";

import { useSyncExternalStore } from "react";

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

// Heart with a count on a case study image. A visitor's own like is remembered in their browser.
export default function Like({ id, count }: { id: string; count: number }) {
  const key = `like:${id}`;
  const liked = useSyncExternalStore(subscribe, () => read(key), () => false);
  const toggle = () => {
    try {
      if (liked) localStorage.removeItem(key);
      else localStorage.setItem(key, "1");
    } catch {}
    dispatchEvent(new Event(EVENT));
  };
  const n = count + (liked ? 1 : 0);
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      className={`absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[12px] text-white backdrop-blur-md transition-opacity duration-300 focus-visible:opacity-100 group-hover/m:opacity-100 ${
        liked ? "opacity-100" : "opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform duration-300 ${liked ? "scale-110 fill-[#ff4d6d] stroke-[#ff4d6d]" : "fill-none stroke-white"}`} strokeWidth="2">
        <path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3.2 5 6.6 5c2 0 3.4 1.1 4.1 2.4h2.6C14 6.1 15.4 5 17.4 5c3.4 0 5.3 3.4 3.8 6.4C19 15.6 12 20 12 20z" />
      </svg>
      {n > 0 && <span>{n}</span>}
    </button>
  );
}
