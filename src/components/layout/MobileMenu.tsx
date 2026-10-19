"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Heart, MessageCircle, User, X } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Wordmark } from "@/components/ui/Wordmark";
import { infoNav, mainNav } from "@/components/layout/nav";
import { whatsappEnabled } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
    // Close when navigating.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Sheet open={open} onClose={onClose} side="start" label="القائمة الرئيسية">
      <div className="flex items-center justify-between px-5 pt-5">
        <Wordmark />
        <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full hover:bg-beige/70" aria-label="إغلاق القائمة">
          <X className="size-5" strokeWidth={1.2} />
        </button>
      </div>
      <div className="hairline mx-5 mt-5" />

      <nav aria-label="التصنيفات" className="flex-1 overflow-y-auto px-5 py-4">
        <ul>
          {mainNav.map((item, i) => (
            <li key={item.href} className="animate-fade-up" style={{ animationDelay: `${80 + i * 50}ms` }}>
              <Link
                href={item.href}
                className="group flex items-center justify-between border-b border-line/70 py-[1.05rem] font-display text-[1.45rem]"
              >
                {item.label}
                <ArrowLeft className="size-4 text-taupe transition-transform duration-500 group-hover:-translate-x-1" strokeWidth={1.2} />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-7 grid grid-cols-2 gap-2.5">
          <Link href="/account" className="flex h-12 items-center justify-center gap-2 rounded-full border border-line text-[0.85rem]">
            <User className="size-4" strokeWidth={1.3} /> حسابي
          </Link>
          <Link href="/favorites" className="flex h-12 items-center justify-center gap-2 rounded-full border border-line text-[0.85rem]">
            <Heart className="size-4" strokeWidth={1.3} /> المفضّلة
          </Link>
        </div>

        <ul className="mt-7 space-y-3.5 text-[0.88rem] text-muted">
          {infoNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-ink">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {whatsappEnabled ? (
        <div className="border-t border-line p-5">
          <a
            href={whatsappLink("مرحباً، لدي استفسار عن منتجاتكم")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-[0.88rem] text-ivory"
          >
            <MessageCircle className="size-4" strokeWidth={1.4} />
            تواصلي معنا عبر واتساب
          </a>
        </div>
      ) : null}
    </Sheet>
  );
}
