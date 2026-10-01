"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { visitorId } from "@/lib/visitor";

type Highlight = { text: string; count: number };
type Props = {
  id: string;
  likes: number;
  views: number;
  highlights: Highlight[];
  children: React.ReactNode;
};

const api = !process.env.NEXT_PUBLIC_PREVIEW;
const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string | null) => {
    try {
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch {}
  },
};
const send = (id: string, body: object) =>
  api
    ? fetch(`/api/notes/${id}/react`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...body, visitor: visitorId() }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
    : Promise.resolve(null);

// Wrap every occurrence of each passage in a <mark>, inside one paragraph at a time.
function paint(root: HTMLElement, them: string[], mine: string[]) {
  root
    .querySelectorAll("mark[data-hl]")
    .forEach((m) => m.replaceWith(...m.childNodes));
  root.normalize();
  const blocks = root.querySelectorAll("p, li, blockquote, h2, h3");
  const all = [
    ...mine.map((t) => [t, "mine"] as const),
    ...them.filter((t) => !mine.includes(t)).map((t) => [t, "them"] as const),
  ];
  for (const [text, who] of all) {
    for (const block of blocks) {
      const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      const full = nodes.map((n) => n.data).join("");
      const at = full.indexOf(text);
      if (at < 0) continue;
      // Walk text nodes, wrapping the slice [at, at + text.length) piece by piece.
      let pos = 0;
      for (const n of nodes) {
        const len = n.data.length;
        const start = Math.max(at - pos, 0),
          end = Math.min(at + text.length - pos, len);
        if (end > 0 && start < len && start < end) {
          const piece = n.splitText(start);
          piece.splitText(end - start);
          const mark = document.createElement("mark");
          mark.dataset.hl = who;
          mark.dataset.text = text;
          piece.replaceWith(mark);
          mark.append(piece);
        }
        pos += len;
      }
      break;
    }
  }
}

// The note body plus its reactions: likes, views and passages readers highlighted.
export default function NoteReader({
  id,
  likes: likes0,
  views: views0,
  highlights: hl0,
  children,
}: Props) {
  const body = useRef<HTMLDivElement>(null);
  const [likes, setLikes] = useState(likes0);
  const [views, setViews] = useState(views0);
  const [them, setThem] = useState(hl0);
  const [liked, setLiked] = useState(false);
  const [mine, setMine] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"mine" | "them">("them");
  const [pick, setPick] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  // Load this reader's own state, fresh counts, and count the view once per visit.
  useEffect(() => {
    const ownLike = store.get(`note-like:${id}`) === "1";
    const ownMarks = JSON.parse(store.get(`note-hl:${id}`) || "[]") as string[];
    queueMicrotask(() => {
      setLiked(ownLike);
      setMine(ownMarks);
    });
    if (!api) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(`note-view:${id}`) === "1";
      sessionStorage.setItem(`note-view:${id}`, "1");
    } catch {}
    const fresh = seen
      ? fetch(`/api/notes/${id}?depth=0`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      : send(id, { kind: "view" });
    fresh.then((d) => {
      if (!d) return;
      setLikes(d.likes ?? 0);
      setViews(d.views ?? 0);
      setThem(
        (d.highlights ?? []).map((h: Highlight) => ({
          text: h.text,
          count: h.count ?? 1,
        })),
      );
    });
  }, [id]);

  useEffect(() => {
    if (body.current)
      paint(
        body.current,
        them.map((h) => h.text),
        mine,
      );
  }, [them, mine]);

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikes((n) => Math.max(0, n + (next ? 1 : -1)));
    store.set(`note-like:${id}`, next ? "1" : null);
    send(id, { kind: next ? "like" : "unlike" });
  };

  // Selecting text inside one paragraph offers a Highlight button above the selection.
  const onSelect = () => {
    const sel = getSelection();
    const text = sel?.toString().replace(/\s+/g, " ").trim() ?? "";
    if (!sel || sel.rangeCount === 0 || text.length < 3 || text.length > 400)
      return setPick(null);
    const range = sel.getRangeAt(0);
    const block = (n: Node) =>
      (n instanceof Element ? n : n.parentElement)?.closest(
        "p, li, blockquote, h2, h3",
      );
    if (
      !body.current?.contains(range.commonAncestorContainer) ||
      block(range.startContainer) !== block(range.endContainer)
    )
      return setPick(null);
    const r = range.getBoundingClientRect();
    setPick({ text, x: r.left + r.width / 2, y: r.top });
  };
  const saveHighlight = () => {
    if (!pick) return;
    const next = [...new Set([...mine, pick.text])];
    setMine(next);
    store.set(`note-hl:${id}`, JSON.stringify(next));
    send(id, { kind: "highlight", text: pick.text }).then(
      (d) =>
        d &&
        setThem(
          d.highlights.map((h: Highlight) => ({
            text: h.text,
            count: h.count ?? 1,
          })),
        ),
    );
    getSelection()?.removeAllRanges();
    setPick(null);
  };
  useEffect(() => {
    if (!pick) return;
    const hide = () => setPick(null);
    addEventListener("scroll", hide, { passive: true });
    return () => removeEventListener("scroll", hide);
  }, [pick]);

  const jump = (text: string) => {
    const mark = body.current?.querySelector<HTMLElement>(
      `mark[data-text="${CSS.escape(text)}"]`,
    );
    if (!mark) return;
    mark.scrollIntoView({ behavior: "smooth", block: "center" });
    mark.classList.add("hl-flash");
    setTimeout(() => mark.classList.remove("hl-flash"), 1600);
    setOpen(false);
  };
  const list =
    tab === "mine"
      ? mine.map((text) => ({ text, count: 1 }))
      : [...them].sort((a, b) => b.count - a.count);
  const total = new Set([...them.map((h) => h.text), ...mine]).size;

  return (
    <>
      <div
        ref={body}
        onMouseUp={onSelect}
        onKeyUp={onSelect}
        className="note-body"
      >
        {children}
      </div>
      {pick &&
        createPortal(
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={saveHighlight}
            className="pop fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-full bg-ink px-3.5 py-1.5 text-micro text-paper shadow-xl"
            style={{ left: pick.x, top: pick.y }}
          >
            Highlight
          </button>,
          document.body,
        )}
      <div className="sticky bottom-6 z-30 mt-14 flex justify-center">
        <div className="relative">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#1a1a1a]/90 p-1.5 text-micro text-soft shadow-2xl backdrop-blur-xl">
            <button
              onClick={toggleLike}
              aria-pressed={liked}
              aria-label="Like"
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors hover:bg-white/5 ${liked ? "text-ink" : ""}`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform duration-300 ${liked ? "scale-110 fill-[#ff4d6d] stroke-[#ff4d6d]" : "fill-current stroke-current"}`}
                strokeWidth="1.5"
              >
                <path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3.2 5 6.6 5c2 0 3.4 1.1 4.1 2.4h2.6C14 6.1 15.4 5 17.4 5c3.4 0 5.3 3.4 3.8 6.4C19 15.6 12 20 12 20z" />
              </svg>
              {likes}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label="Highlights"
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors hover:bg-white/5 ${open ? "bg-white/5 text-ink" : ""}`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-none stroke-current"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m14 4 6 6-8.5 8.5H6v-5.5L14 4zM4 21h16" />
              </svg>
              {total}
            </button>
            <span
              className="flex items-center gap-1.5 px-3 py-1.5"
              title="Views"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-none stroke-current"
                strokeWidth="1.6"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {views}
            </span>
          </div>
          {open && (
            <div className="pop absolute bottom-[calc(100%+10px)] left-1/2 w-[300px] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a]/95 shadow-2xl backdrop-blur-xl [transform-origin:bottom_center]">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 text-micro">
                <span className="text-ink">Highlights</span>
                <span className="flex gap-1">
                  {(["mine", "them"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`rounded-full px-2.5 py-1 transition-colors ${tab === t ? "bg-white/10 text-ink" : "text-soft hover:text-ink"}`}
                    >
                      {t === "mine" ? "You" : "Others"}{" "}
                      <span className="text-faint">
                        {t === "mine" ? mine.length : them.length}
                      </span>
                    </button>
                  ))}
                </span>
              </div>
              <ul className="max-h-[320px] overflow-y-auto p-1.5">
                {list.length === 0 && (
                  <li className="px-3 py-4 text-micro leading-relaxed text-soft">
                    {tab === "mine"
                      ? "Select any sentence in the note to highlight it."
                      : "No highlights yet."}
                  </li>
                )}
                {list.map((h) => (
                  <li key={h.text}>
                    <button
                      onClick={() => jump(h.text)}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-micro leading-relaxed text-ink/85 transition-colors hover:bg-white/5"
                    >
                      “{h.text}”
                      {tab === "them" && h.count > 1 && (
                        <span className="ml-1.5 text-faint">×{h.count}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
