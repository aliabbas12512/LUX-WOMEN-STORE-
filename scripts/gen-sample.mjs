// One-off generator for the clearly-labelled SAMPLE catalogue used in development.
// Real products should be imported with `npm run catalog:import` instead.
import { writeFileSync } from "node:fs";

const C = {
  black: { id: "black", name: "أسود", hex: "#141312" },
  midnight: { id: "midnight", name: "كحلي داكن", hex: "#1C2233" },
  sand: { id: "sand", name: "رملي", hex: "#CDB79A" },
  ivory: { id: "ivory", name: "عاجي", hex: "#EFE6D8" },
  mocha: { id: "mocha", name: "موكا", hex: "#6E5646" },
  olive: { id: "olive", name: "زيتي", hex: "#5C5A43" },
  wine: { id: "wine", name: "عنابي", hex: "#5A1F2A" },
  rose: { id: "rose", name: "وردي هادئ", hex: "#C9A39A" },
  sage: { id: "sage", name: "أخضر مريمي", hex: "#9AA38D" },
  champagne: { id: "champagne", name: "شامبين", hex: "#D8C3A0" },
  grey: { id: "grey", name: "رمادي فحمي", hex: "#45444A" },
};
const ABAYA = ["52", "54", "56", "58", "60"];
const DRESS = ["S", "M", "L", "XL"];

// stockFn returns stock for (colorIndex, sizeIndex); null = confirmed on order.
const items = [
  ["abaya-crepe-classic", "عباية الكريب الكلاسيكية", "قصّة مستقيمة بانسيابية هادئة", "abayas", "abaya", 389, null, ["black", "midnight"], ABAYA, (c, s) => (c === 0 ? [4, 6, 3, 2, 1][s] : [2, 0, 3, 1, 0][s]), true, "2026-09-28", false,
    "عباية من الكريب بقصّة مستقيمة تنساب بخفّة، بأكمام واسعة وخطوط نظيفة تناسب الإطلالة اليومية الراقية. تصميم هادئ يُكمل حجابكِ ويمنحكِ حضوراً واثقاً.",
    { fabric: "كريب ناعم غير شفاف", care: ["غسيل يدوي أو دورة لطيفة بماء بارد", "كيّ على حرارة منخفضة من الداخل"], length: "حسب المقاس المختار (بالإنش)" }],
  ["abaya-gold-thread", "عباية التطريز الذهبي", "تطريز يدوي رقيق على الأكمام", "abayas", "abaya", 649, null, ["black"], ABAYA, (c, s) => [2, 3, 2, 1, 0][s], true, "2026-10-08", true,
    "عباية سوداء بلمسة تطريز بخيوط ذهبية خافتة على أطراف الأكمام وحافة الفتحة الأمامية، تجمع بين الهدوء والفخامة لمناسباتكِ الخاصة.",
    { fabric: "كريب ثقيل مع تطريز بخيوط معدنية", care: ["تنظيف جاف للحفاظ على التطريز"], notes: ["قد تختلف درجة لمعان الخيط قليلاً بين القطع لأنه منفّذ يدوياً"] }],
  ["abaya-linen-sand", "عباية الكتان الرملية", "خفيفة لأيام الصيف", "abayas", "abaya", 429, 499, ["sand", "ivory"], ABAYA, () => null, false, "2026-08-20", false,
    "عباية مفتوحة من مزيج الكتان بلون رملي دافئ، مثالية للأجواء الحارة مع حزام قماشي اختياري يحدد القوام بلطف.",
    { fabric: "مزيج كتان وفسكوز", care: ["غسيل بماء بارد", "يُفضّل الكيّ والقماش رطب قليلاً"] }],
  ["abaya-kimono-mocha", "عباية الكيمونو بلون الموكا", "أكمام كيمونو واسعة", "abayas", "abaya", 459, null, ["mocha", "black"], ABAYA, (c, s) => [3, 2, 4, 2, 1][s], false, "2026-10-02", false,
    "عباية بقصّة الكيمونو وأكمام منسدلة، بلون موكا عصري يناسب الإطلالات النهارية ويتنسّق بسهولة مع الحجاب الفاتح أو الداكن.",
    null],
  ["abaya-pleated-midnight", "عباية البليسيه الكحلية", "طيّات ناعمة تتحرك معكِ", "abayas", "abaya", 529, null, ["midnight", "black"], ABAYA, (c, s) => (s === 4 ? 0 : 2), false, "2026-09-12", false,
    "عباية بطيّات بليسيه دقيقة على الظهر تمنحها حركة أنيقة عند المشي، بقصّة واسعة مريحة وفتحة أمامية بأزرار مخفية.",
    { fabric: "شيفون مبطّن", care: ["غسيل يدوي بماء بارد", "تعليق مباشرة بعد الغسيل للحفاظ على الطيّات"] }],
  ["abaya-belted-olive", "عباية الحزام الزيتية", "حزام بنفس القماش", "abayas", "abaya", 469, null, ["olive", "black"], ABAYA, () => 0, false, "2026-07-30", false,
    "عباية بلون زيتي عميق مع حزام من نفس القماش يحدّد الخصر، بتفاصيل جيوب جانبية عملية.",
    null],

  ["dress-satin-champagne", "فستان الساتان الشامبين", "قصّة مائلة بأكمام طويلة", "occasion", "dress", 749, null, ["champagne", "rose"], DRESS, (c, s) => [2, 3, 2, 1][s], true, "2026-10-10", false,
    "فستان سهرة من الساتان بقصّة مائلة تنساب على القوام، بأكمام طويلة وياقة مرتفعة محتشمة. لمعة هادئة تليق بالأعراس والمناسبات المسائية.",
    { fabric: "ساتان مطفي مع بطانة", care: ["تنظيف جاف فقط"] }],
  ["dress-velvet-wine", "فستان المخمل العنابي", "خصر محدد وتنورة واسعة", "occasion", "dress", 829, 960, ["wine", "midnight"], DRESS, (c, s) => [1, 2, 1, 0][s], false, "2026-09-05", true,
    "فستان من المخمل الناعم بلون عنابي غني، بخصر محدد وتنورة واسعة تتحرك برقي. تفاصيل تطريز خفيفة عند الأكمام.",
    null],
  ["dress-chiffon-sage", "فستان الشيفون المريمي", "طبقات خفيفة متدرجة", "dresses", "dress", 589, null, ["sage", "rose"], DRESS, () => null, false, "2026-09-18", false,
    "فستان طويل من الشيفون بطبقات متدرجة وبطانة كاملة، بلون أخضر مريمي ناعم يناسب العزائم النهارية والمناسبات العائلية.",
    { fabric: "شيفون مع بطانة كاملة", care: ["غسيل يدوي بماء بارد"] }],
  ["dress-crepe-ivory", "فستان الكريب العاجي", "بساطة راقية لكل الأوقات", "dresses", "dress", 549, null, ["ivory", "black"], DRESS, (c, s) => [3, 4, 3, 2][s], true, "2026-08-28", false,
    "فستان كريب بقصّة نظيفة وأكمام طويلة وحزام رفيع، يمكن ارتداؤه بإطلالة كلاسيكية أو تنسيقه مع عباية مفتوحة.",
    null],
  ["dress-pleated-mocha", "فستان البليسيه بلون الموكا", "تنورة بليسيه منسدلة", "dresses", "dress", 619, null, ["mocha", "grey"], DRESS, (c, s) => (c === 1 ? 0 : [2, 2, 1, 1][s]), false, "2026-10-12", false,
    "فستان بتنورة بليسيه منسدلة وجزء علوي محتشم بأكمام طويلة، بلون موكا دافئ يناسب الإطلالات المسائية الهادئة.",
    null],

  ["kaftan-everyday-sand", "قفطان اليوم الرملي", "واسع ومريح للبيت والزيارات", "everyday", "kaftan", 299, null, ["sand", "sage"], DRESS, () => null, false, "2026-09-22", false,
    "قفطان واسع بخامة ناعمة وأكمام عريضة، يجمع بين الراحة والأناقة للزيارات العائلية والإطلالة اليومية.",
    null],
  ["kaftan-linen-ivory", "قفطان الكتان العاجي", "خفيف وعملي", "everyday", "kaftan", 329, 379, ["ivory", "olive"], DRESS, (c, s) => [3, 3, 2, 1][s], true, "2026-08-15", false,
    "قفطان من مزيج الكتان بلون عاجي، بفتحة رقبة بسيطة وجيوب جانبية، مثالي للأيام الحارة.",
    { fabric: "مزيج كتان وقطن", care: ["غسيل بالغسالة على دورة لطيفة"] }],
  ["set-everyday-grey", "طقم البلوزة والتنورة الرمادي", "قطعتان تنسقينها بطرق مختلفة", "everyday", "dress", 359, null, ["grey", "black"], DRESS, (c, s) => [2, 3, 3, 0][s], false, "2026-10-05", false,
    "طقم من قطعتين: بلوزة طويلة بأكمام واسعة وتنورة متوسطة الاتساع، بخامة عملية لا تتجعد بسهولة.",
    null],

  ["abaya-occasion-embellished", "عباية المناسبات المرصّعة", "تفاصيل لامعة على الأكتاف", "abayas", "abaya", 899, null, ["black"], ABAYA, (c, s) => [1, 1, 2, 1, 0][s], false, "2026-10-14", true,
    "عباية سهرة سوداء بتفاصيل لامعة ناعمة على الأكتاف والأكمام، بقصّة فراشة واسعة تمنحكِ حضوراً مميزاً في المناسبات.",
    null],
  ["kaftan-occasion-midnight", "قفطان السهرة الكحلي", "تطريز على الصدر", "occasion", "kaftan", 689, null, ["midnight", "wine"], DRESS, () => null, false, "2026-09-30", true,
    "قفطان سهرة بلون كحلي عميق مع تطريز بخيوط شامبين على الصدر والأكمام، بقصّة واسعة مريحة لجلسات المناسبات الطويلة.",
    null],
];

const products = items.map(([slug, name, subtitle, category, garment, price, compareAt, colorIds, sizes, stockFn, bestSeller, createdAt, artTrim, description, details], i) => ({
  id: `sample-${String(i + 1).padStart(3, "0")}`,
  slug,
  name,
  subtitle,
  description,
  category,
  garment,
  price,
  compareAtPrice: compareAt,
  colors: colorIds.map((c) => C[c]),
  sizes,
  variants: colorIds.flatMap((c, ci) => sizes.map((s, si) => ({ color: c, size: s, stock: stockFn(ci, si) }))),
  images: [],
  details,
  sizeChart: sizes === ABAYA ? "abaya" : "dress",
  deliveryDays: null,
  bestSeller,
  createdAt: `${createdAt}T09:00:00.000Z`,
  sample: true,
  artTrim,
}));

writeFileSync(new URL("../src/data/products.json", import.meta.url), JSON.stringify(products, null, 2) + "\n");
console.log(`Wrote ${products.length} sample products`);
