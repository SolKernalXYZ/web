import { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * EmptyStateArt — an empty kernel slot: a dashed module with a faint node
 * lattice and a search glint. Signals "nothing here yet" without a stock image.
 */
export function EmptyStateArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" aria-hidden="true" className={cn("h-auto w-40", className)}>
      <rect x="24" y="20" width="112" height="80" rx="10" stroke="rgb(var(--border-strong))" strokeWidth="1.5" strokeDasharray="5 6" />
      <g stroke="rgb(var(--border))" strokeWidth="1.2">
        <path d="M24 47h112M24 73h112M52 20v80M108 20v80" />
      </g>
      {[
        [52, 47], [108, 47], [52, 73], [108, 73],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.4" fill="rgb(var(--border-strong))" />
      ))}
      <circle cx="80" cy="60" r="18" fill="rgb(var(--bg-elevated))" stroke="rgb(var(--accent))" strokeWidth="1.8" />
      <path d="M86 66l7 7" stroke="rgb(var(--accent))" strokeWidth="2" strokeLinecap="round" />
      <circle cx="80" cy="60" r="9" stroke="rgb(var(--accent))" strokeWidth="1.4" opacity="0.5" />
    </svg>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  /** Optional custom artwork (e.g. a Lottie). Falls back to the static SVG. */
  art?: ReactNode;
}

export default function EmptyState({ title, description, action, className, art }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 px-6 py-16 text-center", className)}>
      {art ?? <EmptyStateArt />}
      <div className="space-y-1.5">
        <p className="font-mono text-h3 font-semibold text-text-primary">{title}</p>
        {description && <p className="mx-auto max-w-sm text-small text-text-secondary">{description}</p>}
      </div>
      {action}
    </div>
  );
}
