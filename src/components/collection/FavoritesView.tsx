"use client";

import { Heart } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { getProductById } from "@/lib/catalog";
import { useFavorites } from "@/lib/favorites";
import { useHydrated } from "@/lib/store";
import { t } from "@/i18n/ar";

export function FavoritesView() {
  const ids = useFavorites();
  const hydrated = useHydrated();
  const products = ids.map(getProductById).filter((p) => p !== undefined);

  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-16">
      <header className="text-center">
        <p className="eyebrow">قائمتكِ الخاصة</p>
        <h1 className="mt-3 font-display text-[2.4rem] md:text-[3.2rem]">{t.nav.favorites}</h1>
      </header>
      {!hydrated ? (
        <div className="min-h-[40vh]" aria-busy="true" />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="grid size-20 place-items-center rounded-full border border-line">
            <Heart className="size-7 text-taupe" strokeWidth={1} />
          </div>
          <p className="mt-6 font-display text-2xl">لم تضيفي أي قطعة بعد</p>
          <p className="mt-3 max-w-sm text-[0.88rem] leading-7 text-muted">اضغطي على رمز القلب في أي منتج لحفظه هنا والعودة إليه لاحقاً.</p>
          <ButtonLink href="/collections/all" className="mt-8">
            {t.cart.startShopping}
          </ButtonLink>
        </div>
      ) : (
        <ul className="mt-12 grid grid-cols-2 gap-x-3.5 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
          {products.map((p) => (
            <li key={p.id} className="animate-fade-up">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
