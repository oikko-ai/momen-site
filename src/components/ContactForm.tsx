"use client";

import { useState } from "react";

type State = "idle" | "sending" | "sent" | "error";

// A note-style form. Messages are saved in the CMS inbox (Inbox → Messages).
// If that can't be reached, as in the static preview, it opens the visitor's mail app instead.
export default function ContactForm({ to }: { to: string }) {
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<State>("idle");
  const [note, setNote] = useState("");

  const mail = () => {
    const body = `${message}\n\n${from ? `From: ${from}` : ""}`;
    location.href = `mailto:${to}?subject=${encodeURIComponent(subject || "Hello")}&body=${encodeURIComponent(body)}`;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const company = (new FormData(e.currentTarget).get("company") as string) ?? "";
    if (process.env.NEXT_PUBLIC_PREVIEW) {
      mail();
      setState("sent");
      setNote("Your mail app should open with this draft.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: from, subject, message, company }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) {
        setState("sent");
        setNote(`Thanks. I'll reply to ${from}.`);
        setSubject("");
        setMessage("");
      } else if (res.status < 500) {
        setState("error");
        setNote(data.error ?? "Something is missing.");
      } else throw new Error();
    } catch {
      mail();
      setState("sent");
      setNote("Couldn't send from here, so your mail app should open with this draft.");
    }
  };

  const row = "flex items-center gap-4 border-b border-white/5 px-6 py-5 text-body transition-colors focus-within:bg-white/[0.03] md:px-8";
  return (
    <form onSubmit={submit} className="overflow-hidden rounded-3xl border border-white/5 bg-[#141414]">
      <div className={row}>
        <span className="w-20 shrink-0 text-faint">To</span>
        <span className="truncate rounded-full bg-white/10 px-3 py-1 text-small">{to}</span>
      </div>
      <label className={row} htmlFor="cf-from">
        <span className="w-20 shrink-0 text-faint">From</span>
        <input id="cf-from" type="email" required value={from} onChange={(e) => setFrom(e.target.value)} placeholder="you@company.com" className="no-ring min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint" />
      </label>
      <label className={row} htmlFor="cf-subject">
        <span className="w-20 shrink-0 text-faint">Subject</span>
        <input id="cf-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What should we build?" className="no-ring min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint" />
      </label>
      {/* Left empty by people; bots that fill every field are ignored. */}
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <textarea
        id="cf-message"
        aria-label="Message"
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={7}
        placeholder="A few lines about the product, the team and the timeline."
        className="no-ring block w-full resize-none bg-transparent transition-colors focus:bg-white/[0.03] px-6 py-5 text-body outline-none placeholder:text-faint md:px-8"
      />
      <div className="flex items-center justify-between gap-4 px-6 pb-6 md:px-8">
        <span role="status" className={`text-small ${state === "error" ? "text-[#f0a3a3]" : "text-soft"}`}>
          {note || "Goes straight to my inbox."}
        </span>
        <button
          type="submit"
          disabled={state === "sending"}
          className="shrink-0 rounded-full bg-ink px-7 py-3 text-body font-medium text-paper transition-transform duration-200 hover:scale-[1.03] active:scale-95 disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
