"use client";

import { useEffect, useState } from "react";

// The current route: Next's pathname normally, or the hash route inside the single-page preview.
export function useRoute(pathname: string) {
  const [route, setRoute] = useState<string | null>(null);
  useEffect(() => {
    const on = (e: Event) => setRoute((e as CustomEvent<string>).detail);
    addEventListener("preview-route", on);
    return () => removeEventListener("preview-route", on);
  }, []);
  // The preview is exported as one page rendered at "/", so start from there to match the server HTML.
  return route ?? (process.env.NEXT_PUBLIC_PREVIEW ? "/" : pathname);
}
