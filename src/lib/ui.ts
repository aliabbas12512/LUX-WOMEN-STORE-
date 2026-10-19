"use client";

import { createStore } from "@/lib/store";

export type Toast = { id: number; message: string; tone?: "default" | "error" };

const uiStore = createStore<{ cartOpen: boolean; toasts: Toast[] }>(null, { cartOpen: false, toasts: [] });

export const useUi = uiStore.useStore;

export function openCart() {
  uiStore.set((s) => ({ ...s, cartOpen: true }));
}
export function closeCart() {
  uiStore.set((s) => ({ ...s, cartOpen: false }));
}

let toastId = 0;
export function toast(message: string, tone: Toast["tone"] = "default") {
  const id = ++toastId;
  uiStore.set((s) => ({ ...s, toasts: [...s.toasts.slice(-2), { id, message, tone }] }));
  window.setTimeout(() => uiStore.set((s) => ({ ...s, toasts: s.toasts.filter((t) => t.id !== id) })), 3200);
}
