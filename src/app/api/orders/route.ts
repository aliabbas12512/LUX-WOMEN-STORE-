import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { deliveryFeeFor, storeConfig } from "@/config/store";
import { getProductById, isVariantAvailable } from "@/lib/catalog";
import { cityName, normalizeSaudiMobile, validateCustomer, type OrderRequest } from "@/lib/order-schema";
import { persistOrder, storageConfigured, type StoredOrder } from "@/lib/order-storage";

// Best-effort in-memory rate limit (per server instance).
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  // Generous limit: many mobile customers share carrier IPs.
  return recent.length > 30;
}

function reference() {
  const d = new Date();
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from({ length: 5 }, () => alphabet[randomInt(alphabet.length)]).join("");
  return `${storeConfig.order.referencePrefix}-${ymd}-${suffix}`;
}

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.slice(0, max) : "");

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let body: OrderRequest;
  try {
    body = (await req.json()) as OrderRequest;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real customers never fill this hidden field.
  if (str(body?.website)) return NextResponse.json({ error: "rejected" }, { status: 400 });

  const raw = (body?.customer ?? {}) as Partial<Record<string, unknown>>;
  const customer = {
    name: str(raw.name, 80).trim(),
    phone: str(raw.phone, 30),
    cityId: str(raw.cityId, 40),
    otherCity: str(raw.otherCity, 60).trim(),
    district: str(raw.district, 80).trim(),
    address: str(raw.address, 300).trim(),
    notes: str(raw.notes, 500).trim(),
  };
  const fieldErrors = validateCustomer(customer);
  if (Object.keys(fieldErrors).length) return NextResponse.json({ error: "invalid_customer", fieldErrors }, { status: 422 });

  const items = Array.isArray(body?.items) ? body.items.slice(0, 30) : [];
  if (items.length === 0) return NextResponse.json({ error: "empty_cart" }, { status: 422 });

  // Prices always come from the server-side catalogue, never from the client.
  const lines: StoredOrder["items"] = [];
  for (const item of items) {
    const product = getProductById(str(item?.productId, 60));
    const qty = Number(item?.qty);
    const color = str(item?.color, 40);
    const size = str(item?.size, 20);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > storeConfig.order.maxQuantityPerLine || !isVariantAvailable(product, color, size)) {
      return NextResponse.json({ error: "cart_changed" }, { status: 409 });
    }
    const stock = product.variants.find((v) => v.color === color && v.size === size)?.stock;
    if (typeof stock === "number" && qty > stock) return NextResponse.json({ error: "cart_changed" }, { status: 409 });
    lines.push({
      product_id: product.id,
      name: product.name,
      color: product.colors.find((c) => c.id === color)?.name ?? color,
      size,
      qty,
      unit_price: product.price,
      line_total: product.price * qty,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.line_total, 0);
  const deliveryFee = deliveryFeeFor(customer.cityId, subtotal);
  // Campaign attribution captured on landing (utm_* / ScCid), sanitised.
  const utm: Record<string, string> = {};
  if (body?.attribution && typeof body.attribution === "object") {
    for (const [k, v] of Object.entries(body.attribution).slice(0, 10)) {
      if (/^(utm_[a-z]+|ScCid)$/.test(k) && typeof v === "string") utm[k] = v.slice(0, 100);
    }
  }

  const order: StoredOrder = {
    reference: reference(),
    created_at: new Date().toISOString(),
    status: "new",
    customer_name: customer.name,
    customer_phone: normalizeSaudiMobile(customer.phone)!,
    city: cityName(customer),
    district: customer.district,
    address: customer.address,
    notes: customer.notes || null,
    items: lines,
    subtotal,
    delivery_fee: deliveryFee,
    total: subtotal + deliveryFee,
    currency: "SAR",
    source: { utm: Object.keys(utm).length ? utm : undefined, user_agent: req.headers.get("user-agent")?.slice(0, 200) },
  };

  let stored = false;
  if (storageConfigured()) {
    const result = await persistOrder(order);
    if (result.succeeded === 0) {
      // Storage is configured but failed: tell the customer instead of pretending.
      return NextResponse.json({ error: "storage_failed" }, { status: 502 });
    }
    stored = true;
  }

  return NextResponse.json({
    reference: order.reference,
    stored,
    subtotal,
    deliveryFee,
    total: order.total,
    city: order.city,
    phone: order.customer_phone,
    items: lines,
  });
}
