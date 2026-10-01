"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// "Roll credits": scrolls the page slowly to the end, like a film's closing titles, with optional music.
// Any wheel, touch or key press hands control back to the visitor.
export default function Roll({ play, pause, music }: { play: string; pause: string; music?: string }) {
  const [on, setOn] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!on) {
      audio.current?.pause();
      return;
    }
    audio.current?.play().catch(() => null);
    let frame = 0;
    let last = performance.now();
    let y = scrollY;
    const step = (now: number) => {
      y += ((now - last) / 1000) * 48;
      last = now;
      scrollTo(0, y);
      if (y >= document.documentElement.scrollHeight - innerHeight - 1) return setOn(false);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    const stop = () => setOn(false);
    addEventListener("wheel", stop, { passive: true });
    addEventListener("touchstart", stop, { passive: true });
    addEventListener("keydown", stop);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("wheel", stop);
      removeEventListener("touchstart", stop);
      removeEventListener("keydown", stop);
    };
  }, [on]);

  return (
    <>
      {music && <audio ref={audio} src={music} preload="none" loop />}
      <button
        onClick={() => {
          if (!on && scrollY >= document.documentElement.scrollHeight - innerHeight - 1) scrollTo(0, 0);
          setOn((v) => !v);
        }}
        aria-pressed={on}
        aria-label={on ? pause : play}
        title={on ? pause : play}
        className="fixed bottom-5 left-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-[#141414]/80 text-ink shadow-xl backdrop-blur-xl transition-colors hover:bg-[#222] md:bottom-6 md:left-6"
      >
        {on ? <Pause className="h-4 w-4 fill-current" strokeWidth={1.5} /> : <Play className="ml-0.5 h-4 w-4 fill-current" strokeWidth={1.5} />}
      </button>
    </>
  );
}
