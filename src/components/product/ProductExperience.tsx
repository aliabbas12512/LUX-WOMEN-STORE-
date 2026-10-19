"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Ruler, ShoppingBag, Truck, RefreshCcw, Info } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { HowToMeasure, SizeTable } from "@/components/product/SizeGuideTables";
import { QuantityStepper } from "@/components/checkout/CartLines";
import { WhatsAppIcon } from "@/components/layout/WhatsAppFloat";
import { Sheet } from "@/components/ui/Sheet";
import { Price } from "@/components/ui/Price";
import { colorAvailable, isVariantAvailable, stockState, variantStock } from "@/lib/catalog";
import { cart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { openCart } from "@/lib/ui";
import { cn, formatPrice } from "@/lib/format";
import { productEnquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { whatsappEnabled } from "@/config/site";
import { t } from "@/i18n/ar";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  deliveryText: string;
  deliveryFeeText: string;
  returnsText: string;
  breadcrumb: React.ReactNode;
};

export function ProductExperience({ product, deliveryText, deliveryFeeText, returnsText, breadcrumb }: Props) {
  const firstAvailable = product.colors.find((c) => colorAvailable(product, c.id)) ?? product.colors[0];
  const [colorId, setColorId] = useState(firstAvailable?.id ?? "");
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? (product.sizes[0] ?? null) : null);
  const [qtyRaw, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sizesRef = useRef<HTMLFieldSetElement>(null);

  const color = product.colors.find((c) => c.id === colorId);
  const state = stockState(product);
  const soldOut = state === "out_of_stock";
  const selectedStock = size ? variantStock(product, colorId, size) : undefined;
  const selectionAvailable = size ? isVariantAvailable(product, colorId, size) : true;
  const maxQty = typeof selectedStock === "number" ? Math.max(1, Math.min(10, selectedStock)) : 10;
  const qty = Math.min(qtyRaw, maxQty);

  useEffect(() => {
    track("VIEW_CONTENT", { item_ids: [product.id], item_category: product.category, price: product.price, currency: "SAR" });
  }, [product]);

  // Sticky purchase bar appears once the main button scrolls out of view (mobile).
  useEffect(() => {
    const el = ctaRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!!e && !e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);


  function addToCart() {
    if (!size) {
      setSizeError(true);
      sizesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!isVariantAvailable(product, colorId, size)) return;
    cart.add({ productId: product.id, color: colorId, size, qty });
    track("ADD_CART", { item_ids: [product.id], item_category: product.category, price: product.price * qty, currency: "SAR", number_items: qty });
    openCart();
  }

  const waHref = whatsappEnabled
    ? whatsappLink(
        productEnquiryMessage({ name: product.name, slug: product.slug, price: product.price, colorName: color?.name, size: size ?? undefined, qty }),
      )
    : null;

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-14 lg:px-8 lg:pt-8">
      <div className="lg:col-span-7">
        <ProductGallery product={product} colorId={colorId} />
      </div>

      <div className="px-5 pt-7 lg:col-span-5 lg:px-0 lg:pt-2">
        <div className="lg:sticky lg:top-28">
          {breadcrumb}

          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-[2rem] leading-[1.3] md:text-[2.5rem]">{product.name}</h1>
              {product.subtitle ? <p className="mt-1.5 text-[0.88rem] text-muted">{product.subtitle}</p> : null}
            </div>
            <FavoriteButton product={product} variant="outline" className="mt-1 shrink-0" />
          </div>

          <Price price={product.price} compareAt={product.compareAtPrice} size="lg" className="mt-5" />
          <p className="mt-1 text-[0.75rem] text-muted">السعر بالريال السعودي</p>

          {product.sample ? (
            <p className="mt-5 flex items-start gap-2 rounded-lg bg-beige/70 px-4 py-3 text-[0.78rem] leading-6 text-muted">
              <Info className="mt-1 size-3.5 shrink-0" strokeWidth={1.5} />
              {t.common.sampleProduct} — الصور توضيحية، والسعر والتوفر بيانات تجريبية.
            </p>
          ) : null}

          <div className="hairline my-7" />

          {/* Colour */}
          <fieldset>
            <legend className="text-[0.85rem]">
              {t.product.color}: <span className="text-muted">{color?.name}</span>
            </legend>
            <div className="mt-3.5 flex flex-wrap gap-3">
              {product.colors.map((c) => {
                const available = colorAvailable(product, c.id);
                const selected = c.id === colorId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColorId(c.id)}
                    aria-pressed={selected}
                    aria-label={`${c.name}${available ? "" : ` — ${t.product.soldOut}`}`}
                    title={c.name}
                    className={cn(
                      "relative grid size-11 place-items-center rounded-full border transition duration-300",
                      selected ? "border-ink" : "border-transparent hover:border-line",
                    )}
                  >
                    <span className="size-8 rounded-full ring-1 ring-ink/10" style={{ backgroundColor: c.hex }} />
                    {!available ? <span className="absolute h-px w-9 -rotate-45 bg-ink/60" aria-hidden /> : null}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Size */}
          <fieldset ref={sizesRef} className="mt-7">
            <div className="flex items-center justify-between">
              <legend className="text-[0.85rem]">
                {t.product.size}
                {size ? <span className="text-muted">: {size}</span> : null}
              </legend>
              <button type="button" onClick={() => setGuideOpen(true)} className="inline-flex items-center gap-1.5 text-[0.78rem] underline underline-offset-4">
                <Ruler className="size-3.5" strokeWidth={1.3} />
                {t.product.sizeGuide}
              </button>
            </div>
            <div className="mt-3.5 grid grid-cols-5 gap-2">
              {product.sizes.map((s) => {
                const available = isVariantAvailable(product, colorId, s);
                const selected = s === size;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={!available}
                    onClick={() => {
                      setSize(s);
                      setSizeError(false);
                    }}
                    aria-pressed={selected}
                    aria-label={`${t.product.size} ${s}${available ? "" : ` — ${t.product.soldOut}`}`}
                    className={cn(
                      "relative h-12 rounded-lg border text-[0.88rem] tabular-nums transition duration-300 disabled:cursor-not-allowed",
                      selected ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink",
                      !available && "text-taupe/60 line-through decoration-1 hover:border-line",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <p aria-live="polite" className="mt-2.5 min-h-5 text-[0.78rem]">
              {sizeError ? (
                <span className="text-danger">{t.product.chooseSizeFirst}</span>
              ) : size && !selectionAvailable ? (
                <span className="text-danger">{t.product.unavailableCombo}</span>
              ) : size && selectedStock === null ? (
                <span className="text-muted">{t.product.stock.on_request}</span>
              ) : typeof selectedStock === "number" && selectedStock > 0 && selectedStock <= 3 ? (
                <span className="text-champagne-deep">متبقٍّ {selectedStock} {selectedStock === 1 ? "قطعة" : selectedStock === 2 ? "قطعتان" : "قطع"} فقط</span>
              ) : null}
            </p>
          </fieldset>

          {/* Quantity + CTA */}
          <div ref={ctaRef} className="mt-5">
            {soldOut ? (
              <div className="rounded-xl border border-line p-5 text-center">
                <p className="font-display text-lg">{t.product.soldOut}</p>
                <p className="mt-1 text-[0.8rem] text-muted">تواصلي معنا لنخبركِ عند توفرها من جديد.</p>
              </div>
            ) : (
              <div className="flex gap-3">
                <QuantityStepper value={qty} onChange={setQty} max={maxQty} size="md" />
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={!!size && !selectionAvailable}
                  className="group/btn inline-flex h-12 flex-1 items-center justify-center gap-2.5 rounded-full bg-ink text-[0.92rem] text-ivory transition duration-500 hover:bg-ink-2 hover:shadow-[0_14px_30px_-16px_rgb(15_14_12/0.6)] active:scale-[0.985] disabled:opacity-45"
                >
                  <ShoppingBag className="size-[18px]" strokeWidth={1.3} />
                  {t.product.addToCart}
                </button>
              </div>
            )}
            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex h-12 items-center justify-center gap-2.5 rounded-full border border-ink/20 text-[0.88rem] transition duration-500 hover:border-ink"
              >
                <WhatsAppIcon className="size-[18px] text-[#1f7a4d]" />
                {t.product.orderWhatsapp}
              </a>
            ) : null}
          </div>

          <ul className="mt-6 space-y-2.5 text-[0.8rem] text-muted">
            <li className="flex items-start gap-2.5">
              <Truck className="mt-0.5 size-4 shrink-0 text-champagne-deep" strokeWidth={1.2} />
              <span>
                {deliveryText} <span className="text-ink/70">{deliveryFeeText}</span>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <RefreshCcw className="mt-0.5 size-4 shrink-0 text-champagne-deep" strokeWidth={1.2} />
              <span>{returnsText}</span>
            </li>
          </ul>

          {/* Details */}
          <div className="mt-8 border-t border-line">
            <Accordion title={t.product.description} defaultOpen>
              <p className="leading-8">{product.description}</p>
            </Accordion>
            {product.details ? (
              <Accordion title={t.product.fabricCare}>
                <dl className="space-y-3">
                  {product.details.fabric ? (
                    <div>
                      <dt className="text-ink">الخامة</dt>
                      <dd>{product.details.fabric}</dd>
                    </div>
                  ) : null}
                  {product.details.length ? (
                    <div>
                      <dt className="text-ink">الطول</dt>
                      <dd>{product.details.length}</dd>
                    </div>
                  ) : null}
                  {product.details.fit ? (
                    <div>
                      <dt className="text-ink">القصّة</dt>
                      <dd>{product.details.fit}</dd>
                    </div>
                  ) : null}
                  {product.details.care?.length ? (
                    <div>
                      <dt className="text-ink">العناية</dt>
                      <dd>
                        <ul className="list-inside list-disc space-y-1 marker:text-champagne">
                          {product.details.care.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ) : null}
                  {product.details.notes?.map((n) => <p key={n}>{n}</p>)}
                </dl>
              </Accordion>
            ) : null}
            <Accordion title={t.product.delivery}>
              <p>
                {deliveryText} {deliveryFeeText}
              </p>
              <Link href="/shipping" className="mt-2 inline-block text-ink underline underline-offset-4">
                سياسة الشحن والتوصيل
              </Link>
            </Accordion>
            <Accordion title={t.product.returns}>
              <p>{returnsText}</p>
              <Link href="/returns" className="mt-2 inline-block text-ink underline underline-offset-4">
                سياسة الاستبدال والاسترجاع
              </Link>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Sticky mobile purchase bar */}
      {!soldOut ? (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-500 ease-[var(--ease-lux)] lg:hidden",
            showBar ? "translate-y-0" : "translate-y-full",
          )}
          aria-hidden={!showBar}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.8rem]">{product.name}</p>
              <p className="text-[0.85rem] font-medium tabular-nums">
                {formatPrice(product.price)}
                {size ? <span className="ms-2 text-[0.75rem] font-normal text-muted">مقاس {size}</span> : null}
              </p>
            </div>
            <button
              type="button"
              tabIndex={showBar ? 0 : -1}
              onClick={addToCart}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[0.86rem] text-ivory"
            >
              <ShoppingBag className="size-4" strokeWidth={1.3} />
              {size ? t.product.addToCart : t.product.selectSize}
            </button>
          </div>
        </div>
      ) : null}

      <Sheet open={guideOpen} onClose={() => setGuideOpen(false)} side="end" label={t.product.sizeGuide} title={t.product.sizeGuide}>
        <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6 md:px-7">
          <SizeTable kind={product.sizeChart} />
          <HowToMeasure />
          <p className="text-[0.78rem] leading-6 text-muted">
            لم تجدي مقاسكِ؟ تواصلي معنا وسنساعدكِ في الاختيار.
          </p>
        </div>
      </Sheet>
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group border-b border-line" open={defaultOpen}>
      <summary className="flex items-center justify-between py-5 text-[0.9rem]">
        {title}
        <ChevronDown className="size-4 text-taupe transition-transform duration-500 group-open:rotate-180" strokeWidth={1.3} />
      </summary>
      <div className="pb-6 text-[0.86rem] leading-7 text-muted">{children}</div>
    </details>
  );
}
