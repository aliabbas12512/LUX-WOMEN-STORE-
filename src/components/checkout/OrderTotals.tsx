import { formatPrice } from "@/lib/format";
import { t } from "@/i18n/ar";

export function OrderTotals({ subtotal, deliveryFee }: { subtotal: number; deliveryFee: number | null }) {
  return (
    <dl className="space-y-3 text-[0.88rem]">
      <div className="flex justify-between">
        <dt className="text-muted">{t.cart.subtotal}</dt>
        <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">{t.cart.delivery}</dt>
        <dd className="tabular-nums">
          {deliveryFee === null ? <span className="text-[0.8rem] text-muted">{t.cart.deliveryAtCheckout}</span> : deliveryFee === 0 ? t.cart.free : formatPrice(deliveryFee)}
        </dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-4">
        <dt className="font-medium">{t.cart.total}</dt>
        <dd className="text-xl font-medium tabular-nums">{formatPrice(subtotal + (deliveryFee ?? 0))}</dd>
      </div>
    </dl>
  );
}
