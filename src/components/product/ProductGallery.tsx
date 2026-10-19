"use client";

import { useEffect, useRef, useState } from "react";
import { Expand, X } from "lucide-react";
import { ProductMedia } from "@/components/product/ProductMedia";
import { ProductArt } from "@/components/product/ProductArt";
import { Sheet } from "@/components/ui/Sheet";
import { cn } from "@/lib/format";
import type { Product } from "@/lib/types";

type View = { key: string; render: (opts: { large?: boolean; priority?: boolean }) => React.ReactNode };

function buildViews(product: Product, colorId: string): View[] {
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const photos = product.images.filter((img) => !img.color || img.color === colorId);
  if (photos.length > 0) {
    return photos.map((_, i) => ({
      key: `p${i}`,
      render: ({ large, priority }) => (
        <ProductMedia product={product} colorId={colorId} index={i} priority={priority && i === 0} sizes={large ? "100vw" : "(min-width: 1024px) 55vw, 100vw"} />
      ),
    }));
  }
  const hex = color?.hex ?? "#141312";
  const title = `${product.name} — ${color?.name ?? ""}`;
  return [
    { key: "a0", render: () => <ProductArt garment={product.garment} color={hex} trim={product.artTrim} title={title} className="size-full" /> },
    { key: "a1", render: () => <ProductArt garment={product.garment} color={hex} trim={product.artTrim} frame="plain" title={title} className="size-full" /> },
    {
      key: "a2",
      render: () => (
        <div className="size-full overflow-hidden">
          <ProductArt garment={product.garment} color={hex} trim={product.artTrim} frame="plain" title={`${title} — تفاصيل`} className="size-full origin-[50%_22%] scale-[1.9]" />
        </div>
      ),
    },
  ];
}

export function ProductGallery({ product, colorId }: { product: Product; colorId: string }) {
  const views = buildViews(product, colorId);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const track = useRef<HTMLDivElement>(null);

  // Reset to the first view when the colour changes.
  useEffect(() => {
    track.current?.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
  }, [colorId]);

  function onScroll() {
    const el = track.current;
    if (!el) return;
    const i = Math.round(Math.abs(el.scrollLeft) / el.clientWidth);
    if (i !== active) setActive(i);
  }

  return (
    <div>
      {/* Mobile: swipeable track */}
      <div className="relative lg:hidden">
        <div ref={track} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
          {views.map((v, i) => (
            <button
              key={`${colorId}-${v.key}`}
              type="button"
              onClick={() => setZoom(i)}
              className="relative aspect-[3/4] w-full shrink-0 snap-center bg-beige"
              aria-label={`عرض الصورة ${i + 1} بحجم أكبر`}
            >
              {v.render({ priority: true })}
            </button>
          ))}
        </div>
        {views.length > 1 ? (
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5" aria-hidden>
            {views.map((v, i) => (
              <span key={v.key} className={cn("h-[3px] rounded-full bg-ink transition-all duration-500", i === active ? "w-6 opacity-80" : "w-3 opacity-25")} />
            ))}
          </div>
        ) : null}
      </div>

      {/* Desktop: editorial grid */}
      <div className="hidden gap-3 lg:grid lg:grid-cols-2">
        {views.map((v, i) => (
          <button
            key={`${colorId}-${v.key}`}
            type="button"
            onClick={() => setZoom(i)}
            className={cn(
              "group relative cursor-zoom-in overflow-hidden rounded-xl bg-beige",
              i === 0 ? "col-span-2 aspect-[4/5]" : "aspect-[3/4]",
            )}
            aria-label={`عرض الصورة ${i + 1} بحجم أكبر`}
          >
            <div className="size-full animate-fade-in transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-[1.025]">
              {v.render({ priority: i === 0 })}
            </div>
            <span className="absolute bottom-4 end-4 grid size-10 place-items-center rounded-full bg-ivory/85 opacity-0 backdrop-blur transition group-hover:opacity-100">
              <Expand className="size-4" strokeWidth={1.3} />
            </span>
          </button>
        ))}
      </div>

      <Sheet open={zoom !== null} onClose={() => setZoom(null)} side="full" label="عرض الصور" className="bg-ivory-2!">
        <button
          type="button"
          onClick={() => setZoom(null)}
          className="absolute end-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-ivory shadow"
          aria-label="إغلاق"
        >
          <X className="size-5" strokeWidth={1.2} />
        </button>
        <div className="no-scrollbar flex h-full snap-y snap-mandatory flex-col overflow-y-auto">
          {zoom !== null
            ? [...views.slice(zoom), ...views.slice(0, zoom)].map((v) => (
                <div key={v.key} className="relative mx-auto aspect-[3/4] h-[100dvh] max-w-full shrink-0 snap-center">
                  {v.render({ large: true })}
                </div>
              ))
            : null}
        </div>
      </Sheet>
    </div>
  );
}
