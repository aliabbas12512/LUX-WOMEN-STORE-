import type { CollectionSlug, GarmentKind } from "@/lib/types";

export type CollectionInfo = {
  slug: CollectionSlug;
  title: string;
  eyebrow: string;
  description: string;
  /** Illustration used for the category tile until real campaign imagery is added. */
  art: { garment: GarmentKind; color: string; trim?: boolean };
  /** Optional authorised campaign photo for the tile/banner. */
  image?: string;
};

export const collections: CollectionInfo[] = [
  {
    slug: "abayas",
    title: "العبايات",
    eyebrow: "المجموعة الأساسية",
    description: "عبايات بقصّات مدروسة وخامات مختارة، من الكلاسيكية الهادئة إلى تصاميم المناسبات.",
    art: { garment: "abaya", color: "#141312", trim: true },
    image: "/products/abaya-black-floral-border-1.jpg",
  },
  {
    slug: "dresses",
    title: "الفساتين والكارديجان",
    eyebrow: "أناقة محتشمة",
    description: "قطع طويلة بأكمام وقصّات محتشمة تناسب العزائم والإطلالات اليومية الراقية.",
    art: { garment: "dress", color: "#9AA38D" },
    image: "/products/cardigan-black-ivory-lace-1.jpg",
  },
  {
    slug: "everyday",
    title: "الأزياء اليومية",
    eyebrow: "راحة بلمسة راقية",
    description: "قطع عملية ومريحة للبيت والزيارات والمشاوير، دون التنازل عن الأناقة.",
    art: { garment: "kaftan", color: "#CDB79A" },
    image: "/products/abaya-ivory-floral-print-1.jpg",
  },
  {
    slug: "occasion",
    title: "إطلالات المناسبات",
    eyebrow: "للأمسيات الخاصة",
    description: "عبايات وتصاميم مسائية بتفاصيل الدانتيل والتطريز للأعراس والحفلات والمناسبات.",
    art: { garment: "dress", color: "#5A1F2A", trim: true },
    image: "/products/abaya-lilac-floral-applique-1.jpg",
  },
  {
    slug: "new",
    title: "أحدث المنتجات",
    eyebrow: "وصل حديثاً",
    description: "آخر ما أُضيف إلى مجموعتنا.",
    art: { garment: "abaya", color: "#6E5646" },
    image: "/products/abaya-green-ombre-cardigan-1.jpg",
  },
  {
    slug: "offers",
    title: "العروض",
    eyebrow: "أسعار خاصة",
    description: "قطع مختارة بأسعار مخفّضة لفترة محدودة.",
    art: { garment: "dress", color: "#D8C3A0" },
    image: "/products/abaya-blush-jacquard-1.jpg",
  },
  {
    slug: "all",
    title: "جميع المنتجات",
    eyebrow: "المتجر",
    description: "تصفّحي المجموعة كاملة.",
    art: { garment: "abaya", color: "#1C2233" },
    image: "/products/abaya-navy-floral-embroidery-1.jpg",
  },
];

export const categoryCollections = collections.filter((c) =>
  ["abayas", "dresses", "everyday", "occasion"].includes(c.slug),
);

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}
