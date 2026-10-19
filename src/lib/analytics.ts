"use client";

import { createStore } from "@/lib/store";

/**
 * Snapchat Pixel wrapper.
 *
 * Events are only sent when (1) a pixel ID is configured, (2) the visitor has
 * consented (if consent is required) and (3) the action actually succeeded.
 * Purchase is fired only after the order API confirms the order was saved.
 */

export const SNAP_PIXEL_ID = (process.env.NEXT_PUBLIC_SNAP_PIXEL_ID ?? "").trim();
export const CONSENT_REQUIRED = (process.env.NEXT_PUBLIC_TRACKING_CONSENT_REQUIRED ?? "true").trim() !== "false";

export type Consent = "granted" | "denied" | null;
const consentStore = createStore<Consent>("lux.consent.v1", null, (raw) =>
  raw === "granted" || raw === "denied" ? raw : null,
);
export const useConsent = consentStore.useStore;
export const setConsent = (value: Exclude<Consent, null>) => consentStore.set(value);

export function trackingAllowed() {
  if (!SNAP_PIXEL_ID) return false;
  return !CONSENT_REQUIRED || consentStore.get() === "granted";
}

type SnapEvent = "PAGE_VIEW" | "VIEW_CONTENT" | "ADD_CART" | "START_CHECKOUT" | "PURCHASE" | "ADD_TO_WISHLIST" | "SEARCH";

type SnapParams = {
  item_ids?: string[];
  item_category?: string;
  price?: number;
  currency?: "SAR";
  number_items?: number;
  transaction_id?: string;
  client_dedup_id?: string;
  search_string?: string;
};

declare global {
  interface Window {
    snaptr?: ((...args: unknown[]) => void) & { queue?: unknown[] };
  }
}

// Events raised before the pixel script has initialised (e.g. on first page load).
const pending: [SnapEvent, SnapParams][] = [];

function send(event: SnapEvent, params: SnapParams) {
  try {
    window.snaptr?.("track", event, params);
  } catch {
    // Never let analytics break the shopping flow.
  }
  if (process.env.NODE_ENV !== "production") console.info("[snap]", event, params);
}

export function track(event: SnapEvent, params: SnapParams = {}) {
  if (typeof window === "undefined" || !trackingAllowed()) return;
  if (!window.snaptr) {
    if (pending.length < 20) pending.push([event, params]);
    return;
  }
  send(event, params);
}

/** Called by the pixel loader once `snaptr` is initialised. */
export function flushPending() {
  while (pending.length) {
    const next = pending.shift();
    if (next) send(next[0], next[1]);
  }
}
