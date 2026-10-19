"use client";

import { useMemo } from "react";
import { storeConfig } from "@/config/store";
import { getProductById, isVariantAvailable } from "@/lib/catalog";
import { createStore } from "@/lib/store";
import type { Product, ProductColor } from "@/lib/types";

export type CartLine = { productId: string; color: string; size: string; qty: number };

function revive(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (l): l is CartLine =>
      l && typeof l.productId === "string" && typeof l.color === "string" && typeof l.size === "string" && Number.isInteger(l.qty) && l.qty > 0,
  );
}

const cartStore = createStore<CartLine[]>("lux.cart.v1", [], revive);
const MAX = storeConfig.order.maxQuantityPerLine;

const same = (a: CartLine, b: Pick<CartLine, "productId" | "color" | "size">) =>
  a.productId === b.productId && a.color === b.color && a.size === b.size;

export const cart = {
  add(line: CartLine) {
    cartStore.set((lines) => {
      const existing = lines.find((l) => same(l, line));
      if (existing) return lines.map((l) => (same(l, line) ? { ...l, qty: Math.min(MAX, l.qty + line.qty) } : l));
      return [...lines, { ...line, qty: Math.min(MAX, line.qty) }];
    });
  },
  setQty(key: Pick<CartLine, "productId" | "color" | "size">, qty: number) {
    cartStore.set((lines) =>
      lines.map((l) => (same(l, key) ? { ...l, qty: Math.max(1, Math.min(MAX, qty)) } : l)),
    );
  },
  remove(key: Pick<CartLine, "productId" | "color" | "size">) {
    cartStore.set((lines) => lines.filter((l) => !same(l, key)));
  },
  clear() {
    cartStore.set([]);
  },
};

export type ResolvedLine = CartLine & {
  key: string;
  product: Product | undefined;
  colorInfo: ProductColor | undefined;
  available: boolean;
  lineTotal: number;
};

export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.map((l) => {
    const product = getProductById(l.productId);
    const available = !!product && isVariantAvailable(product, l.color, l.size);
    return {
      ...l,
      key: `${l.productId}|${l.color}|${l.size}`,
      product,
      colorInfo: product?.colors.find((c) => c.id === l.color),
      available,
      lineTotal: product && available ? product.price * l.qty : 0,
    };
  });
}

export function useCart() {
  const lines = cartStore.useStore();
  return useMemo(() => {
    const resolved = resolveLines(lines);
    const subtotal = resolved.reduce((s, l) => s + l.lineTotal, 0);
    const count = resolved.reduce((s, l) => s + (l.available ? l.qty : 0), 0);
    const hasUnavailable = resolved.some((l) => !l.available);
    return { lines: resolved, subtotal, count, hasUnavailable };
  }, [lines]);
}
