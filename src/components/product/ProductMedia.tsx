import Image from "next/image";
import { ProductArt } from "@/components/product/ProductArt";
import { cn } from "@/lib/format";
import type { Product } from "@/lib/types";

/**
 * Primary visual for a product: the authorised photo for the chosen colour
 * when one exists, otherwise the illustrated placeholder in that colour.
 */
export function ProductMedia({
  product,
  colorId,
  index = 0,
  sizes,
  priority = false,
  className,
}: {
  product: Product;
  colorId?: string;
  index?: number;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const forColor = product.images.filter((img) => !img.color || img.color === color?.id);
  const image = forColor[index] ?? product.images[index];

  if (image) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={85}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <ProductArt
      garment={product.garment}
      color={color?.hex ?? "#141312"}
      trim={product.artTrim}
      frame={index % 2 === 0 ? "arch" : "plain"}
      title={`${product.name}${color ? ` — ${color.name}` : ""}`}
      className={cn("size-full", className)}
    />
  );
}
