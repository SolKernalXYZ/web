export default function SkillsLoading() {
  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <div className="mb-8 space-y-3">
        <div className="h-3 w-20 animate-pulse rounded bg-bg-hover" />
        <div className="h-8 w-64 animate-pulse rounded bg-bg-hover" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-bg-hover" />
      </div>
      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 space-y-4 md:block">
          <div className="h-10 animate-pulse rounded-md bg-bg-hover" />
          <div className="h-40 animate-pulse rounded-lg bg-bg-hover" />
          <div className="h-24 animate-pulse rounded-lg bg-bg-hover" />
        </aside>
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between">
            <div className="h-4 w-16 animate-pulse rounded bg-bg-hover" />
            <div className="h-9 w-32 animate-pulse rounded-md bg-bg-hover" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-lg border border-border bg-bg-subtle p-5">
                <div className="flex justify-between">
                  <div className="h-5 w-16 animate-pulse rounded-tag bg-bg-hover" />
                  <div className="h-4 w-20 animate-pulse rounded bg-bg-hover" />
                </div>
                <div className="h-5 w-3/4 animate-pulse rounded bg-bg-hover" />
                <div className="h-8 animate-pulse rounded bg-bg-hover" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-bg-hover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
