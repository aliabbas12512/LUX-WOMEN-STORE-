"use client";

import { createStore } from "@/lib/store";

/** A copy of orders placed from this device, shown on the account page. */
export type LocalOrder = {
  reference: string;
  createdAt: string;
  stored: boolean;
  total: number;
  subtotal: number;
  deliveryFee: number;
  city: string;
  name: string;
  items: { name: string; colorName: string; size: string; qty: number; unitPrice: number; slug: string }[];
  whatsappMessage: string;
};

const ordersStore = createStore<LocalOrder[]>("lux.orders.v1", [], (raw) => (Array.isArray(raw) ? (raw as LocalOrder[]) : []));

export const useLocalOrders = ordersStore.useStore;

export function saveLocalOrder(order: LocalOrder) {
  ordersStore.set((orders) => [order, ...orders.filter((o) => o.reference !== order.reference)].slice(0, 20));
}
