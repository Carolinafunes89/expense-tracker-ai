export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
