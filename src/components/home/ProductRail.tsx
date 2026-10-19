import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/format";
import type { Product } from "@/lib/types";

/** Horizontal, swipeable rail on mobile; 4-column grid on desktop. */
export function ProductRail({
  eyebrow,
  title,
  description,
  href,
  products,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href: string;
  products: Product[];
}) {
  if (products.length === 0) return null;
  const shown = products.slice(0, 8);
  // Keep the desktop grid in complete rows of four.
  const desktopCount = shown.length >= 4 ? Math.floor(shown.length / 4) * 4 : shown.length;
  return (
    <section className="pt-20 md:pt-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} href={href} />
      </div>
      <ul className="no-scrollbar mx-auto mt-9 flex max-w-7xl snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 md:mt-12 md:grid md:grid-cols-4 md:gap-x-6 md:gap-y-12 md:overflow-visible md:px-8">
        {shown.map((p, i) => (
          <li key={p.id} className={cn("w-[64vw] max-w-[300px] shrink-0 snap-start md:w-auto md:max-w-none", i >= desktopCount && "md:hidden")}>
            <Reveal delay={(i % 4) * 80}>
              <ProductCard product={p} sizes="(min-width: 768px) 25vw, 64vw" />
            </Reveal>
          </li>
        ))}
      </ul>
      <div className="mt-8 px-5 md:hidden">
        <Link href={href} className="flex h-12 items-center justify-center gap-2 rounded-full border border-ink/20 text-[0.85rem]">
          عرض الكل <ArrowLeft className="size-4" strokeWidth={1.3} />
        </Link>
      </div>
    </section>
  );
}
