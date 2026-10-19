/**
 * Commercial settings: delivery, returns, payment.
 *
 * ⚠️ These values drive prices and promises shown to customers. Replace every
 * value marked "CONFIRM" with your real, agreed terms before launch.
 */

export const currency = "SAR" as const;

export type CityOption = { id: string; name: string; fee?: number };

export const storeConfig = {
  shipping: {
    /** CONFIRM: delivery fee in SAR applied when a city has no specific fee. */
    defaultFee: 30,
    /** CONFIRM: subtotal (SAR) from which delivery is free. `null` disables free delivery. */
    freeShippingThreshold: null as number | null,
    /**
     * CONFIRM: delivery estimate in days once an order is confirmed, or `null`
     * when it is not yet known (the site then says the date is confirmed with the order).
     * A product can override this with its own `deliveryDays`.
     */
    estimateDays: null as { min: number; max: number } | null,
    /** Cities offered in checkout. Add `fee` to override the default for a city. */
    cities: [
      { id: "riyadh", name: "الرياض" },
      { id: "jeddah", name: "جدة" },
      { id: "makkah", name: "مكة المكرمة" },
      { id: "madinah", name: "المدينة المنورة" },
      { id: "dammam", name: "الدمام" },
      { id: "khobar", name: "الخبر" },
      { id: "dhahran", name: "الظهران" },
      { id: "ahsa", name: "الأحساء" },
      { id: "qatif", name: "القطيف" },
      { id: "jubail", name: "الجبيل" },
      { id: "taif", name: "الطائف" },
      { id: "tabuk", name: "تبوك" },
      { id: "buraidah", name: "بريدة" },
      { id: "unaizah", name: "عنيزة" },
      { id: "hail", name: "حائل" },
      { id: "abha", name: "أبها" },
      { id: "khamis", name: "خميس مشيط" },
      { id: "jazan", name: "جازان" },
      { id: "najran", name: "نجران" },
      { id: "yanbu", name: "ينبع" },
      { id: "albaha", name: "الباحة" },
      { id: "arar", name: "عرعر" },
      { id: "sakaka", name: "سكاكا" },
    ] satisfies CityOption[] as CityOption[],
    /** Allow customers to type a city that is not in the list. */
    allowOtherCity: true,
  },

  returns: {
    /** CONFIRM: number of days after delivery to request an exchange/return. */
    windowDays: 7,
    /** CONFIRM: who pays return shipping. */
    returnShippingPaidBy: "customer" as "customer" | "store",
  },

  payment: {
    /**
     * No online payment gateway is integrated. Orders are confirmed with the
     * customer (WhatsApp/phone) and payment is arranged then. If you offer
     * cash on delivery, set this to true so it is mentioned at checkout.
     */
    cashOnDelivery: false,
  },

  order: {
    maxQuantityPerLine: 10,
    referencePrefix: "LX",
  },
} as const;

export function deliveryFeeFor(cityId: string | undefined, subtotal: number): number {
  const { shipping } = storeConfig;
  if (subtotal <= 0) return 0;
  if (shipping.freeShippingThreshold !== null && subtotal >= shipping.freeShippingThreshold) return 0;
  const city = shipping.cities.find((c) => c.id === cityId);
  return city?.fee ?? shipping.defaultFee;
}
