"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

export function AnnouncementBar() {
  const messages = siteConfig.announcements;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 4800);
    return () => window.clearInterval(id);
  }, [messages.length]);

  if (messages.length === 0) return null;

  return (
    <div className="relative z-40 bg-ink text-ivory">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center overflow-hidden px-4">
        <p key={index} className="animate-fade-in text-[0.74rem] tracking-wide text-ivory/90" aria-live="polite">
          {messages[index]}
        </p>
      </div>
    </div>
  );
}
