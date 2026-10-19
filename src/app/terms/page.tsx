import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";
import { policies } from "@/content/policies";

const policy = policies.terms;

export const metadata: Metadata = {
  title: policy.title,
  description: policy.description,
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <PolicyPage policy={policy} />;
}
