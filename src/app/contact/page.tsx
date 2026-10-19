import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { WhatsAppIcon } from "@/components/layout/WhatsAppFloat";
import { siteConfig, whatsappEnabled } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: "تواصلي مع فريق خدمة العملاء للاستفسار عن المنتجات والمقاسات والطلبات.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { contact } = siteConfig;
  const channels = [
    whatsappEnabled && {
      icon: <WhatsAppIcon className="size-5 text-[#1f7a4d]" />,
      title: "واتساب",
      value: "الطريقة الأسرع للتواصل معنا",
      href: whatsappLink("مرحباً، لدي استفسار"),
      cta: "ابدئي المحادثة",
    },
    contact.phone && {
      icon: <Phone className="size-5 text-champagne-deep" strokeWidth={1.2} />,
      title: "الهاتف",
      value: <span dir="ltr">{contact.phone}</span>,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
      cta: "اتصلي بنا",
    },
    contact.email && {
      icon: <Mail className="size-5 text-champagne-deep" strokeWidth={1.2} />,
      title: "البريد الإلكتروني",
      value: contact.email,
      href: `mailto:${contact.email}`,
      cta: "راسلينا",
    },
  ].filter(Boolean) as { icon: React.ReactNode; title: string; value: React.ReactNode; href: string; cta: string }[];

  return (
    <div className="mx-auto max-w-4xl px-5 md:px-8">
      <PageHeader eyebrow="نسعد بخدمتكِ" title="اتصل بنا" description="لأي استفسار عن المنتجات أو المقاسات أو طلبكِ، فريقنا جاهز لمساعدتكِ." />

      {channels.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-3">
          {channels.map((c) => (
            <li key={c.title}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-xl border border-line p-7 transition duration-500 hover:border-ink"
              >
                {c.icon}
                <h2 className="mt-5 font-display text-xl">{c.title}</h2>
                <p className="mt-1.5 break-words text-[0.86rem] text-muted">{c.value}</p>
                <span className="mt-6 text-[0.8rem] underline underline-offset-4">{c.cta}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl bg-beige p-6 text-center text-[0.9rem] text-muted">ستتوفر قنوات التواصل هنا قريباً.</p>
      )}

      {contact.hours || contact.location ? (
        <dl className="mt-10 grid gap-4 md:grid-cols-2">
          {contact.hours ? (
            <div className="flex items-start gap-3 rounded-xl bg-ivory-2 p-6">
              <Clock className="mt-0.5 size-5 text-champagne-deep" strokeWidth={1.2} />
              <div>
                <dt className="text-[0.85rem] font-medium">أوقات العمل</dt>
                <dd className="mt-1 text-[0.85rem] text-muted">{contact.hours}</dd>
              </div>
            </div>
          ) : null}
          {contact.location ? (
            <div className="flex items-start gap-3 rounded-xl bg-ivory-2 p-6">
              <MapPin className="mt-0.5 size-5 text-champagne-deep" strokeWidth={1.2} />
              <div>
                <dt className="text-[0.85rem] font-medium">الموقع</dt>
                <dd className="mt-1 text-[0.85rem] text-muted">{contact.location}</dd>
              </div>
            </div>
          ) : null}
        </dl>
      ) : null}
    </div>
  );
}
