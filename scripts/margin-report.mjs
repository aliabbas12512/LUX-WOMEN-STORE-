// Prints price, landed cost and margin per product. Usage: npm run catalog:report
import { pricingPath, productsPath, readJson, supplierPath } from "./lib-catalog.mjs";

const products = readJson(productsPath, []);
const suppliers = readJson(supplierPath, {});
const pricing = readJson(pricingPath, {});
const rows = products.map((p) => {
  const s = suppliers[p.id];
  const rate = s ? pricing.exchangeRatesToSAR?.[s.currency] : null;
  const landed = s?.cost != null && rate != null ? s.cost * rate + (pricing.inboundShippingPerItemSAR ?? 0) + (pricing.paymentAndPackagingPerItemSAR ?? 0) : null;
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    landedCostSAR: landed == null ? "—" : landed.toFixed(2),
    marginSAR: landed == null ? "—" : (p.price - landed).toFixed(2),
    marginPct: landed == null ? "—" : `${(((p.price - landed) / p.price) * 100).toFixed(1)}%`,
    supplier: s?.supplier ?? (p.sample ? "SAMPLE" : "—"),
  };
});
console.table(rows);
