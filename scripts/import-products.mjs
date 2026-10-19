// Imports an authorised supplier/product CSV into the storefront catalogue.
// Usage: npm run catalog:import -- path/to/products.csv [--merge]
//
// One CSV row per variant (colour + size). Product-level columns only need to be
// filled on the first row of each product_id. See catalog/products-template.csv.
//
// Rules enforced:
//  • Images are imported only when image_rights_confirmed = yes (you hold the right to use them).
//  • Supplier cost, source link and supplier name go to catalog/supplier-data.json,
//    which is never bundled into the website.
//  • If `price` is empty, a selling price is computed from supplier cost using catalog/pricing.json.
import { readFileSync, writeFileSync } from "node:fs";
import { parseCsv, pricingPath, productsPath, readJson, sellingPrice, supplierPath } from "./lib-catalog.mjs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: npm run catalog:import -- path/to/products.csv [--merge]");
  process.exit(1);
}
const merge = process.argv.includes("--merge");
const rows = parseCsv(readFileSync(file, "utf8"));
const pricing = readJson(pricingPath, {});
const byId = new Map();

for (const [i, r] of rows.entries()) {
  if (!r.product_id) throw new Error(`Row ${i + 2}: product_id is required`);
  let entry = byId.get(r.product_id);
  if (!entry) {
    const cost = r.supplier_cost ? Number(r.supplier_cost) : null;
    const currency = r.supplier_currency || "SAR";
    const price = r.price ? Number(r.price) : cost != null ? sellingPrice(cost, currency, pricing) : NaN;
    if (!Number.isFinite(price)) throw new Error(`Row ${i + 2}: provide price or supplier_cost`);
    entry = {
      product: {
        id: r.product_id,
        slug: r.slug,
        name: r.name,
        subtitle: r.subtitle || undefined,
        description: r.description,
        category: r.category,
        garment: r.garment || "abaya",
        price,
        compareAtPrice: r.compare_at_price ? Number(r.compare_at_price) : null,
        colors: [],
        sizes: [],
        variants: [],
        images: [],
        details: r.fabric || r.care ? { fabric: r.fabric || undefined, care: r.care ? r.care.split("|").map((s) => s.trim()) : undefined } : null,
        sizeChart: r.category === "abayas" ? "abaya" : "dress",
        deliveryDays: r.delivery_min_days && r.delivery_max_days ? { min: Number(r.delivery_min_days), max: Number(r.delivery_max_days) } : null,
        bestSeller: r.best_seller === "yes",
        createdAt: new Date(r.created_at || Date.now()).toISOString(),
      },
      supplier: {
        supplier: r.supplier || null,
        supplierSku: r.supplier_sku || null,
        sourceUrl: r.source_url || null,
        cost,
        currency,
      },
    };
    byId.set(r.product_id, entry);
  }
  const p = entry.product;
  if (r.color_id && !p.colors.some((c) => c.id === r.color_id)) p.colors.push({ id: r.color_id, name: r.color_name, hex: r.color_hex });
  if (r.size && !p.sizes.includes(r.size)) p.sizes.push(r.size);
  const color = r.color_id || p.colors.at(-1)?.id;
  if (color && r.size) p.variants.push({ color, size: r.size, stock: r.stock === "" ? null : Number(r.stock) });
  if (r.image_urls) {
    if (r.image_rights_confirmed !== "yes") {
      console.warn(`Row ${i + 2}: images skipped — set image_rights_confirmed=yes only if you have permission to use them.`);
    } else {
      for (const src of r.image_urls.split("|").map((s) => s.trim()).filter(Boolean)) {
        p.images.push({ src, alt: r.image_alt || `${p.name}`, width: Number(r.image_width) || 1200, height: Number(r.image_height) || 1600, color });
      }
    }
  }
}

const imported = [...byId.values()];
const existing = merge ? readJson(productsPath, []).filter((p) => !byId.has(p.id)) : [];
writeFileSync(productsPath, JSON.stringify([...existing, ...imported.map((e) => e.product)], null, 2) + "\n");
const suppliers = merge ? readJson(supplierPath, {}) : {};
for (const e of imported) suppliers[e.product.id] = e.supplier;
writeFileSync(supplierPath, JSON.stringify(suppliers, null, 2) + "\n");
console.log(`Imported ${imported.length} products${merge ? " (merged)" : ""}. Run \`npm run catalog:validate\` next.`);
