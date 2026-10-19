"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { ProductMedia } from "@/components/product/ProductMedia";
import { cart, type ResolvedLine } from "@/lib/cart";
import { cn, formatPrice } from "@/lib/format";
import { storeConfig } from "@/config/store";
import { t } from "@/i18n/ar";

export function QuantityStepper({
  value,
  onChange,
  max = storeConfig.order.maxQuantityPerLine,
  size = "sm",
  label = t.product.quantity,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const h = size === "sm" ? "h-9" : "h-12";
  return (
    <div role="group" aria-label={label} className={cn("inline-flex items-center rounded-full border border-line", h)}>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className={cn("grid place-items-center rounded-full transition hover:bg-beige/60", size === "sm" ? "size-9" : "size-12")}
        aria-label="زيادة الكمية"
      >
        <Plus className="size-3.5" strokeWidth={1.4} />
      </button>
      <span className={cn("text-center tabular-nums", size === "sm" ? "w-7 text-[0.85rem]" : "w-9")} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className={cn("grid place-items-center rounded-full transition hover:bg-beige/60", size === "sm" ? "size-9" : "size-12")}
        aria-label="إنقاص الكمية"
      >
        <Minus className="size-3.5" strokeWidth={1.4} />
      </button>
    </div>
  );
}

export function CartLineItem({ line, onNavigate, compact = false }: { line: ResolvedLine; onNavigate?: () => void; compact?: boolean }) {
  const { product } = line;
  if (!product) {
    return (
      <li className="flex items-center justify-between gap-4 py-5 text-[0.85rem] text-muted">
        {t.cart.unavailable}
        <button type="button" onClick={() => cart.remove(line)} className="underline underline-offset-4">
          {t.cart.remove}
        </button>
      </li>
    );
  }
  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/products/${product.slug}`}
        onClick={onNavigate}
        className={cn("relative shrink-0 overflow-hidden rounded-lg bg-beige", compact ? "h-[7.5rem] w-[5.6rem]" : "h-36 w-27 md:h-44 md:w-33")}
      >
        <ProductMedia product={product} colorId={line.color} sizes="140px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/products/${product.slug}`} onClick={onNavigate} className="block text-[0.92rem] leading-6 hover:underline hover:underline-offset-4">
              {product.name}
            </Link>
            <p className="mt-1 text-[0.78rem] text-muted">
              {line.colorInfo?.name} · مقاس {line.size}
            </p>
          </div>
          <button
            type="button"
            onClick={() => cart.remove(line)}
            className="-me-2 -mt-1.5 grid size-9 shrink-0 place-items-center rounded-full text-taupe transition hover:bg-beige/60 hover:text-ink"
            aria-label={`${t.cart.remove} ${product.name}`}
          >
            <X className="size-4" strokeWidth={1.3} />
          </button>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          {line.available ? (
            <QuantityStepper value={line.qty} onChange={(v) => cart.setQty(line, v)} />
          ) : (
            <p className="text-[0.78rem] text-danger">{t.product.unavailableCombo}</p>
          )}
          <p className="text-[0.9rem] tabular-nums">{line.available ? formatPrice(line.lineTotal) : ""}</p>
        </div>
      </div>
    </li>
  );
}
