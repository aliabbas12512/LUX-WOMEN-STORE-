import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "outline" | "light" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full text-[0.9rem] font-medium tracking-wide transition-[background-color,color,border-color,transform,box-shadow] duration-500 ease-[var(--ease-lux)] active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-ivory hover:bg-ink-2 hover:shadow-[0_14px_30px_-16px_rgb(15_14_12/0.6)]",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-ivory",
  light: "bg-ivory text-ink hover:bg-white",
  ghost: "text-ink underline-offset-8 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6",
  lg: "h-13 px-8 text-[0.95rem]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = { variant?: Variant; size?: Size; children: ReactNode; className?: string };

export function Button({ variant, size, className, children, ...rest }: CommonProps & ComponentProps<"button">) {
  return (
    <button className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant, size, className, children, ...rest }: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
