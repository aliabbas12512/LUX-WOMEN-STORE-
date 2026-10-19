"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { byNewest, getFacets, isVariantAvailable, stockState } from "@/lib/catalog";
import { cn, formatNumber } from "@/lib/format";
import type { Product } from "@/lib/types";

const SORTS = [
  { id: "featured", label: "المختارات" },
  { id: "newest", label: "الأحدث" },
  { id: "price-asc", label: "السعر: من الأقل" },
  { id: "price-desc", label: "السعر: من الأعلى" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

type Filters = { sizes: string[]; colors: string[]; min: number | null; max: number | null; available: boolean; sort: SortId };

function readFilters(params: URLSearchParams): Filters {
  const list = (k: string) => (params.get(k) ?? "").split(",").filter(Boolean);
  const num = (k: string) => {
    const v = Number(params.get(k));
    return params.get(k) && Number.isFinite(v) && v >= 0 ? v : null;
  };
  const sort = params.get("sort") as SortId | null;
  return {
    sizes: list("size"),
    colors: list("color"),
    min: num("min"),
    max: num("max"),
    available: params.get("available") === "1",
    sort: SORTS.some((s) => s.id === sort) ? (sort as SortId) : "featured",
  };
}

function applyFilters(products: Product[], f: Filters) {
  const out = products.filter((p) => {
    if (f.sizes.length && !f.sizes.some((s) => p.sizes.includes(s) && (!f.available || p.colors.some((c) => isVariantAvailable(p, c.id, s))))) return false;
    if (f.colors.length && !f.colors.some((c) => p.colors.some((pc) => pc.id === c))) return false;
    if (f.min !== null && p.price < f.min) return false;
    if (f.max !== null && p.price > f.max) return false;
    if (f.available && stockState(p) === "out_of_stock") return false;
    return true;
  });
  switch (f.sort) {
    case "newest":
      return [...out].sort(byNewest);
    case "price-asc":
      return [...out].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...out].sort((a, b) => b.price - a.price);
    default:
      return out;
  }
}

export function CollectionView({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  // Local state is the source of truth so rapid successive taps never overwrite each
  // other; the URL is kept in sync for sharing and back/forward navigation.
  const paramsKey = params.toString();
  const [prevKey, setPrevKey] = useState(paramsKey);
  const [filters, setFilters] = useState<Filters>(() => readFilters(new URLSearchParams(paramsKey)));
  if (prevKey !== paramsKey) {
    // The URL changed (our own update landing, or back/forward): adopt it.
    setPrevKey(paramsKey);
    setFilters(readFilters(new URLSearchParams(paramsKey)));
  }
  const facets = useMemo(() => getFacets(products), [products]);
  const results = useMemo(() => applyFilters(products, filters), [products, filters]);
  const activeCount = filters.sizes.length + filters.colors.length + (filters.min !== null || filters.max !== null ? 1 : 0) + (filters.available ? 1 : 0);

  function update(next: Partial<Filters>) {
    const f = { ...filters, ...next };
    setFilters(f);
    const q = new URLSearchParams();
    if (f.sizes.length) q.set("size", f.sizes.join(","));
    if (f.colors.length) q.set("color", f.colors.join(","));
    if (f.min !== null) q.set("min", String(f.min));
    if (f.max !== null) q.set("max", String(f.max));
    if (f.available) q.set("available", "1");
    if (f.sort !== "featured") q.set("sort", f.sort);
    const qs = q.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  const toggle = (key: "sizes" | "colors", value: string) =>
    update({ [key]: filters[key].includes(value) ? filters[key].filter((v) => v !== value) : [...filters[key], value] });

  const clearAll = () => update({ sizes: [], colors: [], min: null, max: null, available: false });

  return (
    <div>
      {/* Toolbar */}
      <div className="sticky top-16 z-20 -mx-5 border-y border-line bg-ivory/95 px-5 backdrop-blur md:top-[76px] md:-mx-8 md:px-8">
        <div className="flex h-14 items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[0.84rem] transition hover:border-ink"
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.3} />
            تصفية
            {activeCount > 0 ? (
              <span className="grid size-5 place-items-center rounded-full bg-ink text-[0.65rem] text-ivory">{activeCount}</span>
            ) : null}
          </button>
          <p className="hidden text-[0.8rem] text-muted sm:block" aria-live="polite">
            {formatNumber(results.length)} {results.length === 1 ? "قطعة" : "قطع"}
          </p>
          <label className="relative inline-flex items-center">
            <span className="sr-only">ترتيب حسب</span>
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortId })}
              className="h-10 appearance-none rounded-full border border-line bg-transparent pe-9 ps-4 text-[0.84rem] outline-none transition hover:border-ink"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-3 size-4 text-taupe" strokeWidth={1.3} />
          </label>
        </div>
      </div>

      {activeCount > 0 ? (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {filters.sizes.map((s) => (
            <Chip key={`s-${s}`} label={`مقاس ${s}`} onRemove={() => toggle("sizes", s)} />
          ))}
          {filters.colors.map((c) => (
            <Chip key={`c-${c}`} label={facets.colors.find((x) => x.id === c)?.name ?? c} onRemove={() => toggle("colors", c)} />
          ))}
          {filters.min !== null || filters.max !== null ? (
            <Chip
              label={`السعر ${filters.min ?? facets.minPrice} – ${filters.max ?? facets.maxPrice} ر.س`}
              onRemove={() => update({ min: null, max: null })}
            />
          ) : null}
          {filters.available ? <Chip label="المتوفر فقط" onRemove={() => update({ available: false })} /> : null}
          <button type="button" onClick={clearAll} className="px-2 text-[0.78rem] text-muted underline underline-offset-4 hover:text-ink">
            مسح الكل
          </button>
        </div>
      ) : null}

      {results.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <p className="font-display text-2xl">لا توجد قطع تطابق اختياراتكِ</p>
          <p className="mt-3 max-w-sm text-[0.88rem] leading-7 text-muted">جرّبي تعديل المقاس أو اللون أو نطاق السعر لاكتشاف المزيد.</p>
          {activeCount > 0 ? (
            <Button variant="outline" className="mt-7" onClick={clearAll}>
              مسح عوامل التصفية
            </Button>
          ) : null}
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-3.5 gap-y-10 md:mt-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 xl:grid-cols-4">
          {results.map((p, i) => (
            <li key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
              <ProductCard product={p} priority={i < 2} />
            </li>
          ))}
        </ul>
      )}

      <Sheet open={open} onClose={() => setOpen(false)} side="start" label="تصفية المنتجات" title="تصفية">
        <FilterPanel facets={facets} filters={filters} onToggle={toggle} onUpdate={update} />
        <div className="grid grid-cols-2 gap-2.5 border-t border-line p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <Button variant="outline" onClick={clearAll} disabled={activeCount === 0}>
            مسح الكل
          </Button>
          <Button onClick={() => setOpen(false)}>عرض {formatNumber(results.length)} {results.length === 1 ? "قطعة" : "قطع"}</Button>
        </div>
      </Sheet>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex h-8 items-center gap-1.5 rounded-full bg-beige px-3.5 text-[0.76rem] transition hover:bg-sand"
      aria-label={`إزالة: ${label}`}
    >
      {label}
      <X className="size-3" strokeWidth={1.5} />
    </button>
  );
}

function FilterPanel({
  facets,
  filters,
  onToggle,
  onUpdate,
}: {
  facets: ReturnType<typeof getFacets>;
  filters: Filters;
  onToggle: (key: "sizes" | "colors", v: string) => void;
  onUpdate: (f: Partial<Filters>) => void;
}) {
  const [min, setMin] = useState(filters.min?.toString() ?? "");
  const [max, setMax] = useState(filters.max?.toString() ?? "");

  const commitPrice = () => {
    const lo = min.trim() === "" ? null : Math.max(0, Number(min));
    const hi = max.trim() === "" ? null : Math.max(0, Number(max));
    onUpdate({ min: Number.isFinite(lo) ? lo : null, max: Number.isFinite(hi) ? hi : null });
  };

  return (
    <div className="flex-1 space-y-9 overflow-y-auto px-5 py-7 md:px-7">
      {facets.sizes.length > 0 ? (
        <fieldset>
          <legend className="mb-4 text-[0.85rem] font-medium">المقاس</legend>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => {
              const on = filters.sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onToggle("sizes", s)}
                  className={cn(
                    "h-10 min-w-12 rounded-full border px-4 text-[0.82rem] tabular-nums transition",
                    on ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {facets.colors.length > 0 ? (
        <fieldset>
          <legend className="mb-4 text-[0.85rem] font-medium">اللون</legend>
          <div className="grid grid-cols-2 gap-2">
            {facets.colors.map((c) => {
              const on = filters.colors.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onToggle("colors", c.id)}
                  className={cn(
                    "flex h-11 items-center gap-2.5 rounded-full border px-3 text-[0.82rem] transition",
                    on ? "border-ink" : "border-line hover:border-ink/50",
                  )}
                >
                  <span className="grid size-5 place-items-center rounded-full ring-1 ring-ink/15" style={{ backgroundColor: c.hex }}>
                    {on ? <Check className="size-3 text-white mix-blend-difference" strokeWidth={2} /> : null}
                  </span>
                  {c.name}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="mb-1 text-[0.85rem] font-medium">السعر (ر.س)</legend>
        <p className="mb-4 text-[0.75rem] text-muted">
          من {formatNumber(facets.minPrice)} إلى {formatNumber(facets.maxPrice)} ر.س
        </p>
        <div className="flex items-center gap-3">
          <label className="flex-1">
            <span className="sr-only">أقل سعر</span>
            <input
              inputMode="numeric"
              placeholder="من"
              value={min}
              onChange={(e) => setMin(e.target.value.replace(/[^\d]/g, ""))}
              onBlur={commitPrice}
              className="h-11 w-full rounded-full border border-line bg-transparent px-4 text-[0.85rem] tabular-nums outline-none focus:border-ink"
            />
          </label>
          <span className="text-taupe">—</span>
          <label className="flex-1">
            <span className="sr-only">أعلى سعر</span>
            <input
              inputMode="numeric"
              placeholder="إلى"
              value={max}
              onChange={(e) => setMax(e.target.value.replace(/[^\d]/g, ""))}
              onBlur={commitPrice}
              className="h-11 w-full rounded-full border border-line bg-transparent px-4 text-[0.85rem] tabular-nums outline-none focus:border-ink"
            />
          </label>
        </div>
      </fieldset>

      <label className="flex items-center justify-between gap-4">
        <span className="text-[0.85rem] font-medium">المتوفر فقط</span>
        <input
          type="checkbox"
          checked={filters.available}
          onChange={(e) => onUpdate({ available: e.target.checked })}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="relative h-6 w-11 rounded-full bg-sand transition peer-checked:bg-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 after:absolute after:start-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-ivory after:transition-transform after:duration-300 peer-checked:after:-translate-x-5"
        />
      </label>
    </div>
  );
}
