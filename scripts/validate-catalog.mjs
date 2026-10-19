// Validates src/data/products.json. Usage: npm run catalog:validate [-- --production]
import { existsSync } from "node:fs";
import { productsPath, readJson, root } from "./lib-catalog.mjs";

const production = process.argv.includes("--production");
const products = readJson(productsPath, []);
const errors = [];
const warnings = [];
const CATEGORIES = ["abayas", "dresses", "everyday", "occasion"];
const GARMENTS = ["abaya", "dress", "kaftan"];
const hosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "").split(",").map((h) => h.trim()).filter(Boolean);
const ids = new Set();
const slugs = new Set();

for (const p of products) {
  const at = `[${p.id ?? "?"}]`;
  const req = (cond, msg) => cond || errors.push(`${at} ${msg}`);
  req(typeof p.id === "string" && p.id, "missing id");
  req(typeof p.slug === "string" && /^[a-z0-9-]+$/.test(p.slug), "slug must be lowercase latin letters, digits and dashes");
  req(!ids.has(p.id), "duplicate id");
  req(!slugs.has(p.slug), "duplicate slug");
  ids.add(p.id);
  slugs.add(p.slug);
  req(typeof p.name === "string" && p.name.length >= 3, "missing Arabic name");
  req(typeof p.description === "string" && p.description.length >= 20, "description too short");
  req(CATEGORIES.includes(p.category), `invalid category "${p.category}"`);
  req(GARMENTS.includes(p.garment), `invalid garment "${p.garment}"`);
  req(Number.isFinite(p.price) && p.price > 0, "price must be a positive number (SAR)");
  if (p.compareAtPrice != null) req(p.compareAtPrice > p.price, "compareAtPrice must be higher than price (genuine discounts only)");
  req(Array.isArray(p.colors) && p.colors.length > 0, "needs at least one colour");
  req(Array.isArray(p.sizes) && p.sizes.length > 0, "needs at least one size");
  for (const c of p.colors ?? []) req(/^#[0-9a-fA-F]{6}$/.test(c.hex ?? ""), `colour ${c.id} needs a 6-digit hex`);
  for (const c of p.colors ?? [])
    for (const s of p.sizes ?? []) {
      const v = (p.variants ?? []).find((x) => x.color === c.id && x.size === s);
      if (!v) warnings.push(`${at} no variant for ${c.id}/${s} — it will show as unavailable`);
      else req(v.stock === null || (Number.isInteger(v.stock) && v.stock >= 0), `variant ${c.id}/${s} stock must be null or a whole number`);
    }
  for (const img of p.images ?? []) {
    req(img.src && img.alt && img.width > 0 && img.height > 0, "each image needs src, alt, width, height");
    if (img.src?.startsWith("/")) req(existsSync(new URL(`public${img.src}`, root)), `image not found in /public: ${img.src}`);
    else if (img.src) {
      const host = new URL(img.src).hostname;
      if (!hosts.includes(host)) warnings.push(`${at} image host ${host} is not listed in NEXT_PUBLIC_IMAGE_HOSTS`);
    }
  }
  if (!p.images?.length) warnings.push(`${at} has no authorised photos yet (illustration will be shown)`);
  if (p.sample && production) errors.push(`${at} is SAMPLE data — remove or replace it before going live`);
  if (!Number.isFinite(Date.parse(p.createdAt))) errors.push(`${at} createdAt must be an ISO date`);
}

if (products.length === 0) errors.push("catalogue is empty");
warnings.forEach((w) => console.warn("warn ", w));
errors.forEach((e) => console.error("error", e));
console.log(`\n${products.length} products · ${errors.length} errors · ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
