"use client";

import { useState } from "react";

// A note-style form. Sending opens the visitor's mail app with everything filled in.
export default function ContactForm({ to }: { to: string }) {
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${message}\n\n${from ? `From: ${from}` : ""}`;
    location.href = `mailto:${to}?subject=${encodeURIComponent(subject || "Hello")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const row = "flex items-center gap-3 border-b border-white/5 px-6 py-5 text-[17px]";
  return (
    <form onSubmit={submit} className="overflow-hidden rounded-2xl border border-white/5 bg-[#161616]">
      <div className={row}>
        <span className="w-20 text-faint">To</span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[16px]">{to}</span>
      </div>
      <label className={row} htmlFor="cf-from">
        <span className="w-20 text-faint">From</span>
        <input id="cf-from" type="email" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="you@company.com" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint" />
      </label>
      <label className={row} htmlFor="cf-subject">
        <span className="w-20 text-faint">Subject</span>
        <input id="cf-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What should we build?" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint" />
      </label>
      <textarea
        id="cf-message"
        aria-label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={7}
        placeholder="A few lines about the product, the team and the timeline."
        className="block w-full resize-none bg-transparent px-6 py-5 text-[17px] leading-relaxed outline-none placeholder:text-faint"
      />
      <div className="flex items-center justify-between px-6 pb-6">
        <span className="text-[15px] text-soft">{sent ? "Your mail app should open with this draft." : "Opens in your mail app."}</span>
        <button type="submit" className="rounded-full bg-ink px-7 py-2.5 text-[16px] font-medium text-paper transition-transform duration-200 active:scale-95">
          Send
        </button>
      </div>
    </form>
  );
}
