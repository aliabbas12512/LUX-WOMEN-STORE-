import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionView } from "@/components/collection/CollectionView";
import { ProductCard } from "@/components/product/ProductCard";
import { collections, getCollection } from "@/data/collections";
import { getProductsForCollection } from "@/lib/catalog";
import { cn } from "@/lib/format";
import { absoluteUrl } from "@/config/site";
import type { CollectionSlug } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { title: c.title, description: c.description, url: absoluteUrl(`/collections/${c.slug}`) },
  };
}

const chips = collections.filter((c) => c.slug !== "all");

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const products = getProductsForCollection(collection.slug as CollectionSlug);

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <header className="pb-8 pt-10 text-center md:pb-12 md:pt-16">
        <nav aria-label="مسار التنقل" className="text-[0.75rem] text-muted">
          <Link href="/" className="hover:text-ink">
            الرئيسية
          </Link>
          <span className="mx-2 text-sand">/</span>
          <span aria-current="page">{collection.title}</span>
        </nav>
        <p className="eyebrow mt-6">{collection.eyebrow}</p>
        <h1 className="mt-3 font-display text-[2.5rem] leading-tight md:text-[3.6rem]">{collection.title}</h1>
        <p className="mx-auto mt-4 max-w-lg text-[0.92rem] leading-7 text-muted">{collection.description}</p>
      </header>

      <nav aria-label="التصنيفات" className="no-scrollbar -mx-5 mb-6 overflow-x-auto px-5 md:mx-0 md:px-0">
        <ul className="flex w-max gap-2 md:mx-auto">
          <li>
            <Link
              href="/collections/all"
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-4 text-[0.8rem] transition",
                collection.slug === "all" ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink",
              )}
            >
              الكل
            </Link>
          </li>
          {chips.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/collections/${c.slug}`}
                aria-current={c.slug === collection.slug ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center whitespace-nowrap rounded-full border px-4 text-[0.8rem] transition",
                  c.slug === collection.slug ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink",
                )}
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {products.length === 0 ? (
        <div className="flex flex-col items-center border-t border-line py-24 text-center">
          <p className="font-display text-2xl">
            {collection.slug === "offers" ? "لا توجد عروض حالياً" : "قريباً"}
          </p>
          <p className="mt-3 max-w-sm text-[0.88rem] leading-7 text-muted">
            {collection.slug === "offers"
              ? "تابعينا لتكوني أول من يعرف بالعروض القادمة، وتصفّحي مجموعتنا الحالية."
              : "نعمل على إضافة قطع جديدة لهذه المجموعة."}
          </p>
          <Link href="/collections/all" className="mt-7 border-b border-ink/30 pb-0.5 text-[0.85rem] hover:border-ink">
            تصفّحي جميع المنتجات
          </Link>
        </div>
      ) : (
        <Suspense
          fallback={
            <ul className="mt-24 grid grid-cols-2 gap-x-3.5 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
              {products.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          }
        >
          <CollectionView products={products} />
        </Suspense>
      )}
    </div>
  );
}
