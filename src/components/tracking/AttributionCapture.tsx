"use client";

import { useEffect } from "react";

const KEY = "lux.attribution.v1";

/** Remembers campaign parameters (utm_*, Snapchat ScCid) from the landing URL for this session. */
export function AttributionCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const found: Record<string, string> = {};
      params.forEach((v, k) => {
        if (k.startsWith("utm_") || k === "ScCid") found[k] = v;
      });
      if (Object.keys(found).length) window.sessionStorage.setItem(KEY, JSON.stringify(found));
    } catch {}
  }, []);
  return null;
}

export function readAttribution(): Record<string, string> | undefined {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : undefined;
  } catch {
    return undefined;
  }
}
