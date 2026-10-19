import { siteConfig } from "@/config/site";
import { cn } from "@/lib/format";

/** Brand wordmark: Arabic name set in display serif with a fine Latin signature. */
export function Wordmark({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      <span className={cn("font-display text-[1.9rem] leading-none", tone === "light" ? "text-ivory" : "text-ink")}>
        {siteConfig.brand.nameAr}
      </span>
      <span
        dir="ltr"
        className={cn(
          "mt-1 font-latin text-[0.6rem] tracking-[0.55em] ps-[0.55em]",
          tone === "light" ? "text-champagne-soft" : "text-champagne-deep",
        )}
      >
        {siteConfig.brand.nameEn}
      </span>
    </span>
  );
}
