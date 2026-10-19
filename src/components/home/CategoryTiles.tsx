import Link from "next/link";
import Image from "next/image";
import { ProductArt } from "@/components/product/ProductArt";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categoryCollections } from "@/data/collections";
import { getProductsForCollection } from "@/lib/catalog";
import { t } from "@/i18n/ar";

export function CategoryTiles() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-20 md:px-8 md:pt-28" aria-labelledby="cats-title">
      <SectionHeading eyebrow="تسوّقي حسب التصنيف" title="لكل لحظة إطلالتها" align="center" />
      <ul className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-4 md:gap-5" id="cats-title">
        {categoryCollections.map((c, i) => {
          const count = getProductsForCollection(c.slug).length;
          return (
            <Reveal as="li" key={c.slug} delay={i * 90}>
              <Link href={`/collections/${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-beige md:aspect-[3/4.4]">
                {c.image ? (
                  <Image src={c.image} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-105" />
                ) : (
                  <ProductArt
                    garment={c.art.garment}
                    color={c.art.color}
                    trim={c.art.trim}
                    className="size-full transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-ivory md:p-6">
                  <h3 className="font-display text-[1.35rem] leading-tight md:text-[1.7rem]">{c.title}</h3>
                  <p className="mt-1 text-[0.72rem] text-ivory/75 md:text-[0.78rem]">
                    {count > 0 ? t.cart.items(count) : "قريباً"}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
