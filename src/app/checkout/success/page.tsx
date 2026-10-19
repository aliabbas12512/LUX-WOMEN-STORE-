import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderSuccess } from "@/components/checkout/OrderSuccess";

export const metadata: Metadata = { title: "تم استلام طلبكِ", robots: { index: false } };

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <OrderSuccess />
    </Suspense>
  );
}
