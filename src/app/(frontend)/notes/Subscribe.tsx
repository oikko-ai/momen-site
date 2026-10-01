"use client";

import { useState } from "react";

type Props = { email: string; title: string; text: string; doneText: string; placeholder: string; button: string; rss?: string; rssLabel?: string; wide?: boolean };

// Signups are saved to Subscribers in the CMS. Where the CMS isn't reachable (the static preview), it drafts an email instead.
export default function Subscribe({ email: to, title, text, doneText, placeholder, button, rss, rssLabel, wide = false }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const ok =
      !process.env.NEXT_PUBLIC_PREVIEW &&
      (await fetch("/api/subscribers", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) })
        .then((r) => r.ok || r.status === 400)
        .catch(() => false));
    if (!ok) location.href = `mailto:${to}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(email)}`;
    setState("done");
  };
  const form = (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 rounded-lg bg-white/[0.06] px-4 py-3 text-small outline-none placeholder:text-faint focus:bg-white/10"
      />
      <button disabled={state === "sending"} className="rounded-full bg-ink px-5 py-3 text-small text-paper transition-transform active:scale-95 disabled:opacity-60">
        {button}
      </button>
    </form>
  );
  const body = state === "done" ? <p className="py-3 text-small text-ink">{doneText}</p> : form;
  if (wide)
    return (
      <div className="grid gap-5 rounded-3xl border border-white/5 bg-card p-6 md:grid-cols-[1fr_1.15fr] md:gap-8 md:p-10" data-inview>
        <p className="text-h3">{title}</p>
        <div>
          <p className="mb-5 text-small text-soft">{text}</p>
          {body}
        </div>
      </div>
    );
  return (
    <aside className="h-fit md:sticky md:top-24" data-inview>
      <div className="rounded-3xl border border-white/5 bg-card p-7 md:p-8">
        <p className="text-h3">{title}</p>
        <p className="mb-6 mt-2 text-small text-soft">{text}</p>
        {body}
      </div>
      {rss && rssLabel && (
        <a href={rss} className="u mx-auto mt-4 block w-fit text-small text-soft hover:text-ink">
          {rssLabel}
        </a>
      )}
    </aside>
  );
}
