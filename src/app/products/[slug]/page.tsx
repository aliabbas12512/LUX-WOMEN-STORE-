import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductExperience } from "@/components/product/ProductExperience";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCollection } from "@/data/collections";
import { getAllProducts, getProductBySlug, getRelated, stockState } from "@/lib/catalog";
import { deliveryFeeText, deliveryText, returnsText } from "@/lib/policy-text";
import { absoluteUrl, siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const description = `${product.description.slice(0, 140)}… السعر ${formatPrice(product.price)}.`;
  const image = product.images[0];
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    // Development samples must never be indexed as real products.
    robots: product.sample ? { index: false, follow: true } : undefined,
    openGraph: {
      title: product.name,
      description,
      url: absoluteUrl(`/products/${product.slug}`),
      ...(image ? { images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] } : {}),
    },
  };
}

const availabilitySchema = {
  in_stock: "https://schema.org/InStock",
  low_stock: "https://schema.org/LimitedAvailability",
  out_of_stock: "https://schema.org/OutOfStock",
  on_request: undefined,
} as const;

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const category = getCollection(product.category);
  const related = getRelated(product);

  const availability = availabilitySchema[stockState(product)];
  const jsonLd = product.sample
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        sku: product.id,
        brand: { "@type": "Brand", name: siteConfig.brand.nameAr },
        ...(product.images.length ? { image: product.images.map((i) => i.src) } : {}),
        offers: {
          "@type": "Offer",
          url: absoluteUrl(`/products/${product.slug}`),
          priceCurrency: "SAR",
          price: product.price,
          ...(availability ? { availability } : {}),
        },
      };

  const breadcrumb = (
    <nav aria-label="مسار التنقل" className="text-[0.75rem] text-muted">
      <Link href="/" className="hover:text-ink">
        الرئيسية
      </Link>
      <span className="mx-2 text-sand">/</span>
      {category ? (
        <Link href={`/collections/${category.slug}`} className="hover:text-ink">
          {category.title}
        </Link>
      ) : null}
    </nav>
  );

  return (
    <div className="mx-auto max-w-7xl">
      <ProductExperience
        product={product}
        breadcrumb={breadcrumb}
        deliveryText={deliveryText(product)}
        deliveryFeeText={deliveryFeeText()}
        returnsText={returnsText()}
      />

      {related.length > 0 ? (
        <section className="mt-24 px-5 md:px-8">
          <SectionHeading eyebrow="اكتشفي المزيد" title="قد يعجبكِ أيضاً" href={category ? `/collections/${category.slug}` : "/collections/all"} />
          <ul className="mt-10 grid grid-cols-2 gap-x-3.5 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}
    </div>
  );
}
