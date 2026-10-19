import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { WhatsAppIcon } from "@/components/layout/WhatsAppFloat";
import { infoNav, legalNav, mainNav } from "@/components/layout/nav";
import { siteConfig, whatsappEnabled } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";

function SocialIcon({ name }: { name: "instagram" | "snapchat" | "tiktok" }) {
  const paths: Record<typeof name, string> = {
    instagram:
      "M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.8a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm4.9-8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3.6c2.7 0 3 0 4.1.1 2.7.1 4 1.4 4.1 4.1.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.7-1.4 4-4.1 4.1-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.7-.1-4-1.4-4.1-4.1C3.7 15 3.6 14.7 3.6 12s0-3 .1-4.1c.1-2.7 1.4-4 4.1-4.1 1.1-.1 1.4-.2 4.2-.2ZM12 2c-2.7 0-3.1 0-4.1.1C4.2 2.2 2.2 4.2 2.1 7.9 2 8.9 2 9.3 2 12s0 3.1.1 4.1c.2 3.7 2.2 5.7 5.8 5.8 1 .1 1.4.1 4.1.1s3.1 0 4.1-.1c3.6-.2 5.7-2.2 5.8-5.8.1-1 .1-1.4.1-4.1s0-3.1-.1-4.1c-.2-3.6-2.2-5.7-5.8-5.8C15.1 2 14.7 2 12 2Z",
    snapchat:
      "M12.1 2.5c2.3 0 4.4 1.3 5.3 3.4.4.9.3 2.4.2 3.6v.4c.1.1.3.1.6.1.4 0 .9-.2 1.2-.2.3 0 .7.1.8.4.1.4-.3.7-1.2 1-.4.1-.9.3-1 .5-.1.3 0 .6.3 1.1.7 1.3 2 2.8 3.9 3.1.2 0 .3.2.3.4 0 .5-1 .9-2.6 1.1-.2.2-.2 1-.5 1.2-.3.1-1.1-.2-2.2-.2-1.5 0-2 1.5-4.9 1.5s-3.4-1.5-4.9-1.5c-1.1 0-1.9.4-2.2.2-.3-.2-.3-1-.5-1.2-1.6-.2-2.6-.6-2.6-1.1 0-.2.1-.4.3-.4 1.9-.3 3.2-1.8 3.9-3.1.3-.5.4-.8.3-1.1-.1-.2-.6-.4-1-.5-.9-.3-1.3-.6-1.2-1 .1-.3.5-.4.8-.4.3 0 .8.2 1.2.2.3 0 .5 0 .6-.1v-.4c-.1-1.2-.2-2.7.2-3.6.9-2.1 3-3.4 5.3-3.4h.4Z",
    tiktok:
      "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z",
  };
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}

const socialLabels = { instagram: "إنستغرام", snapchat: "سناب شات", tiktok: "تيك توك" } as const;

export function Footer() {
  const { contact, social, legal, brand } = siteConfig;
  const socials = (Object.keys(social) as (keyof typeof social)[]).filter((k) => social[k]);

  return (
    <footer className="mt-24 bg-ink text-ivory md:mt-32">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8 md:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <Wordmark tone="light" className="items-start" />
            <p className="mt-6 max-w-sm text-[0.88rem] leading-7 text-ivory/65">{brand.descriptionAr}</p>
            {socials.length > 0 ? (
              <ul className="mt-7 flex gap-2.5">
                {socials.map((key) => (
                  <li key={key}>
                    <a
                      href={social[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={socialLabels[key]}
                      className="grid size-10 place-items-center rounded-full border border-ivory/15 text-ivory/80 transition hover:border-champagne-soft hover:text-champagne-soft"
                    >
                      <SocialIcon name={key} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label="المتجر" className="md:col-span-2">
            <h2 className="text-[0.78rem] tracking-wide text-champagne-soft">المتجر</h2>
            <ul className="mt-5 space-y-3 text-[0.86rem] text-ivory/75">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="خدمة العملاء" className="md:col-span-3">
            <h2 className="text-[0.78rem] tracking-wide text-champagne-soft">خدمة العملاء</h2>
            <ul className="mt-5 space-y-3 text-[0.86rem] text-ivory/75">
              {[...infoNav, ...legalNav].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-3">
            <h2 className="text-[0.78rem] tracking-wide text-champagne-soft">تواصلي معنا</h2>
            <ul className="mt-5 space-y-3.5 text-[0.86rem] text-ivory/75">
              {whatsappEnabled ? (
                <li>
                  <a href={whatsappLink("مرحباً، لدي استفسار")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-ivory">
                    <WhatsAppIcon className="size-4" /> واتساب
                  </a>
                </li>
              ) : null}
              {contact.phone ? (
                <li>
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2.5 hover:text-ivory">
                    <Phone className="size-4" strokeWidth={1.3} /> <span dir="ltr">{contact.phone}</span>
                  </a>
                </li>
              ) : null}
              {contact.email ? (
                <li>
                  <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2.5 hover:text-ivory">
                    <Mail className="size-4" strokeWidth={1.3} /> {contact.email}
                  </a>
                </li>
              ) : null}
              {contact.hours ? <li className="text-ivory/60">{contact.hours}</li> : null}
              <li>
                <Link href="/contact" className="border-b border-ivory/25 pb-0.5 transition hover:border-ivory">
                  صفحة التواصل
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-14 opacity-30" />
        <div className="mt-6 flex flex-col gap-3 text-[0.75rem] text-ivory/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {legal.entityName || `${brand.nameAr} ${brand.nameEn}`}. جميع الحقوق محفوظة.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            {legal.commercialRegistration ? <span>السجل التجاري: {legal.commercialRegistration}</span> : null}
            {legal.vatNumber ? <span>الرقم الضريبي: {legal.vatNumber}</span> : null}
            <span>الأسعار بالريال السعودي</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
