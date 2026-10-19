import { PageHeader } from "@/components/layout/PageHeader";
import type { Policy } from "@/content/policies";

const dateFmt = new Intl.DateTimeFormat("ar-SA-u-nu-latn-ca-gregory", { day: "numeric", month: "long", year: "numeric" });

export function PolicyPage({ policy }: { policy: Policy }) {
  return (
    <article className="mx-auto max-w-3xl px-5 md:px-8">
      <PageHeader eyebrow={policy.eyebrow} title={policy.title} description={policy.description} />
      <div className="space-y-10">
        {policy.sections.map((s, i) => (
          <section key={s.heading} className="grid gap-3 md:grid-cols-[180px_1fr] md:gap-10">
            <h2 className="flex items-baseline gap-3 font-display text-[1.3rem]">
              <span className="font-latin text-[0.95rem] text-champagne-deep" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.heading}
            </h2>
            <div className="text-[0.92rem] leading-8 text-muted">{s.body}</div>
          </section>
        ))}
      </div>
      <p className="mt-14 border-t border-line pt-6 text-[0.76rem] text-muted">آخر تحديث: {dateFmt.format(new Date(policy.updated))}</p>
    </article>
  );
}
