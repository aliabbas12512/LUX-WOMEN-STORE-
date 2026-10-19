import type { Metadata } from "next";
import { AccountView } from "@/components/checkout/AccountView";

export const metadata: Metadata = { title: "حسابي", robots: { index: false } };

export default function AccountPage() {
  return <AccountView />;
}
