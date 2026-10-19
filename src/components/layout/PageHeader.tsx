export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <header className="pb-10 pt-10 text-center md:pb-14 md:pt-16">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="mt-3 font-display text-[2.3rem] leading-tight md:text-[3.2rem]">{title}</h1>
      {description ? <p className="mx-auto mt-4 max-w-lg text-[0.92rem] leading-7 text-muted">{description}</p> : null}
      <div className="hairline mx-auto mt-8 w-40" />
    </header>
  );
}
