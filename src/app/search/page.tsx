import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { categoryCollections } from "@/data/collections";
import { getAllProducts } from "@/lib/catalog";
import { searchProducts } from "@/lib/search";

export const metadata: Metadata = { title: "البحث", robots: { index: false } };

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.slice(0, 80).trim() ?? "";
  const results = q ? searchProducts(getAllProducts(), q) : [];

  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-16">
      <header className="text-center">
        <p className="eyebrow">نتائج البحث</p>
        <h1 className="mt-3 font-display text-[2.2rem] md:text-[3rem]">{q ? `«${q}»` : "ابحثي في المتجر"}</h1>
        <form action="/search" role="search" className="mx-auto mt-6 flex max-w-md items-center gap-2 border-b border-ink/60 pb-2">
          <label htmlFor="q" className="sr-only">
            كلمة البحث
          </label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="عباية، فستان، لون…" className="w-full bg-transparent py-2 text-[0.95rem] outline-none" />
          <button type="submit" className="text-[0.82rem]">
            بحث
          </button>
        </form>
        {q ? <p className="mt-4 text-[0.82rem] text-muted">{results.length} نتيجة</p> : null}
      </header>

      {q && results.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-2xl">لم نجد ما يطابق بحثكِ</p>
          <p className="mt-3 text-[0.88rem] text-muted">جرّبي كلمة أخرى أو تصفّحي التصنيفات:</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
            {categoryCollections.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className="inline-flex h-10 items-center rounded-full border border-line px-5 text-[0.85rem] hover:border-ink">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="mt-12 grid grid-cols-2 gap-x-3.5 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
          {results.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
