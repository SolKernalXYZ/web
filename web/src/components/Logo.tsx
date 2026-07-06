import { cn } from "@/lib/cn";

interface LogoProps {
  /** Pixel size of the square mark. */
  size?: number;
  /** Show the "SOLKERNAL" wordmark next to the mark. */
  withWordmark?: boolean;
  /** Paint the mark with the Solana brand gradient (brand moments only). */
  gradient?: boolean;
  className?: string;
}

/**
 * The SolKernal mark: a compute "kernel" chip — an outer module, a rotated
 * inner core, a live center node, and four I/O pins. Communicates an on-chain
 * operating system that routes execution in and out. Uses currentColor so it
 * adapts to theme unless `gradient` is set for hero/brand placements.
 */
export default function Logo({ size = 24, withWordmark = false, gradient = false, className }: LogoProps) {
  const stroke = gradient ? "url(#sk-grad)" : "currentColor";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {gradient && (
          <defs>
            <linearGradient id="sk-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9945FF" />
              <stop offset="0.5" stopColor="#7C3AED" />
              <stop offset="1" stopColor="#14F195" />
            </linearGradient>
          </defs>
        )}
        {/* Outer module */}
        <rect x="4.5" y="4.5" width="23" height="23" rx="6" stroke={stroke} strokeWidth="1.6" />
        {/* Rotated inner core */}
        <rect x="16" y="9.4" width="9.3" height="9.3" rx="2" transform="rotate(45 16 16)" stroke={stroke} strokeWidth="1.6" />
        {/* Live center node */}
        <circle cx="16" cy="16" r="2.4" fill={stroke} />
        {/* I/O pins */}
        <path d="M16 1.6V4.5M16 27.5v2.9M1.6 16H4.5M27.5 16h2.9" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {withWordmark && (
        <span className="font-mono text-small font-semibold uppercase tracking-[0.18em]">
          SolKernal
        </span>
      )}
    </span>
  );
}
