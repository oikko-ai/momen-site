"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { moreNav, nav } from "@/content";
import { useRoute } from "./useRoute";
import Available from "./Available";

export default function Header({ name, available }: { name: string; available?: string }) {
  const pathname = useRoute(usePathname());
  const [open, setOpen] = useState(false);
  const [float, setFloat] = useState(false);
  const [floatOpen, setFloatOpen] = useState(false);
  const [path, setPath] = useState(pathname);
  if (path !== pathname) {
    setPath(pathname);
    setOpen(false);
    setFloatOpen(false);
  }
  // Once the header scrolls away, a round menu button stays in the corner.
  useEffect(() => {
    const on = () => {
      const past = scrollY > 110;
      setFloat(past);
      if (!past) setFloatOpen(false);
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  const floatBox = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!floatOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !floatBox.current?.contains(e.target as Node)) setFloatOpen(false);
    };
    addEventListener("mousedown", close);
    addEventListener("keydown", close);
    return () => {
      removeEventListener("mousedown", close);
      removeEventListener("keydown", close);
    };
  }, [floatOpen]);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    addEventListener("mousedown", close);
    addEventListener("keydown", close);
    return () => {
      removeEventListener("mousedown", close);
      removeEventListener("keydown", close);
    };
  }, [open]);

  const link = (href: string) =>
    `transition-colors duration-200 ${(href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "text-ink" : "text-soft hover:text-ink"}`;

  return (
    <header className="relative z-40">
      <div className="wrap flex h-18 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="whitespace-nowrap text-lead tracking-tight text-ink transition-colors hover:text-soft">
            {name}
          </Link>
          {available && (
            <span className="hidden lg:block">
              <Available text={available} />
            </span>
          )}
        </div>
        <div ref={box} className="relative flex items-center gap-5 text-body md:gap-8">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`${link(n.href)} ${n.href === "/" || n.href === "/notes" ? "hidden sm:inline" : ""}`}>
              {n.label}
            </Link>
          ))}
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" className={open ? "text-ink" : "text-soft hover:text-ink"}>
            More
          </button>
          {open && (
            <div role="menu" className="pop absolute right-0 top-10 w-52 rounded-xl border border-rule bg-[#101010]/95 p-1.5 shadow-2xl backdrop-blur-xl">
              {[...nav.filter((n) => n.href === "/" || n.href === "/notes"), ...moreNav].map((n) => (
                <Link
                  key={n.href}
                  role="menuitem"
                  href={n.href}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-small hover:bg-white/5 ${
                    n.href === "/" || n.href === "/notes" ? "sm:hidden" : ""
                  } ${pathname.startsWith(n.href) && n.href !== "/" ? "text-ink" : "text-soft hover:text-ink"}`}
                >
                  <span className={`h-1 w-1 rounded-full ${pathname.startsWith(n.href) && n.href !== "/" ? "bg-ink" : "bg-transparent"}`} />
                  {n.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        ref={floatBox}
        className={`fixed right-4 top-4 z-50 transition-all duration-500 ease-[var(--ease)] md:right-6 md:top-6 ${
          float ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <button
          onClick={() => setFloatOpen((o) => !o)}
          aria-expanded={floatOpen}
          aria-haspopup="menu"
          aria-label="Menu"
          tabIndex={float ? 0 : -1}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-[#141414]/80 shadow-xl backdrop-blur-xl transition-colors hover:bg-[#222]"
        >
          <span className="relative block h-2.5 w-4">
            <span className={`absolute left-0 h-[1.5px] w-full rounded bg-ink transition-transform duration-300 ${floatOpen ? "top-1 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-[1.5px] w-full rounded bg-ink transition-transform duration-300 ${floatOpen ? "top-1 -rotate-45" : "top-2"}`} />
          </span>
        </button>
        {floatOpen && (
          <div role="menu" className="pop absolute right-0 top-14 w-56 rounded-2xl border border-rule bg-[#101010]/95 p-1.5 shadow-2xl backdrop-blur-xl">
            {[...nav, ...moreNav].map((n) => {
              const on = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <Link key={n.href} role="menuitem" href={n.href} className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-small hover:bg-white/5 ${on ? "text-ink" : "text-soft hover:text-ink"}`}>
                  <span className={`h-1 w-1 rounded-full ${on ? "bg-ink" : "bg-transparent"}`} />
                  {n.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
