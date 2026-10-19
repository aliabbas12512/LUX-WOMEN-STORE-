import "server-only";

/**
 * Order persistence. Orders are saved to every configured destination:
 *  - Supabase (table `orders`, see supabase/schema.sql) via the REST API
 *  - A webhook (Make / Zapier / n8n / your own endpoint)
 * Returns which destinations succeeded. With none configured, nothing is stored.
 */

export type StoredOrder = {
  reference: string;
  created_at: string;
  status: "new";
  customer_name: string;
  customer_phone: string;
  city: string;
  district: string;
  address: string;
  notes: string | null;
  items: { product_id: string; name: string; color: string; size: string; qty: number; unit_price: number; line_total: number }[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  currency: "SAR";
  source: { utm?: Record<string, string>; user_agent?: string };
};

export function storageConfigured() {
  return Boolean((process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) || process.env.ORDER_WEBHOOK_URL);
}

async function saveToSupabase(order: StoredOrder) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/orders`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(order),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Supabase insert failed: ${res.status} ${await res.text().catch(() => "")}`);
  return true;
}

async function saveToWebhook(order: StoredOrder) {
  const url = process.env.ORDER_WEBHOOK_URL;
  if (!url) return null;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.ORDER_WEBHOOK_SECRET ? { "X-Order-Secret": process.env.ORDER_WEBHOOK_SECRET } : {}),
    },
    body: JSON.stringify(order),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook failed: ${res.status}`);
  return true;
}

export async function persistOrder(order: StoredOrder) {
  const results = await Promise.allSettled([saveToSupabase(order), saveToWebhook(order)]);
  const attempted = results.filter((r) => !(r.status === "fulfilled" && r.value === null));
  const succeeded = attempted.filter((r) => r.status === "fulfilled");
  results.forEach((r) => r.status === "rejected" && console.error("[orders]", r.reason));
  return { attempted: attempted.length, succeeded: succeeded.length };
}
