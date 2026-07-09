const items = [
  "Web marketplace live",
  "Multi-provider LLM execution",
  "Mock fallback when keys missing",
  "On-chain settlement coming next",
  "Publish a skill in minutes",
  "Docs at /docs",
  "Built for Solana",
  "v1 web foundation",
];

function Track() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="mx-4 whitespace-nowrap">{t}</span>
          <span className="text-text-inverse/40" aria-hidden="true">◆</span>
        </span>
      ))}
    </div>
  );
}

export default function StatusTicker() {
  return (
    <div
      aria-hidden="true"
      className="relative flex overflow-hidden border-t border-border bg-bg-inverse py-2 font-mono text-mono-sm text-text-inverse/90"
    >
      <div className="flex animate-marquee">
        <Track />
        <Track />
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg-inverse to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg-inverse to-transparent" />
    </div>
  );
}
