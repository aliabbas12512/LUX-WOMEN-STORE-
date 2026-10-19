"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { ButtonLink } from "@/components/ui/Button";
import { CartLineItem } from "@/components/checkout/CartLines";
import { useCart } from "@/lib/cart";
import { closeCart, useUi } from "@/lib/ui";
import { formatPrice } from "@/lib/format";
import { storeConfig } from "@/config/store";
import { t } from "@/i18n/ar";

export function CartDrawer() {
  const { cartOpen } = useUi();
  const { lines, subtotal, count } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    closeCart();
  }, [pathname]);

  const threshold = storeConfig.shipping.freeShippingThreshold;

  return (
    <Sheet
      open={cartOpen}
      onClose={closeCart}
      side="end"
      label={t.cart.title}
      title={
        <span>
          {t.cart.title}
          {count > 0 ? <span className="ms-2 font-sans text-[0.8rem] text-muted">({t.cart.items(count)})</span> : null}
        </span>
      }
    >
      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="grid size-20 place-items-center rounded-full border border-line">
            <ShoppingBag className="size-7 text-taupe" strokeWidth={1} />
          </div>
          <p className="mt-6 font-display text-2xl">{t.cart.empty}</p>
          <p className="mt-3 text-[0.88rem] leading-7 text-muted">{t.cart.emptyHint}</p>
          <ButtonLink href="/collections/all" className="mt-8" onClick={closeCart}>
            {t.cart.startShopping}
          </ButtonLink>
        </div>
      ) : (
        <>
          {threshold !== null ? (
            <div className="border-b border-line px-5 py-3 text-[0.78rem] text-muted md:px-7">
              {subtotal >= threshold
                ? "طلبكِ مؤهّل للتوصيل المجاني"
                : `أضيفي ${formatPrice(threshold - subtotal)} للحصول على توصيل مجاني`}
            </div>
          ) : null}
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5 md:px-7">
            {lines.map((line) => (
              <CartLineItem key={line.key} line={line} onNavigate={closeCart} compact />
            ))}
          </ul>
          <div className="border-t border-line bg-ivory-2/60 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 md:px-7">
            <div className="flex items-baseline justify-between">
              <span className="text-[0.88rem]">{t.cart.subtotal}</span>
              <span className="text-lg tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-[0.75rem] text-muted">رسوم التوصيل تُحتسب في الخطوة التالية حسب المدينة.</p>
            <div className="mt-4 grid gap-2.5">
              <ButtonLink href="/checkout" size="lg" className="w-full" onClick={closeCart}>
                {t.cart.checkout}
              </ButtonLink>
              <Link href="/cart" onClick={closeCart} className="py-2 text-center text-[0.82rem] underline underline-offset-4">
                {t.cart.viewCart}
              </Link>
            </div>
          </div>
        </>
      )}
    </Sheet>
  );
}
