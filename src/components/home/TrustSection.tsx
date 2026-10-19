import { MessageCircle, PackageCheck, RefreshCcw, Truck } from "lucide-react";
import Link from "next/link";
import { storeConfig } from "@/config/store";
import { whatsappEnabled } from "@/config/site";
import { formatNumber } from "@/lib/format";

/** Service promises — every line is derived from configured store settings. */
export function TrustSection() {
  const { shipping, returns } = storeConfig;
  const items = [
    {
      icon: Truck,
      title: "التوصيل داخل المملكة",
      body:
        shipping.estimateDays !== null
          ? `إلى ${formatNumber(shipping.cities.length)} مدينة خلال ${shipping.estimateDays.min}–${shipping.estimateDays.max} أيام عمل من تأكيد الطلب.`
          : `نوصل إلى ${formatNumber(shipping.cities.length)} مدينة، ونؤكد موعد التوصيل معكِ عند تأكيد الطلب.`,
      href: "/shipping",
    },
    {
      icon: RefreshCcw,
      title: "استبدال واسترجاع",
      body: `خلال ${formatNumber(returns.windowDays)} أيام من الاستلام وفق شروط سياسة الاستبدال والاسترجاع.`,
      href: "/returns",
    },
    {
      icon: PackageCheck,
      title: "تأكيد قبل الشحن",
      body: "نراجع كل طلب ونتواصل معكِ لتأكيد المقاس واللون والتوفر قبل الشحن.",
      href: "/shipping",
    },
    ...(whatsappEnabled
      ? [{ icon: MessageCircle, title: "خدمة شخصية عبر واتساب", body: "فريقنا يساعدكِ في اختيار المقاس والتنسيق قبل الطلب وبعده.", href: "/contact" }]
      : []),
  ];

  return (
    <section aria-labelledby="trust-title" className="mx-auto mt-20 max-w-7xl px-5 md:mt-28 md:px-8">
      <h2 id="trust-title" className="sr-only">خدماتنا</h2>
      <ul className={`grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {items.map(({ icon: Icon, title, body, href }) => (
          <li key={title} className="bg-ivory last:odd:col-span-2 lg:last:odd:col-span-1">
            <Link href={href} className="group flex h-full flex-col p-5 transition-colors duration-500 hover:bg-ivory-2 md:p-8">
              <Icon className="size-5 text-champagne-deep md:size-6" strokeWidth={1} />
              <h3 className="mt-4 font-display text-[1.08rem] leading-snug md:mt-5 md:text-[1.25rem]">{title}</h3>
              <p className="mt-2 text-[0.78rem] leading-6 text-muted md:text-[0.85rem] md:leading-7">{body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
