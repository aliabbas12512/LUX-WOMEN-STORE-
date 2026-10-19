/**
 * Editable policy content (Arabic). Values such as delivery fees, return window
 * and contact details are pulled from configuration so they stay consistent
 * everywhere. Have these texts reviewed against your actual operations and
 * applicable Saudi regulations before launch.
 */
import Link from "next/link";
import { siteConfig, whatsappEnabled } from "@/config/site";
import { storeConfig } from "@/config/store";
import { formatPrice } from "@/lib/format";

export type PolicySection = { heading: string; body: React.ReactNode };
export type Policy = { title: string; eyebrow: string; description: string; updated: string; sections: PolicySection[] };

const brand = siteConfig.brand.nameAr;
const { shipping, returns } = storeConfig;
const contactLine = (
  <>
    عبر{" "}
    {whatsappEnabled ? "واتساب أو " : ""}
    <Link href="/contact" className="text-ink underline underline-offset-4">
      صفحة التواصل
    </Link>
  </>
);

/** Update when you change a policy. */
const UPDATED = "2026-10-19";

export const policies = {
  shipping: {
    eyebrow: "خدمة العملاء",
    title: "سياسة الشحن والتوصيل",
    description: "كل ما تحتاجين معرفته عن توصيل طلبكِ داخل المملكة.",
    updated: UPDATED,
    sections: [
      {
        heading: "مناطق التوصيل",
        body: (
          <>
            <p>نوصل حالياً إلى المدن التالية داخل المملكة العربية السعودية:</p>
            <p className="mt-3 text-ink">{shipping.cities.map((c) => c.name).join("، ")}.</p>
            {shipping.allowOtherCity ? <p className="mt-3">إن لم تجدي مدينتكِ، يمكنكِ اختيار «مدينة أخرى» عند الطلب وسنؤكد لكِ إمكانية التوصيل قبل الشحن.</p> : null}
          </>
        ),
      },
      {
        heading: "رسوم التوصيل",
        body: (
          <p>
            رسوم التوصيل {formatPrice(shipping.defaultFee)} للطلب
            {shipping.cities.some((c) => c.fee !== undefined) ? "، وقد تختلف لبعض المدن كما يظهر عند إتمام الطلب" : ""}.
            {shipping.freeShippingThreshold !== null ? ` التوصيل مجاني للطلبات التي تبلغ ${formatPrice(shipping.freeShippingThreshold)} أو أكثر.` : ""}{" "}
            تظهر الرسوم النهائية بوضوح في صفحة إتمام الطلب قبل تأكيده.
          </p>
        ),
      },
      {
        heading: "مدة التوصيل",
        body: shipping.estimateDays ? (
          <p>
            يصل الطلب عادةً خلال {shipping.estimateDays.min}–{shipping.estimateDays.max} أيام عمل من تأكيده. قد تختلف المدة لبعض المنتجات وتُذكر في صفحة المنتج، أو في المواسم والعطلات الرسمية.
          </p>
        ) : (
          <p>تختلف مدة التوصيل حسب المنتج والمدينة، ونؤكد لكِ الموعد المتوقع عند التواصل معكِ لتأكيد الطلب وقبل شحنه.</p>
        ),
      },
      {
        heading: "تأكيد الطلب",
        body: <p>بعد إرسال طلبكِ يتواصل معكِ فريقنا لتأكيد المقاس واللون والتوفر والعنوان. لا يُشحن أي طلب قبل تأكيده معكِ.</p>,
      },
      {
        heading: "العنوان والاستلام",
        body: <p>يرجى التأكد من صحة رقم الجوال والعنوان، فشركة الشحن تتواصل معكِ لتنسيق الاستلام. قد يتأخر التوصيل إذا تعذّر التواصل أو كان العنوان غير مكتمل.</p>,
      },
    ],
  },

  returns: {
    eyebrow: "خدمة العملاء",
    title: "سياسة الاستبدال والاسترجاع",
    description: "نريدكِ أن تحبي كل قطعة تصلكِ. وإن لم تناسبكِ، فهذه طريقة الاستبدال والاسترجاع.",
    updated: UPDATED,
    sections: [
      {
        heading: "المدة",
        body: <p>يمكنكِ طلب الاستبدال أو الاسترجاع خلال {returns.windowDays} أيام من تاريخ استلام الطلب.</p>,
      },
      {
        heading: "شروط القبول",
        body: (
          <ul className="list-inside list-disc space-y-2 marker:text-champagne">
            <li>أن تكون القطعة غير مستخدمة وغير مغسولة وبحالتها الأصلية.</li>
            <li>أن تكون البطاقات والملصقات والتغليف الأصلي موجودة.</li>
            <li>ألا تكون القطعة قد خضعت لأي تعديل أو تفصيل بناءً على طلبكِ.</li>
          </ul>
        ),
      },
      {
        heading: "القطع المعيبة أو غير المطابقة",
        body: <p>إذا وصلتكِ قطعة بها عيب أو مختلفة عمّا طلبتِ، تواصلي معنا خلال المدة المحددة مع صور توضيحية، وسنعالج الأمر بالاستبدال أو الاسترجاع دون تحميلكِ تكلفة الشحن.</p>,
      },
      {
        heading: "تكلفة شحن الإرجاع",
        body: (
          <p>
            {returns.returnShippingPaidBy === "customer"
              ? "في حالات الاستبدال أو الاسترجاع لأسباب غير العيوب (مثل تغيير الرأي أو المقاس)، تتحمّلين تكلفة شحن الإرجاع."
              : "نتحمّل تكلفة شحن الإرجاع للطلبات المقبولة."}
          </p>
        ),
      },
      {
        heading: "طريقة الطلب",
        body: <p>تواصلي معنا {contactLine} مع رقم الطلب وسبب الاستبدال أو الاسترجاع، وسنرشدكِ إلى خطوات الإرسال.</p>,
      },
      {
        heading: "استرداد المبلغ",
        body: <p>بعد استلام القطعة والتحقق من مطابقتها للشروط، نعيد المبلغ بنفس طريقة الدفع الأصلية أو بالطريقة المتفق عليها معكِ، ونبلغكِ بموعد إتمام الاسترداد.</p>,
      },
    ],
  },

  privacy: {
    eyebrow: "خصوصيتكِ",
    title: "سياسة الخصوصية",
    description: `كيف يجمع ${brand} بياناتكِ ويستخدمها ويحميها.`,
    updated: UPDATED,
    sections: [
      {
        heading: "البيانات التي نجمعها",
        body: (
          <ul className="list-inside list-disc space-y-2 marker:text-champagne">
            <li>بيانات الطلب: الاسم، رقم الجوال، المدينة والحي والعنوان، والملاحظات التي تكتبينها.</li>
            <li>محتوى الطلب: المنتجات والمقاسات والألوان والكميات.</li>
            <li>بيانات التصفح وقياس الإعلانات (مثل بكسل سناب شات) — فقط بعد موافقتكِ عند طلبها.</li>
            <li>تُحفظ الحقيبة والمفضّلة وسجل طلباتكِ على جهازكِ فقط.</li>
          </ul>
        ),
      },
      {
        heading: "كيف نستخدم بياناتكِ",
        body: <p>نستخدم بياناتكِ لتأكيد طلبكِ وتوصيله والتواصل معكِ بشأنه، ولتحسين خدماتنا، ولقياس أداء إعلاناتنا عند موافقتكِ. لا نبيع بياناتكِ لأي جهة.</p>,
      },
      {
        heading: "مشاركة البيانات",
        body: <p>نشارك فقط ما يلزم لإتمام طلبكِ مع مزوّدي الخدمة مثل شركات الشحن ومزوّد الاستضافة وقاعدة البيانات، ووفق ما تتطلبه الأنظمة المعمول بها.</p>,
      },
      {
        heading: "ملفات تعريف الارتباط والتتبّع",
        body: <p>نستخدم التخزين المحلي في متصفحكِ لحفظ الحقيبة والمفضّلة. أما أدوات قياس الإعلانات فلا تُفعَّل إلا بعد موافقتكِ، ويمكنكِ سحب الموافقة بمسح بيانات الموقع من متصفحكِ.</p>,
      },
      {
        heading: "حقوقكِ",
        body: <p>يحق لكِ طلب الاطلاع على بياناتكِ أو تصحيحها أو حذفها وفق نظام حماية البيانات الشخصية في المملكة العربية السعودية. للتواصل بهذا الشأن راسلينا {contactLine}.</p>,
      },
      {
        heading: "مدة الاحتفاظ",
        body: <p>نحتفظ ببيانات الطلبات للمدة اللازمة لتنفيذها وخدمة ما بعد البيع والوفاء بالمتطلبات النظامية، ثم نحذفها أو نجعلها مجهولة الهوية.</p>,
      },
    ],
  },

  terms: {
    eyebrow: "معلومات قانونية",
    title: "الشروط والأحكام",
    description: `باستخدامكِ موقع ${brand} أو تقديم طلب من خلاله، فإنكِ توافقين على الشروط التالية.`,
    updated: UPDATED,
    sections: [
      {
        heading: "الطلبات والتأكيد",
        body: <p>إرسال الطلب عبر الموقع يُعد طلب شراء، ولا يكتمل إلا بعد تأكيده من قبلنا بالتواصل معكِ. يحق لنا الاعتذار عن تنفيذ طلب في حال عدم توفر المنتج أو تعذّر التوصيل، مع إبلاغكِ بذلك.</p>,
      },
      {
        heading: "الأسعار",
        body: <p>جميع الأسعار بالريال السعودي. تظهر رسوم التوصيل والإجمالي النهائي قبل تأكيد الطلب. في حال وجود خطأ واضح في السعر سنتواصل معكِ قبل تنفيذ الطلب.</p>,
      },
      {
        heading: "الصور والألوان",
        body: <p>نحرص على عرض المنتجات بدقة، لكن قد تختلف درجات الألوان قليلاً حسب إعدادات الشاشة والإضاءة.</p>,
      },
      {
        heading: "الاستبدال والاسترجاع والشحن",
        body: (
          <p>
            تخضع الطلبات لـ{" "}
            <Link href="/returns" className="text-ink underline underline-offset-4">
              سياسة الاستبدال والاسترجاع
            </Link>{" "}
            و
            <Link href="/shipping" className="text-ink underline underline-offset-4">
              سياسة الشحن والتوصيل
            </Link>
            .
          </p>
        ),
      },
      {
        heading: "الملكية الفكرية",
        body: <p>جميع محتويات الموقع من نصوص وتصاميم وشعارات مملوكة لـ{brand} أو مستخدمة بإذن أصحابها، ولا يجوز نسخها أو استخدامها تجارياً دون إذن مسبق.</p>,
      },
      {
        heading: "التواصل",
        body: <p>لأي استفسار حول هذه الشروط تواصلي معنا {contactLine}.</p>,
      },
    ],
  },
} satisfies Record<string, Policy>;
