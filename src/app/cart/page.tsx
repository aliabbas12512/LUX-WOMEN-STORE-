import type { Metadata } from "next";
import { CartView } from "@/components/checkout/CartView";

export const metadata: Metadata = { title: "حقيبة التسوّق", robots: { index: false } };

export default function CartPage() {
  return <CartView />;
}
