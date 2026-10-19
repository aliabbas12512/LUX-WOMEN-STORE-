"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { ProductMedia } from "@/components/product/ProductMedia";
import { categoryCollections } from "@/data/collections";
import { getAllProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { searchProducts } from "@/lib/search";
import { track } from "@/lib/analytics";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const results = useMemo(() => searchProducts(getAllProducts(), deferred).slice(0, 6), [deferred]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    track("SEARCH", { search_string: q });
    onClose();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <Sheet open={open} onClose={onClose} side="full" label="البحث في المتجر">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-5 pt-5 md:pt-14">
        <div className="flex items-center gap-3">
          <form onSubmit={submit} role="search" className="flex flex-1 items-center gap-3 border-b border-ink/70 pb-3">
            <Search className="size-5 shrink-0 text-taupe" strokeWidth={1.2} />
            <label htmlFor="site-search" className="sr-only">
              ابحثي في المتجر
            </label>
            <input
              id="site-search"
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحثي عن عباية، فستان، لون…"
              autoComplete="off"
              enterKeyHint="search"
              className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-taupe/70 md:text-3xl"
            />
          </form>
          <button type="button" onClick={onClose} className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-beige/70" aria-label="إغلاق البحث">
            <X className="size-5" strokeWidth={1.2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-7">
          {deferred.trim() === "" ? (
            <div>
              <p className="eyebrow mb-4">تصفّحي حسب التصنيف</p>
              <ul className="flex flex-wrap gap-2.5">
                {categoryCollections.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/collections/${c.slug}`}
                      onClick={onClose}
                      className="inline-flex h-10 items-center rounded-full border border-line px-5 text-[0.85rem] transition hover:border-ink"
                    >
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-display text-xl">لم نجد نتائج مطابقة</p>
              <p className="mt-2 text-[0.88rem] text-muted">جرّبي كلمة أخرى أو تصفّحي التصنيفات.</p>
            </div>
          ) : (
            <div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link href={`/products/${p.slug}`} onClick={onClose} className="group block">
                      <div className="aspect-[3/4] overflow-hidden rounded-xl bg-beige">
                        <ProductMedia product={p} sizes="200px" className="transition-transform duration-700 group-hover:scale-[1.03]" />
                      </div>
                      <p className="mt-2.5 text-[0.85rem]">{p.name}</p>
                      <p className="mt-0.5 text-[0.8rem] tabular-nums text-muted">{formatPrice(p.price)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={submit}
                className="mt-8 inline-flex items-center gap-2 border-b border-ink/30 pb-0.5 text-[0.85rem] hover:border-ink"
              >
                عرض كل النتائج <ArrowLeft className="size-4" strokeWidth={1.2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Sheet>
  );
}
