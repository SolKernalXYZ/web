import { cn } from "@/lib/cn";

/**
 * GridBackdrop — a masked blueprint grid + soft accent glow. Sits behind hero
 * and section content to evoke an on-chain "kernel" lattice. Decorative only.
 */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-70" />
      <div
        className="absolute left-1/2 top-[-10%] h-[420px] w-[720px] max-w-[120vw] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgb(var(--accent) / 0.28), transparent)" }}
      />
    </div>
  );
}

/**
 * GlowOrb — a single soft brand-tinted orb for section accents.
 */
export function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      style={{ background: "radial-gradient(closest-side, rgb(var(--accent) / 0.25), transparent)" }}
    />
  );
}

/**
 * SectionDivider — a hairline with a centered kernel node. Marks section
 * boundaries with intent rather than a plain rule.
 */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center gap-3", className)}>
      <span className="hairline flex-1" />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-text-tertiary">
        <rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="7" cy="7" r="1.6" fill="currentColor" />
      </svg>
      <span className="hairline flex-1" />
    </div>
  );
}
