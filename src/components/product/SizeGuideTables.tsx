import { sizeGuide } from "@/data/size-guide";

export function SizeTable({ kind }: { kind: "abaya" | "dress" }) {
  const chart = sizeGuide[kind];
  return (
    <section>
      <h3 className="font-display text-xl">{chart.title}</h3>
      <p className="mt-2 text-[0.82rem] leading-7 text-muted">{chart.note}</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[360px] text-center text-[0.84rem]">
          <thead className="bg-beige/60">
            <tr>
              {chart.columns.map((c) => (
                <th key={c} scope="col" className="px-3 py-3 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {chart.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="px-3 py-3 font-medium tabular-nums">
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className="px-3 py-3 tabular-nums text-muted">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function HowToMeasure() {
  return (
    <section>
      <h3 className="font-display text-xl">كيف تأخذين قياساتكِ</h3>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {sizeGuide.howToMeasure.map((m) => (
          <div key={m.title} className="rounded-xl bg-ivory-2 p-4">
            <dt className="text-[0.85rem] font-medium">{m.title}</dt>
            <dd className="mt-1.5 text-[0.8rem] leading-6 text-muted">{m.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
