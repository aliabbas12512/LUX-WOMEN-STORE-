"use client";

import { createStore } from "@/lib/store";

const favStore = createStore<string[]>("lux.favorites.v1", [], (raw) =>
  Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : [],
);

export const useFavorites = favStore.useStore;

export function toggleFavorite(productId: string) {
  let added = false;
  favStore.set((ids) => {
    added = !ids.includes(productId);
    return added ? [...ids, productId] : ids.filter((id) => id !== productId);
  });
  return added;
}
