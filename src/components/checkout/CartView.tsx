"use client";

import { ShoppingBag } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { CartLineItem } from "@/components/checkout/CartLines";
import { OrderTotals } from "@/components/checkout/OrderTotals";
import { useCart } from "@/lib/cart";
import { useHydrated } from "@/lib/store";
import { t } from "@/i18n/ar";

export function CartView() {
  const { lines, subtotal, count, hasUnavailable } = useCart();
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div className="mx-auto min-h-[50vh] max-w-6xl px-5 py-16" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-20 text-center">
        <div className="grid size-24 place-items-center rounded-full border border-line">
          <ShoppingBag className="size-8 text-taupe" strokeWidth={0.9} />
        </div>
        <h1 className="mt-8 font-display text-3xl">{t.cart.empty}</h1>
        <p className="mt-3 text-[0.9rem] leading-7 text-muted">{t.cart.emptyHint}</p>
        <ButtonLink href="/collections/all" size="lg" className="mt-9">
          {t.cart.startShopping}
        </ButtonLink>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 md:px-8 md:pt-16">
      <h1 className="font-display text-[2.2rem] md:text-[2.8rem]">{t.cart.title}</h1>
      <p className="mt-1 text-[0.85rem] text-muted">{t.cart.items(count)}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <ul className="divide-y divide-line border-y border-line lg:col-span-7">
          {lines.map((line) => (
            <CartLineItem key={line.key} line={line} />
          ))}
        </ul>

        <aside className="lg:col-span-5">
          <div className="rounded-xl bg-ivory-2 p-6 md:p-8 lg:sticky lg:top-28">
            <h2 className="mb-6 font-display text-xl">{t.checkout.summary}</h2>
            <OrderTotals subtotal={subtotal} deliveryFee={null} />
            {hasUnavailable ? (
              <p className="mt-4 text-[0.8rem] text-danger">بعض القطع لم تعد متاحة. يرجى إزالتها للمتابعة.</p>
            ) : null}
            <ButtonLink
              href="/checkout"
              size="lg"
              className="mt-6 w-full"
              aria-disabled={hasUnavailable || count === 0}
              tabIndex={hasUnavailable ? -1 : undefined}
              style={hasUnavailable ? { pointerEvents: "none", opacity: 0.45 } : undefined}
            >
              {t.cart.checkout}
            </ButtonLink>
            <ButtonLink href="/collections/all" variant="ghost" className="mt-2 w-full">
              {t.cart.continue}
            </ButtonLink>
          </div>
        </aside>
      </div>
    </div>
  );
}
