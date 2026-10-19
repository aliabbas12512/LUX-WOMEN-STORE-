import type { Product } from "@/lib/types";

/** Normalises Arabic text so searches ignore diacritics and common spelling variants. */
export function normalizeArabic(input: string) {
  return input
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, "") // tashkeel + tatweel
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, " ")
    .trim();
}

const categoryWords: Record<Product["category"], string> = {
  abayas: "عبايه عبايات عباية",
  dresses: "فستان فساتين",
  everyday: "يومي يوميه قفطان طقم",
  occasion: "مناسبات سهره حفلات فستان",
};

export function searchProducts(products: Product[], query: string) {
  const terms = normalizeArabic(query).split(" ").filter(Boolean);
  if (terms.length === 0) return [];
  return products.filter((p) => {
    const haystack = normalizeArabic(
      [p.name, p.subtitle ?? "", p.description, categoryWords[p.category], ...p.colors.map((c) => c.name)].join(" "),
    );
    return terms.every((t) => haystack.includes(t));
  });
}
