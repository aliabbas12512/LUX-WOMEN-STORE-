import { discountPercent, formatPrice, cn } from "@/lib/format";

export function Price({
  price,
  compareAt,
  className,
  size = "md",
}: {
  price: number;
  compareAt?: number | null;
  className?: string;
  size?: "md" | "lg";
}) {
  const onSale = typeof compareAt === "number" && compareAt > price;
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2.5 gap-y-1", className)}>
      <span className={cn("tabular-nums", size === "lg" ? "text-2xl font-medium" : "text-[0.95rem] font-medium")}>
        {formatPrice(price)}
      </span>
      {onSale ? (
        <>
          <span className={cn("tabular-nums text-muted line-through decoration-1", size === "lg" ? "text-base" : "text-[0.8rem]")}>
            <span className="sr-only">السعر السابق </span>
            {formatPrice(compareAt)}
          </span>
          <span className="text-[0.72rem] font-medium text-champagne-deep">
            وفّري {discountPercent(price, compareAt)}%
          </span>
        </>
      ) : null}
    </div>
  );
}
