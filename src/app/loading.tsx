export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8" aria-busy="true" aria-label="جارٍ التحميل">
      <div className="h-8 w-48 animate-pulse rounded-full bg-beige" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] animate-pulse rounded-xl bg-beige" style={{ animationDelay: `${i * 80}ms` }} />
            <div className="mt-3 h-3 w-3/4 animate-pulse rounded-full bg-beige" />
            <div className="mt-2 h-3 w-1/3 animate-pulse rounded-full bg-beige" />
          </div>
        ))}
      </div>
    </div>
  );
}
