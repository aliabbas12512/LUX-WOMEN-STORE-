import { readFileSync, existsSync } from "node:fs";

export const root = new URL("../", import.meta.url);
export const productsPath = new URL("src/data/products.json", root);
export const supplierPath = new URL("catalog/supplier-data.json", root);
export const pricingPath = new URL("catalog/pricing.json", root);

export const readJson = (url, fallback) => (existsSync(url) ? JSON.parse(readFileSync(url, "utf8")) : fallback);

/** Minimal RFC 4180 CSV parser (quotes, escaped quotes, CRLF). */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== "")) rows.push(row);
  const [header, ...data] = rows;
  const keys = header.map((h) => h.trim().replace(/^﻿/, ""));
  return data.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}

export function sellingPrice(cost, currency, pricing) {
  const rate = pricing.exchangeRatesToSAR?.[currency];
  if (rate == null) throw new Error(`No exchange rate configured for ${currency} in catalog/pricing.json`);
  const landed = cost * rate + (pricing.inboundShippingPerItemSAR ?? 0) + (pricing.paymentAndPackagingPerItemSAR ?? 0);
  // Target gross margin as a share of the selling price: price = landed / (1 − margin).
  const margin = Math.min(Math.max(pricing.defaultMarginPercent ?? 0, 0), 90) / 100;
  const raw = landed / (1 - margin);
  const end = pricing.roundPricesTo;
  if (end == null) return Math.round(raw);
  // Round up to the next price ending in `end` (e.g. 389, 399).
  return Math.ceil((raw - end) / 10) * 10 + end;
}
