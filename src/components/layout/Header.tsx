"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { mainNav } from "@/components/layout/nav";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { useHydrated } from "@/lib/store";
import { openCart } from "@/lib/ui";
import { cn } from "@/lib/format";
import { t } from "@/i18n/ar";

const iconBtn =
  "relative grid size-11 place-items-center rounded-full transition-colors duration-300 hover:bg-current/[0.06]";

export function Header() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const favorites = useFavorites();
  const hydrated = useHydrated();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = overHero && !scrolled && !menuOpen;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 transition-[background-color,color,border-color,box-shadow] duration-500 ease-[var(--ease-lux)]",
          transparent
            ? "border-b border-transparent bg-transparent text-ivory"
            : "border-b border-line/80 bg-ivory/92 text-ink shadow-[0_8px_30px_-24px_rgb(15_14_12/0.35)] backdrop-blur-md",
        )}
      >
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-3 md:h-[76px] md:px-8">
          {/* Start side (right in RTL) */}
          <div className="flex items-center gap-1">
            <button type="button" className={cn(iconBtn, "lg:hidden")} onClick={() => setMenuOpen(true)} aria-label={t.nav.menu}>
              <Menu className="size-[22px]" strokeWidth={1.2} />
            </button>
            <button type="button" className={cn(iconBtn, "lg:hidden")} onClick={() => setSearchOpen(true)} aria-label={t.nav.search}>
              <Search className="size-5" strokeWidth={1.2} />
            </button>
            <nav aria-label="التصنيفات" className="hidden lg:block">
              <ul className="flex items-center gap-7 text-[0.84rem]">
                {mainNav.slice(0, 5).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative py-2 transition-opacity hover:opacity-100 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 hover:after:scale-x-100",
                        pathname === item.href ? "opacity-100 after:scale-x-100" : "opacity-80",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link href="/" aria-label="الصفحة الرئيسية" className="px-2">
            <Wordmark tone={transparent ? "light" : "dark"} />
          </Link>

          {/* End side (left in RTL) */}
          <div className="flex items-center justify-end gap-0.5">
            <button type="button" className={cn(iconBtn, "hidden lg:grid")} onClick={() => setSearchOpen(true)} aria-label={t.nav.search}>
              <Search className="size-5" strokeWidth={1.2} />
            </button>
            <Link href="/account" className={cn(iconBtn, "hidden sm:grid")} aria-label={t.nav.account}>
              <User className="size-5" strokeWidth={1.2} />
            </Link>
            <Link href="/favorites" className={iconBtn} aria-label={`${t.nav.favorites}${hydrated && favorites.length ? ` (${favorites.length})` : ""}`}>
              <Heart className="size-5" strokeWidth={1.2} />
              {hydrated && favorites.length > 0 ? (
                <span className="absolute end-2 top-2 size-1.5 rounded-full bg-champagne" aria-hidden />
              ) : null}
            </Link>
            <button type="button" className={iconBtn} onClick={openCart} aria-label={`${t.nav.cart}${hydrated && count ? ` (${count})` : ""}`}>
              <ShoppingBag className="size-5" strokeWidth={1.2} />
              {hydrated && count > 0 ? (
                <span
                  key={count}
                  className={cn(
                    "absolute end-0.5 top-0.5 grid min-w-[18px] animate-fade-in place-items-center rounded-full px-1 text-[0.62rem] font-medium tabular-nums leading-[18px]",
                    transparent ? "bg-ivory text-ink" : "bg-ink text-ivory",
                  )}
                >
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
