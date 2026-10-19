"use client";

import { Heart } from "lucide-react";
import { toggleFavorite, useFavorites } from "@/lib/favorites";
import { useHydrated } from "@/lib/store";
import { track } from "@/lib/analytics";
import { toast } from "@/lib/ui";
import { cn } from "@/lib/format";
import { t } from "@/i18n/ar";
import type { Product } from "@/lib/types";

export function FavoriteButton({ product, className, variant = "overlay" }: { product: Product; className?: string; variant?: "overlay" | "outline" }) {
  const favorites = useFavorites();
  const hydrated = useHydrated();
  const active = hydrated && favorites.includes(product.id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`${active ? t.product.removeFavorite : t.product.addFavorite}: ${product.name}`}
      onClick={() => {
        const added = toggleFavorite(product.id);
        if (added) {
          track("ADD_TO_WISHLIST", { item_ids: [product.id], price: product.price, currency: "SAR" });
          toast("أُضيفت إلى المفضّلة");
        }
      }}
      className={cn(
        "grid place-items-center rounded-full transition duration-300 active:scale-90",
        variant === "overlay"
          ? "size-10 bg-ivory/80 text-ink backdrop-blur-sm hover:bg-ivory"
          : "size-13 border border-line hover:border-ink",
        className,
      )}
    >
      <Heart
        className={cn("size-[18px] transition-all duration-300", active && "scale-110 fill-ink")}
        strokeWidth={1.25}
      />
    </button>
  );
}
