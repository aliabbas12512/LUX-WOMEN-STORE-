"use client";

import Link from "next/link";
import { Heart, MessageCircle, Package } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useLocalOrders } from "@/lib/orders-local";
import { useFavorites } from "@/lib/favorites";
import { useHydrated } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { whatsappEnabled } from "@/config/site";

const dateFmt = new Intl.DateTimeFormat("ar-SA-u-nu-latn-ca-gregory", { day: "numeric", month: "long", year: "numeric" });

export function AccountView() {
  const orders = useLocalOrders();
  const favorites = useFavorites();
  const hydrated = useHydrated();

  return (
    <div className="mx-auto max-w-4xl px-5 pt-10 md:px-8 md:pt-16">
      <header className="text-center">
        <p className="eyebrow">مرحباً بكِ</p>
        <h1 className="mt-3 font-display text-[2.4rem] md:text-[3.2rem]">حسابي</h1>
        <p className="mx-auto mt-3 max-w-md text-[0.88rem] leading-7 text-muted">
          تُحفظ طلباتكِ ومفضّلتكِ على هذا الجهاز، دون الحاجة لإنشاء حساب أو كلمة مرور.
        </p>
      </header>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <Link href="/favorites" className="flex items-center justify-between rounded-xl border border-line p-5 transition hover:border-ink">
          <span className="flex items-center gap-3">
            <Heart className="size-5 text-champagne-deep" strokeWidth={1.2} /> المفضّلة
          </span>
          <span className="text-[0.85rem] text-muted tabular-nums">{hydrated ? favorites.length : ""}</span>
        </Link>
        {whatsappEnabled ? (
          <a
            href={whatsappLink("مرحباً، أرغب في الاستفسار عن طلبي")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-line p-5 transition hover:border-ink"
          >
            <MessageCircle className="size-5 text-champagne-deep" strokeWidth={1.2} /> الاستفسار عن طلب
          </a>
        ) : (
          <Link href="/contact" className="flex items-center gap-3 rounded-xl border border-line p-5 transition hover:border-ink">
            <MessageCircle className="size-5 text-champagne-deep" strokeWidth={1.2} /> تواصلي معنا
          </Link>
        )}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl">طلباتي</h2>
        {!hydrated ? (
          <div className="min-h-32" aria-busy="true" />
        ) : orders.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-14 text-center">
            <Package className="size-8 text-taupe" strokeWidth={1} />
            <p className="mt-4 text-[0.9rem]">لا توجد طلبات على هذا الجهاز بعد</p>
            <ButtonLink href="/collections/all" variant="outline" className="mt-6">
              ابدئي التسوّق
            </ButtonLink>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {orders.map((o) => (
              <li key={o.reference} className="rounded-xl border border-line p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium tabular-nums" dir="ltr">
                    {o.reference}
                  </p>
                  <p className="text-[0.78rem] text-muted">{dateFmt.format(new Date(o.createdAt))}</p>
                </div>
                <p className="mt-2 text-[0.82rem] text-muted">
                  {o.items.map((i) => `${i.name} × ${i.qty}`).join("، ")}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full bg-beige px-3 py-1 text-[0.72rem]">{o.stored ? "تم الاستلام — بانتظار التأكيد" : "طلب مُرسل عبر واتساب"}</span>
                  <span className="text-[0.9rem] tabular-nums">{formatPrice(o.total)}</span>
                </div>
                <Link href={`/checkout/success?ref=${encodeURIComponent(o.reference)}`} className="mt-3 inline-block text-[0.78rem] underline underline-offset-4">
                  عرض التفاصيل
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
