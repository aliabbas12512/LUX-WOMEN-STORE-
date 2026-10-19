import { storeConfig } from "@/config/store";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

/** Customer-facing delivery / returns sentences derived from configuration only. */
export function deliveryText(product?: Product) {
  const est = product?.deliveryDays ?? storeConfig.shipping.estimateDays;
  return est
    ? `يصلكِ الطلب خلال ${est.min}–${est.max} أيام عمل بعد تأكيده.`
    : "يُحدَّد موعد التوصيل ويُؤكَّد معكِ عند تأكيد الطلب.";
}

export function deliveryFeeText() {
  const { defaultFee, freeShippingThreshold } = storeConfig.shipping;
  const fee = `رسوم التوصيل ${formatPrice(defaultFee)}`;
  return freeShippingThreshold !== null ? `${fee}، ومجاناً للطلبات من ${formatPrice(freeShippingThreshold)}.` : `${fee}.`;
}

export function returnsText() {
  const { windowDays, returnShippingPaidBy } = storeConfig.returns;
  return `يمكنكِ طلب الاستبدال أو الاسترجاع خلال ${windowDays} أيام من الاستلام للقطع غير المستخدمة وبحالتها الأصلية${
    returnShippingPaidBy === "customer" ? "، وتتحمّلين تكلفة شحن الإرجاع" : "، ونتحمّل تكلفة شحن الإرجاع"
  }.`;
}
