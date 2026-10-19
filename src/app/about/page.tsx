import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ProductArt } from "@/components/product/ProductArt";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "من نحن",
  description: `تعرّفي على ${siteConfig.brand.nameAr} — ${siteConfig.brand.taglineAr}.`,
  alternates: { canonical: "/about" },
};

// Brand story copy — edit freely. Avoid claims (years, awards, partnerships) you cannot substantiate.
const values = [
  { title: "اختيار بعناية", body: "ننتقي كل قطعة بالنظر إلى القصّة والخامة وطريقة انسدالها، لتجدي في مجموعتنا ما يليق بكِ دون عناء البحث." },
  { title: "احتشام بأناقة", body: "نؤمن أن الاحتشام والأناقة يجتمعان بسهولة، فنختار تصاميم مريحة وراقية تناسب يومكِ ومناسباتكِ." },
  { title: "خدمة شخصية", body: "نتواصل معكِ لتأكيد كل طلب، ونساعدكِ في اختيار المقاس والتنسيق قبل الشراء وبعده." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative -mt-px overflow-hidden bg-ink text-ivory">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div>
            <p className="eyebrow text-champagne-soft!">{siteConfig.brand.taglineAr}</p>
            <h1 className="mt-4 font-display text-[2.6rem] leading-[1.2] md:text-[3.8rem]">قصّتنا تبدأ من أناقتكِ</h1>
            <p className="mt-6 max-w-md text-[0.98rem] leading-8 text-ivory/70">
              {siteConfig.brand.nameAr} متجر سعودي للأزياء المحتشمة، يقدّم عبايات وفساتين مختارة بعناية للمرأة التي تبحث عن الأناقة الهادئة في كل تفصيلة.
            </p>
          </div>
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-xl">
            <ProductArt garment="abaya" color="#141312" trim scene="night" className="size-full" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-20 md:px-8 md:pt-28">
        <ul className="grid gap-10 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal as="li" key={v.title} delay={i * 100} className="border-t border-line pt-6">
              <span className="font-latin text-lg text-champagne-deep">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-3 font-display text-2xl">{v.title}</h2>
              <p className="mt-3 text-[0.9rem] leading-8 text-muted">{v.body}</p>
            </Reveal>
          ))}
        </ul>
        <div className="mt-16 text-center">
          <ButtonLink href="/collections/all" size="lg">
            اكتشفي المجموعة
            <ArrowLeft className="size-4" strokeWidth={1.4} />
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
