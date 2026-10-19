import type { MetadataRoute } from "next";
import { collections } from "@/data/collections";
import { getAllProducts } from "@/lib/catalog";
import { absoluteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["/", "/about", "/contact", "/shipping", "/returns", "/privacy", "/terms", "/size-guide"];
  return [
    ...staticPages.map((p) => ({ url: absoluteUrl(p), lastModified: now, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.4 })),
    ...collections.map((c) => ({ url: absoluteUrl(`/collections/${c.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    // Sample products are excluded so they are never indexed as real inventory.
    ...getAllProducts()
      .filter((p) => !p.sample)
      .map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), lastModified: new Date(p.createdAt), changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
