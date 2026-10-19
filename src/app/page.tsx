import { Hero } from "@/components/home/Hero";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { ProductRail } from "@/components/home/ProductRail";
import { EditorialFeature } from "@/components/home/EditorialFeature";
import { TrustSection } from "@/components/home/TrustSection";
import { SocialSection } from "@/components/home/SocialSection";
import { getBestSellers, getNewArrivals, getOffers, getProductsForCollection } from "@/lib/catalog";

export default function HomePage() {
  const abayas = getProductsForCollection("abayas");
  const occasion = [...getProductsForCollection("occasion"), ...getProductsForCollection("dresses")];
  const offers = getOffers();

  return (
    <>
      <Hero />
      <ProductRail
        eyebrow="وصل حديثاً"
        title="أحدث القطع"
        description="إضافات الموسم الجديدة، مختارة لتكمل خزانتكِ بهدوء وأناقة."
        href="/collections/new"
        products={getNewArrivals()}
      />
      <CategoryTiles />
      <EditorialFeature
        eyebrow="مجموعة العبايات"
        title="عبايات تُروى بهدوء"
        body="قصّات مدروسة وخامات مختارة بعناية، من العباية الكلاسيكية لأيامكِ المزدحمة إلى التصاميم المطرّزة لأمسياتكِ الخاصة."
        href="/collections/abayas"
        cta="تسوّقي العبايات"
        products={abayas.filter((p) => p.artTrim || p.bestSeller)}
        art={{ garment: "abaya", color: "#141312", trim: true }}
      />
      <ProductRail
        eyebrow="الأكثر طلباً"
        title="قطع أحبّتها عميلاتنا"
        href="/collections/all"
        products={getBestSellers()}
      />
      <EditorialFeature
        eyebrow="الفساتين والمناسبات"
        title="لأمسياتكِ التي لا تُنسى"
        body="فساتين محتشمة بخامات غنية كالساتان والمخمل والشيفون، بتفاصيل دقيقة تمنحكِ حضوراً راقياً في الأعراس والمناسبات."
        href="/collections/occasion"
        cta="اكتشفي فساتين المناسبات"
        products={occasion}
        art={{ garment: "dress", color: "#5A1F2A", trim: true }}
        tone="dark"
        reverse
      />
      {offers.length > 0 ? (
        <ProductRail
          eyebrow="لفترة محدودة"
          title="العروض"
          description="أسعار خاصة على قطع مختارة، حتى نفاد الكمية."
          href="/collections/offers"
          products={offers}
        />
      ) : null}
      <TrustSection />
      <SocialSection />
    </>
  );
}
