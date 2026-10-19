"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Loader2, Lock, ShoppingBag } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ProductMedia } from "@/components/product/ProductMedia";
import { OrderTotals } from "@/components/checkout/OrderTotals";
import { WhatsAppIcon } from "@/components/layout/WhatsAppFloat";
import { readAttribution } from "@/components/tracking/AttributionCapture";
import { cart, useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { saveLocalOrder } from "@/lib/orders-local";
import { useHydrated } from "@/lib/store";
import { cn, formatPrice } from "@/lib/format";
import { cityName, normalizeSaudiMobile, validateCustomer, type CustomerInput, type FieldErrors } from "@/lib/order-schema";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import { deliveryFeeFor, storeConfig } from "@/config/store";
import { whatsappEnabled } from "@/config/site";
import { t } from "@/i18n/ar";

const empty: CustomerInput = { name: "", phone: "", cityId: "", otherCity: "", district: "", address: "", notes: "" };

type ApiSuccess = {
  reference: string;
  stored: boolean;
  subtotal: number;
  deliveryFee: number;
  total: number;
  city: string;
  phone: string;
  items: { product_id: string; name: string; color: string; size: string; qty: number; unit_price: number }[];
};

export function CheckoutView() {
  const { lines, subtotal, count, hasUnavailable } = useCart();
  const hydrated = useHydrated();
  const router = useRouter();
  const [form, setForm] = useState<CustomerInput>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CustomerInput, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const startedRef = useRef(false);
  const [completed, setCompleted] = useState(false);

  const deliveryFee = form.cityId ? deliveryFeeFor(form.cityId, subtotal) : null;
  const total = subtotal + (deliveryFee ?? 0);

  useEffect(() => {
    if (!hydrated || startedRef.current || count === 0) return;
    startedRef.current = true;
    track("START_CHECKOUT", {
      item_ids: lines.map((l) => l.productId),
      price: subtotal,
      currency: "SAR",
      number_items: count,
    });
  }, [hydrated, count, lines, subtotal]);

  function set<K extends keyof CustomerInput>(key: K, value: CustomerInput[K]) {
    const next = { ...form, [key]: value };
    setForm(next);
    if (touched[key]) setErrors(validateCustomer(next));
  }

  function blur(key: keyof CustomerInput) {
    setTouched((t0) => ({ ...t0, [key]: true }));
    setErrors(validateCustomer(form));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const v = validateCustomer(form);
    setErrors(v);
    setTouched({ name: true, phone: true, cityId: true, otherCity: true, district: true, address: true });
    if (Object.keys(v).length) {
      const first = Object.keys(v)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    if (hasUnavailable) {
      setFormError(t.checkout.errors.cartChanged);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: lines.filter((l) => l.available).map(({ productId, color, size, qty }) => ({ productId, color, size, qty })),
          website: honeypot.current?.value ?? "",
          attribution: readAttribution(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as Partial<ApiSuccess> & { error?: string; fieldErrors?: FieldErrors };

      if (!res.ok || !data.reference) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setFormError(data.error === "cart_changed" ? t.checkout.errors.cartChanged : t.checkout.errors.generic);
        setSubmitting(false);
        return;
      }

      const items = (data.items ?? []).map((i) => ({
        name: i.name,
        colorName: i.color,
        size: i.size,
        qty: i.qty,
        unitPrice: i.unit_price,
        slug: lines.find((l) => l.productId === i.product_id)?.product?.slug ?? "",
      }));
      const message = orderMessage({
        reference: data.reference,
        name: form.name.trim(),
        phone: data.phone ?? form.phone,
        city: data.city ?? cityName(form),
        district: form.district.trim(),
        address: form.address.trim(),
        notes: form.notes.trim() || undefined,
        items,
        subtotal: data.subtotal ?? subtotal,
        deliveryFee: data.deliveryFee ?? 0,
        total: data.total ?? total,
      });

      saveLocalOrder({
        reference: data.reference,
        createdAt: new Date().toISOString(),
        stored: !!data.stored,
        total: data.total ?? total,
        subtotal: data.subtotal ?? subtotal,
        deliveryFee: data.deliveryFee ?? 0,
        city: data.city ?? cityName(form),
        name: form.name.trim(),
        items,
        whatsappMessage: message,
      });

      // A purchase conversion is only reported when the order was actually saved.
      if (data.stored) {
        track("PURCHASE", {
          item_ids: (data.items ?? []).map((i) => i.product_id),
          price: data.total,
          currency: "SAR",
          number_items: items.reduce((s, i) => s + i.qty, 0),
          transaction_id: data.reference,
          client_dedup_id: data.reference,
        });
      }

      setCompleted(true);
      cart.clear();
      router.replace(`/checkout/success?ref=${encodeURIComponent(data.reference)}`);
    } catch {
      setFormError(t.checkout.errors.generic);
      setSubmitting(false);
    }
  }

  if (!hydrated || completed) {
    return <div className="mx-auto min-h-[60vh] max-w-6xl px-5 py-16" aria-busy="true" />;
  }

  if (count === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-20 text-center">
        <ShoppingBag className="size-10 text-taupe" strokeWidth={0.9} />
        <h1 className="mt-6 font-display text-3xl">{t.cart.empty}</h1>
        <p className="mt-3 text-[0.9rem] leading-7 text-muted">أضيفي القطع التي تعجبكِ ثم عودي لإتمام الطلب.</p>
        <ButtonLink href="/collections/all" size="lg" className="mt-8">
          {t.cart.startShopping}
        </ButtonLink>
      </section>
    );
  }

  const fallbackWa =
    whatsappEnabled && formError
      ? whatsappLink(
          `مرحباً، أرغب في طلب:\n${lines
            .filter((l) => l.product)
            .map((l) => `• ${l.product!.name} — ${l.colorInfo?.name ?? ""} / مقاس ${l.size} × ${l.qty}`)
            .join("\n")}`,
        )
      : null;

  const summary = (
    <div>
      <ul className="divide-y divide-line">
        {lines.map((l) =>
          l.product ? (
            <li key={l.key} className="flex gap-3.5 py-4">
              <div className="relative h-20 w-15 shrink-0 overflow-hidden rounded-md bg-beige">
                <ProductMedia product={l.product} colorId={l.color} sizes="60px" />
                <span className="absolute -end-0 -top-0 grid size-5 place-items-center rounded-bl-md bg-ink text-[0.65rem] text-ivory tabular-nums">
                  {l.qty}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.85rem] leading-6">{l.product.name}</p>
                <p className="text-[0.75rem] text-muted">
                  {l.colorInfo?.name} · مقاس {l.size}
                </p>
                {!l.available ? <p className="text-[0.75rem] text-danger">{t.product.unavailableCombo}</p> : null}
              </div>
              <p className="text-[0.85rem] tabular-nums">{formatPrice(l.lineTotal)}</p>
            </li>
          ) : null,
        )}
      </ul>
      <div className="mt-4 border-t border-line pt-5">
        <OrderTotals subtotal={subtotal} deliveryFee={deliveryFee} />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 pb-12 pt-8 md:px-8 md:pt-14">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-[2.1rem] md:text-[2.7rem]">{t.checkout.title}</h1>
        <Link href="/cart" className="pb-2 text-[0.8rem] underline underline-offset-4">
          تعديل الحقيبة
        </Link>
      </div>

      {/* Mobile collapsible summary */}
      <div className="mt-6 rounded-xl border border-line lg:hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((o) => !o)}
          aria-expanded={summaryOpen}
          className="flex w-full items-center justify-between px-5 py-4 text-[0.88rem]"
        >
          <span className="inline-flex items-center gap-2">
            {summaryOpen ? "إخفاء ملخّص الطلب" : "عرض ملخّص الطلب"}
            <ChevronDown className={cn("size-4 transition-transform duration-500", summaryOpen && "rotate-180")} strokeWidth={1.3} />
          </span>
          <span className="font-medium tabular-nums">{formatPrice(total)}</span>
        </button>
        {summaryOpen ? <div className="border-t border-line px-5 pb-5">{summary}</div> : null}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <form onSubmit={submit} noValidate className="lg:col-span-7">
          <Section title={t.checkout.contact} step="١">
            <Field id="name" label={t.checkout.name} error={touched.name ? errors.name : undefined}>
              {(p) => <input {...p} autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} />}
            </Field>
            <Field id="phone" label={t.checkout.phone} hint={t.checkout.phoneHint} error={touched.phone ? errors.phone : undefined}>
              {(p) => (
                <input
                  {...p}
                  type="tel"
                  dir="ltr"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="05XXXXXXXX"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  onBlur={() => {
                    const n = normalizeSaudiMobile(form.phone);
                    if (n) set("phone", `0${n.slice(4)}`);
                    blur("phone");
                  }}
                  className={cn(p.className, "text-right placeholder:text-right")}
                />
              )}
            </Field>
          </Section>

          <Section title={t.checkout.shipping} step="٢">
            <Field id="cityId" label={t.checkout.city} error={touched.cityId ? errors.cityId : undefined}>
              {(p) => (
                <div className="relative">
                  <select
                    {...p}
                    value={form.cityId}
                    onChange={(e) => set("cityId", e.target.value)}
                    onBlur={() => blur("cityId")}
                    className={cn(p.className, "appearance-none pe-10")}
                  >
                    <option value="" disabled>
                      {t.checkout.chooseCity}
                    </option>
                    {storeConfig.shipping.cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                    {storeConfig.shipping.allowOtherCity ? <option value="other">{t.checkout.otherCity}</option> : null}
                  </select>
                  <ChevronDown className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-taupe" strokeWidth={1.3} />
                </div>
              )}
            </Field>
            {form.cityId === "other" ? (
              <Field id="otherCity" label={t.checkout.otherCityName} error={touched.otherCity ? errors.otherCity : undefined}>
                {(p) => <input {...p} autoComplete="address-level2" value={form.otherCity} onChange={(e) => set("otherCity", e.target.value)} onBlur={() => blur("otherCity")} />}
              </Field>
            ) : null}
            <Field id="district" label={t.checkout.district} error={touched.district ? errors.district : undefined}>
              {(p) => <input {...p} autoComplete="address-level3" value={form.district} onChange={(e) => set("district", e.target.value)} onBlur={() => blur("district")} />}
            </Field>
            <Field id="address" label={t.checkout.address} hint={t.checkout.addressHint} error={touched.address ? errors.address : undefined}>
              {(p) => <textarea {...p} rows={2} autoComplete="street-address" value={form.address} onChange={(e) => set("address", e.target.value)} onBlur={() => blur("address")} className={cn(p.className, "h-auto py-3.5 leading-7")} />}
            </Field>
            <Field id="notes" label={t.checkout.notes}>
              {(p) => <textarea {...p} rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} className={cn(p.className, "h-auto py-3.5 leading-7")} />}
            </Field>
          </Section>

          {/* Honeypot (hidden from people and assistive tech) */}
          <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
            <label>
              Website
              <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <Section title="الدفع" step="٣">
            <div className="rounded-xl border border-line bg-ivory-2/60 p-5 text-[0.85rem] leading-7 text-muted">
              {storeConfig.payment.cashOnDelivery
                ? "الدفع عند الاستلام. سيتواصل فريقنا معكِ لتأكيد الطلب قبل الشحن."
                : "لا يتطلب تأكيد الطلب أي دفع الآن. سيتواصل فريقنا معكِ لتأكيد التوفر وموعد التوصيل وطريقة الدفع."}
            </div>
          </Section>

          {formError ? (
            <div role="alert" className="mt-6 rounded-xl border border-danger/30 bg-danger/5 p-4 text-[0.85rem] leading-7 text-danger">
              {formError}
              {fallbackWa ? (
                <a href={fallbackWa} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 font-medium underline underline-offset-4">
                  <WhatsAppIcon className="size-4" /> أرسلي الطلب عبر واتساب
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 lg:hidden">
            <OrderTotals subtotal={subtotal} deliveryFee={deliveryFee} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-ink text-[0.95rem] text-ivory transition duration-500 hover:bg-ink-2 active:scale-[0.99] disabled:opacity-70"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" strokeWidth={1.3} />}
            {submitting ? t.checkout.submitting : `${t.checkout.submit} · ${formatPrice(total)}`}
          </button>
          <p className="mt-4 text-center text-[0.75rem] leading-6 text-muted">
            {t.checkout.agree}{" "}
            <Link href="/terms" className="underline underline-offset-2">
              {t.checkout.terms}
            </Link>{" "}
            {t.checkout.and}
            <Link href="/privacy" className="underline underline-offset-2">
              {t.checkout.privacy}
            </Link>
            .
          </p>
        </form>

        <aside className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-28 rounded-xl bg-ivory-2 p-7">
            <h2 className="font-display text-xl">{t.checkout.summary}</h2>
            {summary}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, step, children }: { title: string; step: string; children: React.ReactNode }) {
  return (
    <fieldset className="mb-9">
      <legend className="mb-5 flex items-center gap-3 font-display text-[1.35rem]">
        <span className="grid size-7 place-items-center rounded-full border border-champagne/60 font-sans text-[0.75rem] text-champagne-deep">{step}</span>
        {title}
      </legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

type FieldProps = { id: string; name: string; className: string; "aria-invalid": boolean; "aria-describedby"?: string; required?: boolean };

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: (props: FieldProps) => React.ReactNode;
}) {
  const uid = useId();
  const describedBy = error ? `${uid}-e` : hint ? `${uid}-h` : undefined;
  return (
    <div>
      <label htmlFor={`f-${id}`} className="mb-2 block text-[0.82rem]">
        {label}
      </label>
      {children({
        id: `f-${id}`,
        name: id,
        "aria-invalid": !!error,
        "aria-describedby": describedBy,
        className: cn(
          "h-13 w-full rounded-xl border bg-white/60 px-4 text-[0.92rem] outline-none transition placeholder:text-taupe/60 focus:border-ink focus:bg-white",
          error ? "border-danger/60" : "border-line",
        ),
      } as FieldProps & { id: string })}
      {hint && !error ? (
        <p id={`${uid}-h`} className="mt-1.5 text-[0.74rem] text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${uid}-e`} className="mt-1.5 text-[0.76rem] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
