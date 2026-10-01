"use client";

import { useEffect } from "react";

const ROUTE_EVENT = "preview-route";

// Single-page preview: every route is already in the document; show the one named by the hash.
export default function Preview() {
  useEffect(() => {
    const show = () => {
      const path = decodeURIComponent(location.hash.slice(1)) || "/";
      let found = false;
      document.querySelectorAll<HTMLElement>("[data-route-view]").forEach((el) => {
        const on = el.dataset.routeView === path;
        el.hidden = !on;
        found ||= on;
      });
      if (!found) (document.querySelector('[data-route-view="/"]') as HTMLElement).hidden = false;
      scrollTo(0, 0);
      dispatchEvent(new CustomEvent(ROUTE_EVENT, { detail: found ? path : "/" }));
    };
    const click = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("a[href]");
      const href = a?.getAttribute("href");
      if (!a || !href?.startsWith("/") || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (location.hash.slice(1) === href) show();
      else location.hash = href;
    };
    addEventListener("hashchange", show);
    addEventListener("click", click, true);
    show();
    return () => {
      removeEventListener("hashchange", show);
      removeEventListener("click", click, true);
    };
  }, []);
  return null;
}
