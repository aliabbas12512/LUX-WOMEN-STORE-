import { siteConfig } from "@/config/site";
import { ProductArt } from "@/components/product/ProductArt";

/** Shown only when at least one social account is configured. No fabricated posts. */
export function SocialSection() {
  const { instagram, snapchat, tiktok } = siteConfig.social;
  const links = [
    instagram && { href: instagram, label: "إنستغرام" },
    snapchat && { href: snapchat, label: "سناب شات" },
    tiktok && { href: tiktok, label: "تيك توك" },
  ].filter(Boolean) as { href: string; label: string }[];
  if (links.length === 0) return null;

  return (
    <section className="mx-auto mt-20 max-w-7xl px-5 md:mt-28 md:px-8">
      <div className="relative overflow-hidden rounded-xl bg-beige">
        <div className="grid items-center md:grid-cols-2">
          <div className="p-8 md:p-14">
            <p className="eyebrow">تابعينا</p>
            <h2 className="mt-4 font-display text-[2rem] leading-tight md:text-[2.6rem]">إطلالات وتنسيقات جديدة كل أسبوع</h2>
            <p className="mt-4 max-w-md text-[0.92rem] leading-7 text-muted">
              شاهدي القطع على أرض الواقع، وكوني أول من يعرف بوصول المجموعات الجديدة.
            </p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center rounded-full border border-ink/25 px-6 text-[0.85rem] transition hover:bg-ink hover:text-ivory">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden h-full grid-cols-2 md:grid" aria-hidden>
            <ProductArt garment="dress" color="#C9A39A" frame="plain" className="size-full" />
            <ProductArt garment="abaya" color="#6E5646" className="size-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
