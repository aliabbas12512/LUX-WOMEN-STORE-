/**
 * Brand & public business details.
 *
 * Everything customer-facing that describes the business lives here so it can be
 * edited in one place. Leave a value empty rather than inventing it — empty
 * values are simply not rendered.
 */

const env = (value: string | undefined) => (value ?? "").trim();

/** Store WhatsApp Business number (0508202459). NEXT_PUBLIC_WHATSAPP_NUMBER overrides it. */
const DEFAULT_WHATSAPP = "966508202459";

export const siteConfig = {
  locale: "ar-SA",
  dir: "rtl" as const,

  brand: {
    nameAr: "لُكس",
    nameEn: "LUX",
    taglineAr: "دار الأزياء المحتشمة",
    descriptionAr:
      "عبايات وفساتين مختارة بعناية للمرأة السعودية — تصاميم راقية لكل يوم ولكل مناسبة.",
  },

  url: env(process.env.NEXT_PUBLIC_SITE_URL).replace(/\/$/, "") || "http://localhost:3000",

  contact: {
    /** Digits only, international format without "+", e.g. 9665XXXXXXXX. */
    whatsapp: (env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) || DEFAULT_WHATSAPP).replace(/\D/g, ""),
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    /** Customer-service hours as you want them displayed, e.g. "يومياً من ١٠ صباحاً حتى ١٠ مساءً". */
    hours: "",
    /** City / area shown on the contact page. Leave empty if you do not publish an address. */
    location: "",
  },

  social: {
    instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    snapchat: env(process.env.NEXT_PUBLIC_SNAPCHAT_URL),
    tiktok: env(process.env.NEXT_PUBLIC_TIKTOK_URL),
  },

  /**
   * Legal entity details. Only fill these with real, registered information
   * (e.g. commercial registration / Maroof / VAT number). Empty = hidden.
   */
  legal: {
    entityName: "",
    commercialRegistration: "",
    vatNumber: "",
  },

  /**
   * Optional real campaign photo for the homepage hero (authorised imagery only).
   * When empty, the hero renders the brand's illustrated composition.
   */
  hero: {
    image: "/products/abaya-black-pearl-trim-hooded-1.jpg" as string,
    imageAlt: "عباية سوداء بغطاء رأس وحواف لؤلؤية",
  },

  /** Short rotating messages in the announcement bar. Keep them truthful. */
  announcements: ["اطلبي بسهولة عبر واتساب", "مجموعة الموسم الجديدة متاحة الآن"] as string[],
} as const;

export const whatsappEnabled = siteConfig.contact.whatsapp.length >= 10;

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
