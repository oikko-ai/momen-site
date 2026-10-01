"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import type { ChatSettings } from "@/lib/cms";
import { placeName, shortDate, toConversation, type Conversation } from "@/lib/feed";
import { visitorId } from "@/lib/visitor";
import Avatar from "@/components/Avatar";
import WorldMap from "@/components/WorldMap";

type Msg = Conversation["messages"][number];
type Owner = { name: string; portrait?: string };

const preview = !!process.env.NEXT_PUBLIC_PREVIEW;
const MINE = "my-chats";
const readMine = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(MINE) ?? "[]");
  } catch {
    return [];
  }
};
const addMine = (id: string) => {
  try {
    localStorage.setItem(MINE, JSON.stringify([...new Set([id, ...readMine()])].slice(0, 50)));
  } catch {}
};

// Site paths, web addresses and emails in an answer become links.
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i} className={i ? "mt-3" : ""}>
          {para.split(/((?:https?:\/\/|\/(?:work|notes|about|people|clients|photos|activity|chat|colophon))[^\s),]*[^\s),.]|[\w.+-]+@[\w-]+\.[\w.]+[\w])/g).map((part, j) => {
            if (j % 2 === 0) return <Fragment key={j}>{part}</Fragment>;
            const href = part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part;
            return href.startsWith("/") ? (
              <Link key={j} href={href} className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                {part}
              </Link>
            ) : (
              <a key={j} href={href} target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                {part}
              </a>
            );
          })}
        </p>
      ))}
    </>
  );
}

function Face({ owner }: { owner: Owner }) {
  return owner.portrait ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={owner.portrait} alt={owner.name} className="h-10 w-10 shrink-0 rounded-full object-cover md:h-12 md:w-12" />
  ) : (
    <Avatar name={owner.name} image={null} className="h-10 w-10 md:h-12 md:w-12" />
  );
}

export default function ChatApp({ settings: t, initial, owner, nav }: { settings: ChatSettings; initial: Conversation[]; owner: Owner; nav: { label: string; href: string }[] }) {
  const [list, setList] = useState(initial);
  const [current, setCurrent] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [mine, setMine] = useState<string[]>([]);
  const [view, setView] = useState<"chat" | "map">("chat");
  const [side, setSide] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  const open = (c: Conversation | null) => {
    setCurrent(c?.id ?? null);
    setMessages(c?.messages ?? []);
    setView("chat");
    setError("");
    if (innerWidth < 900) setSide(false);
    if (!preview) history.replaceState(null, "", c ? `?c=${c.id}` : location.pathname);
  };

  const refresh = () =>
    preview
      ? Promise.resolve(null)
      : fetch("/api/conversations?sort=-createdAt&limit=100&depth=0")
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            const rows: Conversation[] | null = d?.docs?.map(toConversation) ?? null;
            if (rows) setList(rows);
            return rows;
          })
          .catch(() => null);

  useEffect(() => {
    queueMicrotask(() => {
      setMine(readMine());
      setSide(innerWidth >= 900);
    });
    const id = new URLSearchParams(location.search).get("c");
    refresh().then((rows) => {
      const c = id && (rows ?? initial).find((x) => x.id === id);
      if (c) open(c);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => end.current?.scrollIntoView({ block: "end", behavior: "smooth" }), [messages]);

  const own = current ? mine.includes(current) : true;
  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    const continuing = current && own ? current : null;
    const base = continuing ? messages : [];
    if (!continuing) setCurrent(null);
    setMessages([...base, { role: "visitor", text }, { role: "assistant", text: "" }]);
    setInput("");
    setError("");
    setBusy(true);
    const show = (answer: string) => setMessages([...base, { role: "visitor", text }, { role: "assistant", text: answer }]);
    if (preview) {
      await new Promise((r) => setTimeout(r, 600));
      show(t.offlineText);
      setBusy(false);
      return;
    }
    try {
      const res = await fetch("/api/conversations/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: continuing, message: text, visitor: visitorId() }),
      });
      if (!res.ok || !res.body) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setMessages(base);
        setInput(text);
        setError(d.error ?? "Something went wrong. Please try again.");
        return;
      }
      const id = res.headers.get("x-conversation-id");
      if (id && !continuing) {
        addMine(id);
        setMine(readMine());
        setCurrent(id);
        history.replaceState(null, "", `?c=${id}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        show(answer);
      }
      refresh();
    } catch {
      setError("Couldn't reach the chat. Please try again.");
    } finally {
      setBusy(false);
      field.current?.focus();
    }
  };

  const shown = t.showConversations ? list.filter((c) => c.messages.length) : list.filter((c) => mine.includes(c.id));
  const viewing = current ? list.find((c) => c.id === current) : null;
  const pins = shown.filter((c) => c.lat !== undefined && c.lon !== undefined).map((c) => ({ id: c.id, lat: c.lat!, lon: c.lon!, label: c.title, sub: [shortDate(c.at), placeName(c, true)].filter(Boolean).join(" · ") }));

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[300px] flex-col border-r border-rule bg-[#080808] transition-transform duration-500 ease-[var(--ease)] md:static md:z-auto ${
          side ? "translate-x-0" : "-translate-x-full md:-ml-[300px]"
        } md:transition-[margin,transform]`}
      >
        <div className="flex items-center justify-between px-5 pb-4 pt-6">
          <h1 className="text-h3">{t.conversationsTitle}</h1>
          <button onClick={() => open(null)} className="whitespace-nowrap rounded-full border border-white/10 px-3 py-1.5 text-micro text-soft transition-colors hover:border-white/30 hover:text-ink">
            {t.newChatLabel}
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto px-2 pb-6">
          {shown.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => open(c)}
                className={`block w-full rounded-xl px-3 py-3 text-left transition-colors ${c.id === current ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"}`}
              >
                <span className="flex items-center gap-2 text-micro text-soft">
                  <span className="truncate">{[shortDate(c.at), placeName(c, true)].filter(Boolean).join(" · ")}</span>
                  {c.demo && <span className="eyebrow shrink-0 text-[10px]">Sample</span>}
                  {mine.includes(c.id) && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4f8cff]" />}
                </span>
                <span className="mt-1 block truncate text-body">{c.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {side && <button aria-label="Close conversations" onClick={() => setSide(false)} className="fixed inset-0 z-20 bg-black/60 md:hidden" />}

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 md:px-8 md:py-6">
          <button
            onClick={() => setSide((v) => !v)}
            aria-label="Toggle conversations"
            aria-expanded={side}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-soft transition-colors hover:border-white/30 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
              <path d="M9.5 4.5v15" />
            </svg>
          </button>
          <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1" role="tablist">
            {(["chat", "map"] as const).map((v) => (
              <button
                key={v}
                role="tab"
                aria-selected={view === v}
                onClick={() => setView(v)}
                className={`rounded-full px-4 py-1.5 text-micro transition-colors duration-300 ${view === v ? "bg-white/10 text-ink" : "text-soft hover:text-ink"}`}
              >
                {v === "chat" ? t.chatLabel : t.mapLabel}
              </button>
            ))}
          </div>
          <nav className="flex justify-end gap-5 text-body md:gap-7">
            {nav.map((n, i) => (
              <Link key={n.href} href={n.href} className={`text-soft transition-colors hover:text-ink ${i ? "hidden lg:inline" : ""}`}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        {view === "map" ? (
          <div className="flex flex-1 items-center overflow-auto px-4 pb-8 md:px-10">
            <div className="fade mx-auto w-full min-w-[720px] max-w-[1200px]">
              <WorldMap pins={pins} onPick={(id) => open(list.find((c) => c.id === id) ?? null)} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 md:px-8">
              <div className="mx-auto flex min-h-full max-w-[800px] flex-col pb-6 pt-4 md:pt-10">
                {viewing && !own && (
                  <p className="eyebrow mb-6 text-center">{[shortDate(viewing.at), placeName(viewing)].filter(Boolean).join(" · ")}</p>
                )}
                <div className="rise flex items-end gap-3">
                  <Face owner={owner} />
                  <p className="rounded-3xl rounded-bl-md bg-white/[0.08] px-5 py-3 text-lead">{t.greeting}</p>
                </div>
                <div className="mt-6 space-y-5">
                  {messages.map((m, i) =>
                    m.role === "visitor" ? (
                      <div key={i} className="fade flex justify-end">
                        <p className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-md bg-ink px-5 py-3 text-body text-paper">{m.text}</p>
                      </div>
                    ) : (
                      <div key={i} className="fade flex items-end gap-3">
                        <Face owner={owner} />
                        <div className="max-w-[85%] rounded-3xl rounded-bl-md bg-white/[0.08] px-5 py-3 text-body">
                          {m.text ? (
                            <Rich text={m.text} />
                          ) : (
                            <span className="flex gap-1 py-2" aria-label="Writing">
                              {[0, 1, 2].map((d) => (
                                <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-soft" style={{ animationDelay: `${d * 120}ms` }} />
                              ))}
                            </span>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
                <div ref={end} />
                {!messages.length && (
                  <ul className="mt-auto flex flex-col items-start gap-2.5 pt-10">
                    {t.suggestions.map((s, i) => (
                      <li key={s} className="rise" style={{ ["--i" as string]: i + 2 }}>
                        <button
                          onClick={() => send(s)}
                          className="rounded-2xl border border-dashed border-white/15 px-4 py-2.5 text-left text-body text-soft transition-colors hover:border-white/40 hover:text-ink"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <form
              className="mx-auto w-full max-w-[800px] px-4 pb-5 md:pb-8"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              {error && <p className="mb-3 text-small text-[#f0a3a3]">{error}</p>}
              <div className="flex items-end gap-2 rounded-[28px] border border-white/10 bg-white/[0.06] py-2 pl-5 pr-2 transition-colors focus-within:border-white/25">
                <textarea
                  ref={field}
                  rows={1}
                  value={input}
                  maxLength={1000}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder={t.placeholder}
                  aria-label={t.placeholder}
                  className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent py-2 text-lead no-ring outline-none [field-sizing:content] placeholder:text-faint"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-paper transition-all duration-300 disabled:scale-90 disabled:opacity-30"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </button>
              </div>
              {t.disclosure && <p className="mt-3 text-center text-micro text-faint">{t.disclosure}</p>}
            </form>
          </>
        )}
      </main>
    </div>
  );
}
