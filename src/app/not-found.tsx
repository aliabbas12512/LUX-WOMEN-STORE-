import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-latin text-6xl text-champagne-deep">404</p>
      <h1 className="mt-4 font-display text-3xl">الصفحة غير موجودة</h1>
      <p className="mt-3 text-[0.92rem] leading-7 text-muted">ربما تغيّر الرابط أو لم يعد هذا المنتج متاحاً. يسعدنا أن نرشدكِ إلى مجموعتنا.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">العودة إلى الرئيسية</ButtonLink>
        <ButtonLink href="/collections/all" variant="outline">
          تسوّقي الكل
        </ButtonLink>
      </div>
    </section>
  );
}
