import { storeConfig } from "@/config/store";
import { t } from "@/i18n/ar";

/** Shared (client + server) validation for the checkout form. */

export type CustomerInput = {
  name: string;
  phone: string;
  cityId: string;
  otherCity: string;
  district: string;
  address: string;
  notes: string;
};

export type OrderItemInput = { productId: string; color: string; size: string; qty: number };

export type OrderRequest = { customer: CustomerInput; items: OrderItemInput[]; website?: string; attribution?: Record<string, string> };

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Converts Arabic-Indic digits and strips spaces/dashes. */
export function normalizeDigits(value: string) {
  return value.replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d))).replace(/[\s\-()]/g, "");
}

/** Returns a Saudi mobile in +9665XXXXXXXX form, or null if invalid. */
export function normalizeSaudiMobile(raw: string): string | null {
  const v = normalizeDigits(raw);
  const m = v.match(/^(?:\+?966|00966|0)?(5\d{8})$/);
  return m ? `+966${m[1]}` : null;
}

export type FieldErrors = Partial<Record<keyof CustomerInput, string>>;

export function validateCustomer(c: CustomerInput): FieldErrors {
  const e: FieldErrors = {};
  const e2 = t.checkout.errors;
  if (c.name.trim().length < 3 || c.name.trim().length > 80) e.name = e2.name;
  if (!normalizeSaudiMobile(c.phone)) e.phone = e2.phone;
  const isOther = c.cityId === "other";
  if (!c.cityId || (!isOther && !storeConfig.shipping.cities.some((x) => x.id === c.cityId))) e.cityId = e2.city;
  if (isOther && (!storeConfig.shipping.allowOtherCity || c.otherCity.trim().length < 2)) e.otherCity = e2.otherCity;
  if (c.district.trim().length < 2) e.district = e2.district;
  if (c.address.trim().length < 8 || c.address.length > 300) e.address = e2.address;
  return e;
}

export function cityName(c: Pick<CustomerInput, "cityId" | "otherCity">) {
  if (c.cityId === "other") return c.otherCity.trim();
  return storeConfig.shipping.cities.find((x) => x.id === c.cityId)?.name ?? "";
}
