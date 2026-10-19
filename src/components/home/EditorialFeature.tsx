import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ProductArt } from "@/components/product/ProductArt";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/format";
import type { GarmentKind, Product } from "@/lib/types";

/** Asymmetric editorial block: a tall campaign visual beside copy and a pair of pieces. */
export function EditorialFeature({
  eyebrow,
  title,
  body,
  href,
  cta,
  products,
  art,
  image,
  tone = "light",
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  products: Product[];
  art: { garment: GarmentKind; color: string; trim?: boolean };
  /** Campaign/product photo; falls back to the illustration when absent. */
  image?: { src: string; alt: string };
  tone?: "light" | "dark";
  reverse?: boolean;
}) {
  if (products.length === 0) return null;
  const dark = tone === "dark";

  return (
    <section className={cn("mt-20 md:mt-28", dark && "bg-ink py-20 text-ivory md:py-28")}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-12 md:gap-12 md:px-8">
        <Reveal className={cn("md:col-span-6", reverse && "md:order-2")}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl md:aspect-[4/5.2]">
            {image ? (
              <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" quality={85} className="object-cover" />
            ) : (
              <ProductArt garment={art.garment} color={art.color} trim={art.trim} scene={dark ? "night" : "studio"} className="size-full" />
            )}
            <div className={cn("absolute inset-5 rounded-lg border", dark ? "border-champagne-soft/25" : "border-ivory/60")} aria-hidden />
          </div>
        </Reveal>

        <div className={cn("flex flex-col justify-center md:col-span-6", reverse ? "md:order-1 md:pe-8" : "md:ps-8")}>
          <Reveal>
            <p className={cn("eyebrow", dark && "text-champagne-soft!")}>{eyebrow}</p>
            <h2 className="mt-4 font-display text-[2.1rem] leading-[1.25] md:text-[3rem]">{title}</h2>
            <p className={cn("mt-5 max-w-lg text-[0.95rem] leading-8", dark ? "text-ivory/70" : "text-muted")}>{body}</p>
            <ButtonLink
              href={href}
              variant={dark ? "light" : "primary"}
              className="mt-8"
            >
              {cta}
              <ArrowLeft className="size-4 transition-transform duration-500 group-hover/btn:-translate-x-1" strokeWidth={1.4} />
            </ButtonLink>
          </Reveal>

          <ul className="mt-12 grid grid-cols-2 gap-4 md:gap-6">
            {products.slice(0, 2).map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 120} className={cn(dark && "[&_.text-muted]:text-ivory/60 [&_.text-champagne-deep]:text-champagne-soft [&_.border-ink\/25]:border-ivory/30")}>
                <ProductCard product={p} sizes="(min-width: 768px) 22vw, 46vw" />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
