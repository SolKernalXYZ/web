import { cn } from "@/lib/cn";

/**
 * HeroVisual — an abstract visualization of the SolKernal execution pipeline:
 * multiple skill sources (left) flow INTO the on-chain kernel core (center),
 * which routes to an LLM and emits a signed execution receipt (right).
 * Communicates the core product: a kernel that orchestrates and settles AI
 * skill execution. Pure SVG + CSS animation (no JS) so it stays cheap.
 */
export default function HeroVisual({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      role="img"
      aria-label="Diagram: skill inputs route through the SolKernal kernel to an LLM and produce an on-chain execution receipt"
      className={cn("w-full h-auto", className)}
    >
      <defs>
        <linearGradient id="hv-core" x1="200" y1="120" x2="280" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9945FF" />
          <stop offset="0.55" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#14F195" />
        </linearGradient>
        <radialGradient id="hv-glow" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="rgb(var(--accent))" stopOpacity="0.5" />
          <stop offset="1" stopColor="rgb(var(--accent))" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hv-flow" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="rgb(var(--accent))" stopOpacity="0" />
          <stop offset="0.5" stopColor="rgb(var(--accent))" />
          <stop offset="1" stopColor="rgb(var(--accent))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ambient glow behind the core */}
      <circle cx="240" cy="180" r="120" fill="url(#hv-glow)" className="animate-float" />

      {/* connection lines: sources -> core */}
      <g stroke="rgb(var(--border-strong))" strokeWidth="1.5">
        <path d="M118 90 C 170 90, 175 165, 214 172" />
        <path d="M104 180 C 160 180, 170 180, 214 180" />
        <path d="M118 270 C 170 270, 175 195, 214 188" />
      </g>
      {/* animated data pulses along the input lines */}
      <g stroke="url(#hv-flow)" strokeWidth="2" strokeDasharray="6 14" className="animate-dash-flow">
        <path d="M118 90 C 170 90, 175 165, 214 172" />
        <path d="M104 180 C 160 180, 170 180, 214 180" />
        <path d="M118 270 C 170 270, 175 195, 214 188" />
      </g>

      {/* core -> receipt */}
      <path d="M266 180 H 372" stroke="rgb(var(--border-strong))" strokeWidth="1.5" />
      <path d="M266 180 H 372" stroke="url(#hv-flow)" strokeWidth="2.5" strokeDasharray="6 14" className="animate-dash-flow" />

      {/* skill source nodes */}
      {[
        { x: 70, y: 90, label: "defi" },
        { x: 56, y: 180, label: "code" },
        { x: 70, y: 270, label: "intel" },
      ].map((n) => (
        <g key={n.label}>
          <rect x={n.x} y={n.y - 16} width="48" height="32" rx="7" fill="rgb(var(--bg-hover))" stroke="rgb(var(--border))" strokeWidth="1.5" />
          <text x={n.x + 24} y={n.y + 4} textAnchor="middle" fontSize="11" fontFamily="var(--font-jetbrains), monospace" fill="rgb(var(--text-tertiary))">{n.label}</text>
        </g>
      ))}

      {/* pulse rings around the core */}
      <circle cx="240" cy="180" r="44" stroke="rgb(var(--accent))" strokeWidth="1.5" className="animate-pulse-ring" style={{ transformOrigin: "240px 180px" }} />

      {/* kernel core chip */}
      <g>
        <rect x="206" y="146" width="68" height="68" rx="16" fill="rgb(var(--bg-hover))" stroke="url(#hv-core)" strokeWidth="2" />
        <rect x="222" y="162" width="36" height="36" rx="8" transform="rotate(45 240 180)" fill="none" stroke="url(#hv-core)" strokeWidth="1.6" />
        <circle cx="240" cy="180" r="6" fill="url(#hv-core)" />
        {/* pins */}
        <g stroke="rgb(var(--border-strong))" strokeWidth="1.5" strokeLinecap="round">
          <path d="M240 138v8M240 214v8M198 180h8M274 180h8" />
        </g>
      </g>

      {/* receipt output */}
      <g>
        <rect x="372" y="146" width="56" height="72" rx="8" fill="rgb(var(--bg-hover))" stroke="rgb(var(--border))" strokeWidth="1.5" />
        <path d="M384 164h32M384 176h32M384 188h20" stroke="rgb(var(--text-tertiary))" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="400" cy="204" r="6" fill="none" stroke="rgb(var(--success))" strokeWidth="1.6" />
        <path d="M397 204l2.2 2.2 4-4.4" stroke="rgb(var(--success))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
