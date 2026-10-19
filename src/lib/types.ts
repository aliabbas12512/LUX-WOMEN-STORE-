export type CategorySlug = "abayas" | "dresses" | "everyday" | "occasion";
export type CollectionSlug = CategorySlug | "new" | "offers" | "all";

/** Silhouette used by the illustrated placeholder when a product has no authorised photos. */
export type GarmentKind = "abaya" | "dress" | "kaftan";

export type ProductColor = {
  id: string;
  name: string;
  /** Swatch colour, CSS hex. */
  hex: string;
};

export type ProductImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optional colour id this photo shows, used to switch the gallery when a colour is picked. */
  color?: string;
};

export type ProductVariant = {
  color: string;
  size: string;
  /**
   * Units available. `null` means availability is not tracked for this variant
   * and is confirmed with the supplier when the order is placed.
   */
  stock: number | null;
};

export type ProductDetails = {
  fabric?: string;
  care?: string[];
  fit?: string;
  length?: string;
  notes?: string[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Short line under the name. */
  subtitle?: string;
  description: string;
  category: CategorySlug;
  garment: GarmentKind;
  /** Selling price in SAR (VAT-inclusive if you are VAT-registered). */
  price: number;
  /** Previous price — only set for a genuine, currently running discount. */
  compareAtPrice?: number | null;
  colors: ProductColor[];
  sizes: string[];
  variants: ProductVariant[];
  images: ProductImage[];
  /** Fabric/care details. Only include when verified with the supplier. */
  details?: ProductDetails | null;
  sizeChart: "abaya" | "dress";
  /** Per-product delivery estimate in days, when confirmed. Overrides the store default. */
  deliveryDays?: { min: number; max: number } | null;
  /** Mark only products that genuinely sell best. */
  bestSeller?: boolean;
  /** Date added to the catalogue (ISO). Drives "new arrivals" ordering. */
  createdAt: string;
  /** Development sample — not real inventory. Must be false/absent for live products. */
  sample?: boolean;
  /** Decorative trim on the illustrated placeholder. */
  artTrim?: boolean;
};

export type StockState = "in_stock" | "low_stock" | "out_of_stock" | "on_request";
