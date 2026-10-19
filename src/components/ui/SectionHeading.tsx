import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/format";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "عرض الكل",
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-6",
        align === "center" ? "flex-col items-center text-center" : "items-end justify-between",
        className,
      )}
    >
      <div className={cn(align === "center" && "flex flex-col items-center")}>
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h2 className="font-display text-[1.9rem] leading-[1.25] md:text-[2.6rem]">{title}</h2>
        {description ? <p className="mt-3 max-w-xl text-[0.92rem] leading-7 text-muted">{description}</p> : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="group/link hidden shrink-0 items-center gap-2 pb-2 text-[0.85rem] text-ink md:inline-flex"
        >
          <span className="border-b border-ink/30 pb-0.5 transition group-hover/link:border-ink">{linkLabel}</span>
          <ArrowLeft className="size-4 transition-transform duration-500 group-hover/link:-translate-x-1" strokeWidth={1.25} />
        </Link>
      ) : null}
    </div>
  );
}
