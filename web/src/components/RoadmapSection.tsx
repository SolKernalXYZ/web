import Link from "next/link";
import Reveal from "./Reveal";
import { CheckIcon, SparkIcon, ArrowRight } from "./icons";
import {
  ROADMAP_TAGLINE,
  ROADMAP_UPDATED,
  roadmapPhases,
  type RoadmapPhaseId,
} from "@/lib/roadmap";

const phaseStyle: Record<
  RoadmapPhaseId,
  { color: string; bar: string; progress: string }
> = {
  shipped: { color: "text-success", bar: "bg-success", progress: "100%" },
  building: { color: "text-accent", bar: "bg-accent", progress: "45%" },
  next: { color: "text-warning", bar: "bg-warning", progress: "20%" },
  later: { color: "text-text-tertiary", bar: "bg-text-tertiary/40", progress: "8%" },
};

const statusIcons: Record<RoadmapPhaseId, string> = {
  shipped: "M5 13l4 4L19 7",
  building: "M12 5v14M5 12h14",
  next: "M13 5l7 7-7 7M5 12h14",
  later: "M12 8v8M8 12h8",
};

function PhaseIcon({ id }: { id: RoadmapPhaseId }) {
  const d = statusIcons[id];
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="scroll-mt-20">
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="hairline flex-1" />
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-4 py-1.5 font-mono text-tiny uppercase tracking-[0.16em] text-accent">
            <SparkIcon size={13} />
            Product roadmap
          </span>
          <span className="hairline flex-1" />
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-h2">What we ship next</h2>
          <p className="mx-auto mt-2 max-w-2xl text-body text-text-secondary">
            {ROADMAP_TAGLINE}
          </p>
          <p className="mt-2 font-mono text-mono-sm text-text-tertiary">
            Updated {ROADMAP_UPDATED} · Full detail in{" "}
            <Link href="/docs/roadmap" className="text-accent underline-offset-2 hover:underline">
              docs
            </Link>
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {roadmapPhases.map((phase, pi) => {
          const style = phaseStyle[phase.id];
          const isShipped = phase.id === "shipped";
          return (
            <Reveal key={phase.id} index={pi}>
              <div className="group relative flex h-full flex-col rounded-xl border border-border bg-bg-subtle p-5 transition-colors hover:border-border-focused sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div>
                    <div className={`flex items-center gap-2 ${style.color}`}>
                      <PhaseIcon id={phase.id} />
                      <span className="font-mono text-lg font-bold tracking-tight">{phase.status}</span>
                    </div>
                    <p className="mt-0.5 text-tiny font-medium uppercase tracking-[0.12em] text-text-tertiary">
                      {phase.label}
                    </p>
                  </div>
                  <span
                    className={`flex h-7 min-w-7 items-center justify-center rounded-full border border-border px-2 text-tiny font-semibold tabular-nums ${style.color}`}
                  >
                    {phase.items.length}
                  </span>
                </div>

                <p className="mb-4 text-small text-text-secondary">{phase.summary}</p>

                <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-border-subtle">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out-expo ${style.bar}`}
                    style={{ width: style.progress }}
                  />
                </div>

                <ul className="flex-1 space-y-2.5">
                  {phase.items.map((item) => (
                    <li key={item.title} className="flex items-start gap-2.5 text-small">
                      {isShipped ? (
                        <CheckIcon size={14} className="mt-0.5 shrink-0 text-success" />
                      ) : (
                        <span className={`mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full ${style.bar}`} />
                      )}
                      <span className={isShipped ? "text-text-secondary" : "text-text-tertiary"}>
                        <span className="font-medium text-text-primary">{item.title}</span>
                        <span className="mt-0.5 block text-mono-sm leading-snug text-text-tertiary">
                          {item.detail}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/docs/roadmap"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-primary px-4 py-2.5 text-small font-medium text-text-secondary transition-colors hover:border-border-focused hover:text-text-primary"
          >
            Read full roadmap
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/skills/rug-risk-scanner"
            className="inline-flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2.5 text-small font-semibold text-accent-text transition-colors hover:bg-accent-hover"
          >
            Try a shipped skill
            <ArrowRight size={14} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
