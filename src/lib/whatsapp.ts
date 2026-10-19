import { absoluteUrl, siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";

export function whatsappLink(message: string) {
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function productEnquiryMessage(input: {
  name: string;
  slug: string;
  price: number;
  colorName?: string;
  size?: string;
  qty: number;
}) {
  return [
    "مرحباً، أرغب في طلب هذا المنتج:",
    `• المنتج: ${input.name}`,
    `• المقاس: ${input.size ?? "لم يُحدَّد بعد"}`,
    `• اللون: ${input.colorName ?? "لم يُحدَّد بعد"}`,
    `• الكمية: ${input.qty}`,
    `• السعر: ${formatPrice(input.price)} للقطعة`,
    `• الرابط: ${absoluteUrl(`/products/${input.slug}`)}`,
  ].join("\n");
}

export function orderMessage(order: {
  reference: string;
  name: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  notes?: string;
  items: { name: string; colorName: string; size: string; qty: number; unitPrice: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}) {
  return [
    `مرحباً، أودّ تأكيد طلبي رقم ${order.reference}`,
    "",
    ...order.items.map(
      (i) => `• ${i.name} — ${i.colorName} / مقاس ${i.size} × ${i.qty} = ${formatPrice(i.unitPrice * i.qty)}`,
    ),
    "",
    `المجموع الفرعي: ${formatPrice(order.subtotal)}`,
    `التوصيل: ${order.deliveryFee === 0 ? "مجاني" : formatPrice(order.deliveryFee)}`,
    `الإجمالي: ${formatPrice(order.total)}`,
    "",
    `الاسم: ${order.name}`,
    `الجوال: ${order.phone}`,
    `العنوان: ${order.city} — ${order.district} — ${order.address}`,
    ...(order.notes ? [`ملاحظات: ${order.notes}`] : []),
  ].join("\n");
}
