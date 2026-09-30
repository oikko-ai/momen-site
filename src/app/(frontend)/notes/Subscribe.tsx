"use client";

import { useState } from "react";

// No mailing service yet: signing up drafts an email to Momen with the address.
export default function Subscribe({ email: to, linkedin, title, text }: { email: string; linkedin?: string; title: string; text: string }) {
  const [email, setEmail] = useState("");
  return (
    <aside className="h-fit md:sticky md:top-8" data-inview>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          location.href = `mailto:${to}?subject=${encodeURIComponent("Add me to your notes list")}&body=${encodeURIComponent(email)}`;
        }}
        className="rounded-xl border border-white/5 bg-card p-5"
      >
        <p className="text-[16px]">{title}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-soft">{text}</p>
        <div className="mt-4 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-label="Email"
            className="min-w-0 flex-1 rounded-full bg-black/40 px-4 py-2 text-[13px] outline-none placeholder:text-faint"
          />
          <button className="rounded-full bg-ink px-4 py-2 text-[13px] text-paper transition-transform active:scale-95">Sign up</button>
        </div>
      </form>
      {linkedin && (
        <a href={linkedin} target="_blank" rel="noreferrer" className="mt-3 block text-center text-[12px] text-soft hover:text-ink">
        Or follow on LinkedIn
      </a>
      )}
    </aside>
  );
}
