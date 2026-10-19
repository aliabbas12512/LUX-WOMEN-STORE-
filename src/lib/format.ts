const sar = new Intl.NumberFormat("ar-SA-u-nu-latn", { maximumFractionDigits: 2 });

/** "389 ر.س" — Western digits are the most readable choice for prices on Saudi storefronts. */
export function formatPrice(value: number) {
  return `${sar.format(value)} ر.س`;
}

export function formatNumber(value: number) {
  return sar.format(value);
}

export function discountPercent(price: number, compareAt: number) {
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
