"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/layout/WhatsAppFloat";
import { useLocalOrders } from "@/lib/orders-local";
import { useHydrated } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { whatsappEnabled } from "@/config/site";

export function OrderSuccess() {
  const ref = useSearchParams().get("ref");
  const orders = useLocalOrders();
  const hydrated = useHydrated();
  const order = orders.find((o) => o.reference === ref);

  if (!hydrated) return <div className="min-h-[60vh]" aria-busy="true" />;

  if (!order) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="font-display text-3xl">لم نعثر على تفاصيل الطلب</h1>
        <p className="mt-3 text-[0.9rem] leading-7 text-muted">إن كنتِ قد أرسلتِ طلباً، فسيتواصل معكِ فريقنا قريباً. يمكنكِ مراجعة طلباتكِ من صفحة حسابي.</p>
        <div className="mt-8 flex gap-3">
          <ButtonLink href="/account">حسابي</ButtonLink>
          <ButtonLink href="/" variant="outline">
            الرئيسية
          </ButtonLink>
        </div>
      </section>
    );
  }

  const wa = whatsappEnabled ? whatsappLink(order.whatsappMessage) : null;

  return (
    <section className="mx-auto max-w-2xl px-5 pb-10 pt-12 md:pt-20">
      <div className="flex flex-col items-center text-center">
        <div className="grid size-18 animate-fade-in place-items-center rounded-full border border-champagne/50">
          <Check className="size-7 text-champagne-deep" strokeWidth={1.2} />
        </div>
        <p className="eyebrow mt-7">رقم الطلب {order.reference}</p>
        {order.stored ? (
          <>
            <h1 className="mt-3 font-display text-[2.2rem] leading-tight md:text-[2.8rem]">شكراً لكِ، {order.name.split(" ")[0]}</h1>
            <p className="mt-4 max-w-md text-[0.95rem] leading-8 text-muted">
              استلمنا طلبكِ بنجاح. سيتواصل معكِ فريقنا قريباً لتأكيد التفاصيل والتوفر وموعد التوصيل.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 font-display text-[2.2rem] leading-tight md:text-[2.8rem]">خطوة أخيرة لتأكيد طلبكِ</h1>
            <p className="mt-4 max-w-md text-[0.95rem] leading-8 text-muted">
              جهّزنا تفاصيل طلبكِ. أرسليها إلينا عبر واتساب ليقوم فريقنا بتأكيد التوفر وموعد التوصيل معكِ.
            </p>
          </>
        )}
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-[#1f7a4d] px-8 text-[0.92rem] text-white transition hover:brightness-110"
          >
            <WhatsAppIcon className="size-5" />
            {order.stored ? "تواصلي معنا بخصوص الطلب" : "أرسلي الطلب عبر واتساب"}
          </a>
        ) : !order.stored ? (
          <p className="mt-6 rounded-lg bg-beige px-4 py-3 text-[0.8rem] text-muted">
            لم يُفعَّل استقبال الطلبات بعد في هذا المتجر. يرجى التواصل معنا عبر صفحة اتصل بنا.
          </p>
        ) : null}
      </div>

      <div className="mt-12 rounded-xl bg-ivory-2 p-6 md:p-8">
        <h2 className="font-display text-xl">تفاصيل الطلب</h2>
        <ul className="mt-4 divide-y divide-line">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-4 py-3.5 text-[0.85rem]">
              <span>
                {order.items.length > 0 && i.slug ? (
                  <Link href={`/products/${i.slug}`} className="hover:underline">
                    {i.name}
                  </Link>
                ) : (
                  i.name
                )}
                <span className="block text-[0.76rem] text-muted">
                  {i.colorName} · مقاس {i.size} · الكمية {i.qty}
                </span>
              </span>
              <span className="tabular-nums">{formatPrice(i.unitPrice * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-2 border-t border-line pt-4 text-[0.85rem]">
          <div className="flex justify-between">
            <dt className="text-muted">المجموع الفرعي</dt>
            <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">التوصيل إلى {order.city}</dt>
            <dd className="tabular-nums">{order.deliveryFee === 0 ? "مجاني" : formatPrice(order.deliveryFee)}</dd>
          </div>
          <div className="flex justify-between pt-2 text-base font-medium">
            <dt>الإجمالي</dt>
            <dd className="tabular-nums">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 text-center">
        <ButtonLink href="/collections/all" variant="outline">
          متابعة التسوّق
        </ButtonLink>
      </div>
    </section>
  );
}
