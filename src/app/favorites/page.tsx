import type { Metadata } from "next";
import { FavoritesView } from "@/components/collection/FavoritesView";

export const metadata: Metadata = { title: "المفضّلة", robots: { index: false } };

export default function FavoritesPage() {
  return <FavoritesView />;
}
