import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ProductArt } from "@/components/product/ProductArt";
import { siteConfig } from "@/config/site";

export function Hero() {
  const { hero } = siteConfig;

  return (
    <section aria-labelledby="hero-title" className="relative -mt-[65px] overflow-hidden bg-ink text-ivory md:-mt-[77px]">
      <div className="relative mx-auto flex max-w-7xl md:min-h-[min(100svh,940px)] flex-col md:grid md:grid-cols-12 md:items-center md:px-8">
        {/* Visual */}
        <div className="relative h-[60svh] min-h-[420px] w-full md:order-2 md:col-span-6 md:col-start-7 md:h-[min(86svh,820px)]">
          <div className="absolute inset-0 animate-slow-zoom">
            {hero.image ? (
              <Image src={hero.image} alt={hero.imageAlt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            ) : (
              <ProductArt garment="abaya" color="#121110" trim scene="night" className="size-full" />
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/60 to-transparent md:hidden" />
          <div className="absolute inset-y-0 start-0 hidden w-1/3 bg-gradient-to-l from-ink to-transparent md:block" />
        </div>

        {/* Copy */}
        <div className="relative z-10 -mt-28 px-6 pb-14 md:order-1 md:col-span-6 md:mt-0 md:px-0 md:pb-0 md:pe-10">
          <p className="eyebrow animate-fade-up text-champagne-soft! [animation-delay:150ms]">مجموعة الموسم الجديد</p>
          <h1
            id="hero-title"
            className="mt-4 animate-fade-up font-display text-[2.9rem] leading-[1.15] [animation-delay:300ms] md:text-[4.6rem] md:leading-[1.08]"
          >
            أناقتكِ تبدأ من هنا
          </h1>
          <div className="hairline mt-6 w-40 animate-fade-in opacity-70 [animation-delay:600ms] md:mt-8" />
          <p className="mt-5 max-w-md animate-fade-up text-[0.98rem] leading-8 text-ivory/75 [animation-delay:450ms] md:mt-7 md:text-[1.05rem]">
            عبايات وفساتين مختارة بعناية لتناسب ذوقكِ في كل مناسبة
          </p>
          <div className="mt-8 grid animate-fade-up gap-3 sm:flex sm:flex-wrap sm:items-center [animation-delay:600ms] md:mt-10">
            <ButtonLink href="/collections/all" variant="light" size="lg" className="min-w-44">
              اكتشفي المجموعة
              <ArrowLeft className="size-4 transition-transform duration-500 group-hover/btn:-translate-x-1" strokeWidth={1.4} />
            </ButtonLink>
            <ButtonLink
              href="/collections/abayas"
              variant="outline"
              size="lg"
              className="border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink"
            >
              تسوّقي العبايات
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
