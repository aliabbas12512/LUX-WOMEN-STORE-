import type { Metadata } from "next";
import { HowToMeasure, SizeTable } from "@/components/product/SizeGuideTables";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "دليل المقاسات",
  description: "جداول مقاسات العبايات والفساتين وطريقة أخذ القياسات لاختيار المقاس المناسب.",
  alternates: { canonical: "/size-guide" },
};

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8">
      <PageHeader eyebrow="المقاس المثالي" title="دليل المقاسات" description="اختاري مقاسكِ بثقة. وإن احتجتِ إلى مساعدة، فريقنا يسعده إرشادكِ." />
      <div className="space-y-12">
        <SizeTable kind="abaya" />
        <SizeTable kind="dress" />
        <HowToMeasure />
      </div>
    </div>
  );
}
