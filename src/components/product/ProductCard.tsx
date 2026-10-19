import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { ProductMedia } from "@/components/product/ProductMedia";
import { Price } from "@/components/ui/Price";
import { isOnSale, stockState } from "@/lib/catalog";
import { cn } from "@/lib/format";
import { t } from "@/i18n/ar";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false, sizes }: { product: Product; priority?: boolean; sizes?: string }) {
  const stock = stockState(product);
  const soldOut = stock === "out_of_stock";
  const href = `/products/${product.slug}`;
  const alt = product.colors[1]?.id;
  const imgSizes = sizes ?? "(min-width: 1280px) 300px, (min-width: 768px) 30vw, 48vw";

  return (
    <article className="group/card relative">
      <div className="relative">
        <Link href={href} className="block" tabIndex={-1} aria-hidden>
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-beige">
            <ProductMedia
              product={product}
              sizes={imgSizes}
              priority={priority}
              className={cn(
                "transition-[transform,opacity] duration-[1.2s] ease-[var(--ease-lux)] group-hover/card:scale-[1.035]",
                soldOut && "opacity-70 grayscale-[35%]",
              )}
            />
            {product.images.length > 1 || alt ? (
              <div className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-[var(--ease-lux)] [@media(hover:hover)]:group-hover/card:opacity-100">
                <ProductMedia product={product} colorId={alt} index={product.images.length > 1 ? 1 : 0} sizes={imgSizes} />
              </div>
            ) : null}
          </div>
        </Link>

        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-between">
          <div className="flex flex-col items-start gap-1.5">
            {soldOut ? (
              <span className="rounded-full bg-ink/85 px-3 py-1 text-[0.68rem] text-ivory">{t.product.soldOut}</span>
            ) : isOnSale(product) ? (
              <span className="rounded-full bg-ivory/90 px-3 py-1 text-[0.68rem] text-champagne-deep">{t.product.sale}</span>
            ) : null}
          </div>
          <FavoriteButton product={product} className="pointer-events-auto" />
        </div>
      </div>

      <div className="mt-3.5 px-0.5">
        <div className="flex items-center justify-between gap-3">
          <ul className="flex items-center gap-1.5" aria-label={`الألوان المتاحة: ${product.colors.map((c) => c.name).join("، ")}`}>
            {product.colors.slice(0, 4).map((c) => (
              <li key={c.id} className="size-3 rounded-full ring-1 ring-ink/15 ring-offset-1 ring-offset-ivory" style={{ backgroundColor: c.hex }} title={c.name} />
            ))}
          </ul>
          <span className="text-[0.72rem] text-muted">{product.sizes.length > 0 ? `${product.sizes[0]} – ${product.sizes.at(-1)}` : ""}</span>
        </div>
        <h3 className="mt-2.5 text-[0.92rem] leading-6 md:text-[0.95rem]">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <Price price={product.price} compareAt={product.compareAtPrice} className="mt-1" />
        {stock === "low_stock" || stock === "on_request" ? (
          <p className={cn("mt-1.5 text-[0.72rem]", stock === "low_stock" ? "text-champagne-deep" : "text-muted")}>
            {t.product.stock[stock]}
          </p>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-1.5 border-b border-ink/25 pb-0.5 text-[0.78rem] transition group-hover/card:border-ink">
          {t.product.view}
          <ArrowLeft className="size-3.5 transition-transform duration-500 group-hover/card:-translate-x-1" strokeWidth={1.3} />
        </span>
      </div>
    </article>
  );
}
