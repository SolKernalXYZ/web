import { cn } from "@/lib/cn";

/**
 * NotFoundArt — a kernel with a missing/severed link, glyph for "this route
 * doesn't resolve". Keeps the chip motif consistent with the brand mark.
 */
export function NotFoundArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden="true" className={cn("h-auto w-52", className)}>
      <circle cx="100" cy="70" r="58" fill="rgb(var(--accent) / 0.06)" />
      {/* left module */}
      <rect x="26" y="52" width="40" height="36" rx="8" fill="rgb(var(--bg-elevated))" stroke="rgb(var(--border-strong))" strokeWidth="1.5" />
      <circle cx="46" cy="70" r="3" fill="rgb(var(--text-tertiary))" />
      {/* right kernel */}
      <rect x="134" y="48" width="44" height="44" rx="10" fill="rgb(var(--bg-elevated))" stroke="rgb(var(--border-strong))" strokeWidth="1.5" />
      <rect x="146" y="60" width="20" height="20" rx="5" transform="rotate(45 156 70)" stroke="rgb(var(--accent))" strokeWidth="1.5" />
      {/* severed link */}
      <path d="M66 70h22" stroke="rgb(var(--border-strong))" strokeWidth="1.5" />
      <path d="M112 70h22" stroke="rgb(var(--border-strong))" strokeWidth="1.5" />
      <path d="M93 62l5 8M107 62l-5 8" stroke="rgb(var(--danger))" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * ErrorArt — a kernel emitting a fault pulse. Communicates a runtime error.
 */
export function ErrorArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden="true" className={cn("h-auto w-52", className)}>
      <circle cx="100" cy="70" r="56" fill="rgb(var(--danger) / 0.07)" />
      <circle cx="100" cy="70" r="40" stroke="rgb(var(--danger) / 0.4)" strokeWidth="1.4" strokeDasharray="4 6" />
      <rect x="74" y="44" width="52" height="52" rx="12" fill="rgb(var(--bg-elevated))" stroke="rgb(var(--danger))" strokeWidth="1.6" />
      <path d="M100 58v16" stroke="rgb(var(--danger))" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="100" cy="84" r="1.6" fill="rgb(var(--danger))" />
      <g stroke="rgb(var(--border-strong))" strokeWidth="1.5" strokeLinecap="round">
        <path d="M100 36v8M100 96v8M66 70h8M126 70h8" />
      </g>
    </svg>
  );
}
