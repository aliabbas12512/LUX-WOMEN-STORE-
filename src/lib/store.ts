"use client";

import { useSyncExternalStore } from "react";

/**
 * Minimal external store with optional localStorage persistence.
 * Server renders always see `initial`, so hydration never mismatches.
 */
export function createStore<T>(key: string | null, initial: T, revive?: (raw: unknown) => T) {
  let state = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    if (!key) return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = revive ? revive(JSON.parse(raw)) : (JSON.parse(raw) as T);
    } catch {
      state = initial;
    }
    window.addEventListener("storage", (e) => {
      if (e.key !== key) return;
      try {
        state = e.newValue ? (revive ? revive(JSON.parse(e.newValue)) : (JSON.parse(e.newValue) as T)) : initial;
      } catch {
        state = initial;
      }
      listeners.forEach((l) => l());
    });
  }

  const store = {
    get(): T {
      load();
      return state;
    },
    set(next: T | ((prev: T) => T)) {
      load();
      state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      if (key) {
        try {
          window.localStorage.setItem(key, JSON.stringify(state));
        } catch {
          // Storage full or unavailable (private mode) — keep in memory.
        }
      }
      listeners.forEach((l) => l());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  function useStore(): T {
    return useSyncExternalStore(store.subscribe, store.get, () => initial);
  }

  return { ...store, useStore };
}

/** True after hydration — use to avoid flashing server-default UI for persisted state. */
const hydration = createStore<boolean>(null, false);
if (typeof window !== "undefined") queueMicrotask(() => hydration.set(true));
export const useHydrated = hydration.useStore;
