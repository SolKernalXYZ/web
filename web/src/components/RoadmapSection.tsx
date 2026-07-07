import Reveal from "./Reveal";
import { CheckIcon, SparkIcon } from "./icons";

const phases = [
  {
    status: "Now",
    color: "text-success",
    bar: "bg-success",
    ring: "ring-success/30",
    label: "Live on mainnet",
    items: [
      "Skill marketplace with search, filter, sort",
      "Skill detail pages with execution history",
      "Real LLM execution (Cloudflare Workers AI)",
      "Mock fallback for zero-cost development",
      "Phantom wallet integration",
      "Skill submission form",
      "Staking dashboard (UI + mock logic)",
      "Protocol statistics tracking",
      "Responsive design (mobile, tablet, desktop)",
      "Accessibility (WCAG 2.1 Level AA)",
      "SEO optimized with Open Graph metadata",
      "Docker deployment",
      "Vercel-ready",
    ],
  },
  {
    status: "Next",
    color: "text-accent",
    bar: "bg-accent",
    ring: "ring-accent/30",
    label: "Building now",
    items: [
      "Solana smart contracts (Anchor programs)",
      "$SKRN Token-2022 deployment",
      "Real $SKRN payment integration",
      "Solana Blinks/Actions generation",
      "On-chain execution receipts (PDA accounts)",
      "Skill chaining (composable pipelines)",
      "Builder analytics dashboard",
      "Telegram bot integration",
    ],
  },
  {
    status: "Later",
    color: "text-text-tertiary",
    bar: "bg-text-tertiary/40",
    ring: "ring-text-tertiary/15",
    label: "On the horizon",
    items: [
      "Multi-LLM support (OpenAI, Anthropic, Llama, local models)",
      "Skill versioning and upgrades",
      "Skill forking and remixing",
      "Reputation system for builders",
      "Governance (on-chain voting with $SKRN)",
      "Mobile app (React Native)",
      "Enterprise API with SLA guarantees",
    ],
  },
];

const statusIcons: Record<string, string> = {
  "Now": "M5 13l4 4L19 7",
  "Next": "M12 5v14M5 12h14",
  "Later": "M12 8v8M8 12h8",
};

function PhaseIcon({ status }: { status: string }) {
  const d = statusIcons[status] ?? statusIcons["Later"];
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function RoadmapSection() {
  return (
    <section>
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="hairline flex-1" />
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-4 py-1.5 font-mono text-tiny uppercase tracking-[0.16em] text-accent">
            <SparkIcon size={13} />
            Roadmap
          </span>
          <span className="hairline flex-1" />
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-h2">What&apos;s next</h2>
          <p className="mt-2 text-body text-text-secondary">
            From live mainnet to the full protocol vision — here&apos;s what we&apos;re building.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:gap-6">
        {phases.map((phase, pi) => (
          <Reveal key={phase.status} index={pi}>
            <div className="group relative flex h-full flex-col rounded-xl border border-border bg-bg-subtle p-6 transition-colors hover:border-border-focused">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <div className={`flex items-center gap-2 ${phase.color}`}>
                    <PhaseIcon status={phase.status} />
                    <span className="font-mono text-lg font-bold tracking-tight">{phase.status}</span>
                  </div>
                  <p className="mt-0.5 text-tiny font-medium uppercase tracking-[0.12em] text-text-tertiary">
                    {phase.label}
                  </p>
                </div>
                <span className={`flex h-7 min-w-7 items-center justify-center rounded-full border border-border px-2 text-tiny font-semibold tabular-nums ${phase.color}`}>
                  {phase.items.length}
                </span>
              </div>

              <div className={`mb-4 h-1 w-full rounded-full bg-border-subtle overflow-hidden`}>
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out-expo ${phase.bar}`}
                  style={{ width: phase.status === "Now" ? "100%" : phase.status === "Next" ? "35%" : "10%" }}
                />
              </div>

              <ul className="flex-1 space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-small text-text-secondary">
                    {phase.status === "Now" ? (
                      <CheckIcon size={14} className="mt-0.5 shrink-0 text-success" />
                    ) : (
                      <span className={`mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full ${phase.bar}`} />
                    )}
                    <span className={phase.status === "Now" ? "" : "text-text-tertiary"}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
