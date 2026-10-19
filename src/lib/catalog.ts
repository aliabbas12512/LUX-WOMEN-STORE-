import rawProducts from "@/data/products.json";
import type { CollectionSlug, Product, StockState } from "@/lib/types";

/** Number of most recently added products shown as "new arrivals". */
const NEW_ARRIVALS_COUNT = 8;
/** Total units at or below which a product is shown as "limited pieces". */
const LOW_STOCK_THRESHOLD = 3;

const products = rawProducts as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function catalogHasSamples() {
  return products.some((p) => p.sample);
}

export function isOnSale(p: Product) {
  return typeof p.compareAtPrice === "number" && p.compareAtPrice > p.price;
}

export function byNewest(a: Product, b: Product) {
  return b.createdAt.localeCompare(a.createdAt);
}

export function getNewArrivals(limit = NEW_ARRIVALS_COUNT) {
  return [...products].sort(byNewest).slice(0, limit);
}

export function getBestSellers(limit = 8) {
  return products.filter((p) => p.bestSeller).slice(0, limit);
}

export function getOffers() {
  return products.filter(isOnSale);
}

export function getProductsForCollection(slug: CollectionSlug): Product[] {
  switch (slug) {
    case "all":
      return [...products].sort(byNewest);
    case "new":
      return getNewArrivals();
    case "offers":
      return getOffers();
    default:
      return products.filter((p) => p.category === slug);
  }
}

export function getRelated(product: Product, limit = 4) {
  const same = products.filter((p) => p.id !== product.id && p.category === product.category);
  const others = products.filter((p) => p.id !== product.id && p.category !== product.category);
  return [...same, ...others].slice(0, limit);
}

/* ─── Availability ─────────────────────────────────────────────── */

export function variantStock(p: Product, color: string, size: string): number | null | undefined {
  return p.variants.find((v) => v.color === color && v.size === size)?.stock;
}

export function isVariantAvailable(p: Product, color: string, size: string) {
  const stock = variantStock(p, color, size);
  // undefined = combination does not exist; 0 = sold out; null = confirmed on order.
  return stock === null || (typeof stock === "number" && stock > 0);
}

export function stockState(p: Product): StockState {
  const tracked = p.variants.filter((v) => v.stock !== null);
  const untracked = p.variants.length - tracked.length;
  const units = tracked.reduce((sum, v) => sum + (v.stock ?? 0), 0);
  if (units === 0 && untracked === 0) return "out_of_stock";
  if (untracked > 0 && units === 0) return "on_request";
  if (untracked === 0 && units <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

export function colorAvailable(p: Product, color: string) {
  return p.sizes.some((s) => isVariantAvailable(p, color, s));
}

/* ─── Facets for filtering ─────────────────────────────────────── */

export type Facets = {
  sizes: string[];
  colors: { id: string; name: string; hex: string }[];
  minPrice: number;
  maxPrice: number;
};

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

function sizeRank(s: string) {
  const i = SIZE_ORDER.indexOf(s);
  if (i >= 0) return i;
  const n = Number(s);
  return Number.isFinite(n) ? 100 + n : 1000;
}

export function getFacets(list: Product[]): Facets {
  const sizes = new Set<string>();
  const colors = new Map<string, Facets["colors"][number]>();
  let minPrice = Infinity;
  let maxPrice = 0;
  for (const p of list) {
    p.sizes.forEach((s) => sizes.add(s));
    p.colors.forEach((c) => colors.set(c.id, c));
    minPrice = Math.min(minPrice, p.price);
    maxPrice = Math.max(maxPrice, p.price);
  }
  return {
    sizes: [...sizes].sort((a, b) => sizeRank(a) - sizeRank(b)),
    colors: [...colors.values()],
    minPrice: Number.isFinite(minPrice) ? minPrice : 0,
    maxPrice,
  };
}
