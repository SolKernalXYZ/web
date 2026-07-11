import Link from 'next/link';
import { prisma } from '@/lib/db';
import Button from '@/components/Button';
import StatBox from '@/components/StatBox';
import Reveal from '@/components/Reveal';
import Logo from '@/components/Logo';
import MintScanner from '@/components/MintScanner';
import { GridBackdrop, GlowOrb, SectionDivider } from '@/components/graphics/Decor';
import RoadmapSection from '@/components/RoadmapSection';
import {
  SkillsIcon, RunIcon, StakeIcon, SubmitIcon,
  RegistryIcon, BlinkIcon, YieldIcon, ReceiptIcon, RouterIcon, ComposeIcon,
  ArrowRight, SparkIcon,
} from '@/components/icons';

const navCards = [
  { href: '/skills', title: 'Skills', ext: 'db', Icon: SkillsIcon, desc: 'Browse decision tools. Prefer Live data skills that pull chain & market signals.' },
  { href: '/skills/rug-risk-scanner', title: 'Scan', ext: 'exe', Icon: RunIcon, desc: 'Paste a mint. Get a structured rug / risk brief in seconds — free trial, no wallet.' },
  { href: '/stake', title: 'Stake', ext: 'db', Icon: StakeIcon, desc: 'Staking vaults are next. Planned: earn a share of protocol execution fees in $SKRN.' },
  { href: '/submit', title: 'Submit', ext: 'md', Icon: SubmitIcon, desc: 'Publish a tool-using skill. Set pricing. Prepare to earn per execution.' },
];

const features = [
  { Icon: RegistryIcon, title: 'Live-data skills', desc: 'Prefer skills that call Solana + market tools — mint authorities, balances, prices — not generic chat wrappers.' },
  { Icon: BlinkIcon, title: 'Free guest trial', desc: 'Run without a wallet (rate-limited). Connect later for identity when paid settlement ships.' },
  { Icon: YieldIcon, title: 'Fee design', desc: 'Target split when settlement is live: builder / stakers / protocol. No fake APY today.' },
  { Icon: ReceiptIcon, title: 'Shareable receipts', desc: 'Every run gets a public /r/ link with highlights + Post on X. On-chain hashes come next.' },
  { Icon: RouterIcon, title: 'Multi-provider LLM', desc: 'Route to Cloudflare Workers AI, Google Gemini, Grok (xAI), or Groq. Mock fallback when keys are missing.' },
  { Icon: ComposeIcon, title: 'Mint-first wedge', desc: 'Homepage scanner and rug tools first. Pipelines and full OS composition later.' },
];

const steps = [
  { n: '01', title: 'Paste a mint (or wallet)', desc: 'Start on the homepage scanner or any Live data skill. No wallet required for free trial.' },
  { n: '02', title: 'Desk runs tools + LLM', desc: 'SolKernal pulls chain/market data where the skill allows, then structures a decision-ready brief.' },
  { n: '03', title: 'Get score + full output', desc: 'Risk highlights when parseable, full markdown/JSON below. Mock vs live is always labeled.' },
  { n: '04', title: 'Share the receipt', desc: 'Public /r/ link + Post on X. Fee settlement and on-chain proofs ship after the loop works.' },
];

const tiers = [
  { hold: 'Hold $SKRN', perk: 'Planned: free daily runs & rate limits' },
  { hold: 'Builders', perk: 'Planned: rank boost for staked listings' },
  { hold: 'Stakers', perk: 'Fee share only after real on-chain volume' },
];

// Revalidate landing stats at most once per minute (ISR) so the figures stay
// reasonably fresh without a database hit on every request.
export const revalidate = 60;

/** Compact number formatter: 342500000 → "342.5M", 28420.5 → "28.4K". */
function compact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

async function getStats() {
  // Live values from the database; fall back to zeros if the DB is unreachable
  // so the landing page never crashes and never shows fabricated figures.
  try {
    const [skillCount, stats] = await Promise.all([
      prisma.skill.count({ where: { active: true } }),
      prisma.protocolStats.findUnique({ where: { id: 'global' } }),
    ]);
    return {
      skillCount,
      totalStaked: stats?.totalStaked ?? 0,
      totalDistributed: stats?.totalDistributed ?? 0,
      uniqueStakers: stats?.uniqueStakers ?? 0,
    };
  } catch {
    return { skillCount: 0, totalStaked: 0, totalDistributed: 0, uniqueStakers: 0 };
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="overflow-x-clip">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative isolate">
        <GridBackdrop />
        <div className="mx-auto grid max-w-content items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-tiny font-medium uppercase tracking-[0.14em] text-text-secondary">
              <SparkIcon size={13} className="text-accent" />
              Solana decision tools · free trial
            </span>
            <h1 className="mt-5 animate-fade-up text-display font-bold leading-[1.02] [animation-delay:60ms]">
              Don&apos;t ape blind.<br />
              <span className="text-brand-gradient">Run the desk.</span>
            </h1>
            <p className="mt-6 max-w-prose animate-fade-up text-body-lg text-text-secondary [animation-delay:120ms]">
              Paste a mint or wallet — get live-data risk, authorities, and signal in seconds. Marketplace and
              multi-provider LLM are live; on-chain fee settlement is next.
            </p>
            <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:180ms]">
              <Link href="/skills/rug-risk-scanner">
                <Button variant="accent" size="lg" trailingIcon={<ArrowRight size={18} />}>
                  Open rug scanner
                </Button>
              </Link>
              <Link href="/skills">
                <Button variant="secondary" size="lg">Browse skills</Button>
              </Link>
            </div>
            <dl className="mt-12 grid animate-fade-up grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border [animation-delay:240ms]">
              {[
                { v: String(stats.skillCount), l: 'Skills listed' },
                { v: 'Free', l: 'Guest trial' },
                { v: 'Live', l: 'Chain tools' },
              ].map((s) => (
                <div key={s.l} className="bg-bg-primary px-4 py-4">
                  <dd className="font-mono text-h2 tabular-nums text-text-primary">{s.v}</dd>
                  <dt className="mt-0.5 text-tiny font-medium uppercase tracking-[0.12em] text-text-tertiary">{s.l}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative animate-scale-in [animation-delay:120ms]">
            <GlowOrb className="left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2" />
            <MintScanner />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content space-y-section px-4 pb-section-lg sm:px-6">
        {/* ── Nav cards ───────────────────────────────────── */}
        <section className="grid gap-4 sm:grid-cols-2">
          {navCards.map((c, i) => (
            <Reveal key={c.href} index={i}>
              <Link href={c.href} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded-lg">
                <div className="lift flex h-full items-start gap-4 rounded-lg border border-border bg-bg-subtle p-5 hover:border-border-focused hover:shadow-md">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-bg-primary text-accent transition-colors group-hover:border-accent">
                    <c.Icon size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-body font-semibold text-text-primary">
                        {c.title}<span className="text-text-tertiary">.{c.ext}</span>
                      </span>
                      <ArrowRight size={16} className="text-text-tertiary transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5 group-hover:text-accent" />
                    </div>
                    <p className="mt-2 text-small text-text-secondary">{c.desc}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </section>

        {/* ── Token ───────────────────────────────────────── */}
        <section id="token" className="scroll-mt-20">
          <Reveal>
            <div className="relative overflow-hidden rounded-xl border border-border bg-bg-subtle p-6 sm:p-8">
              <GlowOrb className="right-[-40px] top-[-40px] h-48 w-48" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_1.1fr]">
                <div>
                  <p className="font-mono text-tiny uppercase tracking-[0.16em] text-text-tertiary">$SKRN Token</p>
                  <h2 className="mt-3 text-h2">Utility after product, not before.</h2>
                  <p className="mt-3 text-body text-text-secondary">
                    $SKRN is the protocol token. Hold / stake perks (free runs, discounts, builder rank) ship as
                    fee volume and vaults go live — no fake yield today.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <a
                      href={`https://pump.fun/coin/${process.env.NEXT_PUBLIC_SKRN_MINT_ADDRESS || '9LnqE9nevGsDHqs7bhJSyMzXwxdQJ2x4ypJNreEZpump'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary" trailingIcon={<ArrowRight size={16} />}>Buy on Pump.fun</Button>
                    </a>
                    <span className="max-w-full break-all font-mono text-mono-sm text-text-tertiary">
                      Mint: {process.env.NEXT_PUBLIC_SKRN_MINT_ADDRESS || '9LnqE9nevGsDHqs7bhJSyMzXwxdQJ2x4ypJNreEZpump'}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {tiers.map((t) => (
                    <li key={t.hold} className="flex items-center gap-3 rounded-lg border border-border bg-bg-primary px-4 py-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-subtle text-accent">
                        <YieldIcon size={16} />
                      </span>
                      <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3">
                        <span className="font-mono text-body font-semibold text-text-primary">{t.hold}</span>
                        <span className="text-small text-text-secondary">{t.perk}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Problem / Solution ──────────────────────────── */}
        <section className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-xl border border-border bg-bg-subtle p-6 sm:p-8">
              <Badgeish tone="danger">The Problem</Badgeish>
              <div className="mt-4 space-y-3 text-body text-text-secondary">
                <p>AI execution is fragmented. Every tool has its own interface, billing, and auth. Developers rebuild the same prompt wrappers. Users pay subscriptions for tools they use once.</p>
                <p>The result: thousands of AI wrappers that can&apos;t talk to each other, no on-chain proof of execution, and zero value accrual to the people who build the best prompts.</p>
              </div>
            </div>
          </Reveal>
          <Reveal index={1}>
            <div className="h-full rounded-xl border border-accent/30 bg-accent-subtle/40 p-6 sm:p-8">
              <Badgeish tone="accent">Our Solution</Badgeish>
              <div className="mt-4 space-y-3 text-body text-text-secondary">
                <p>SolKernal is building an operating system for AI skills on Solana. A skill is a versioned prompt bundle with defined inputs, pricing, and LLM routing — registered in the app today, moving on-chain next.</p>
                <p>Anyone can publish and execute from the web app. Staking yield and Blinks are designed into the protocol and will ship as on-chain programs land. One marketplace, multi-provider routing, transparent fee design.</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── How it works ────────────────────────────────── */}
        <section id="how-it-works" className="scroll-mt-20">
          <Reveal>
            <SectionHeading eyebrow="Lifecycle" title="How it works" />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} index={i}>
                <div className="relative flex h-full flex-col rounded-xl border border-border bg-bg-subtle p-5">
                  <span className="font-mono text-h2 text-accent/70">{s.n}</span>
                  <p className="mt-3 font-semibold text-text-primary">{s.title}</p>
                  <p className="mt-1.5 text-small text-text-secondary">{s.desc}</p>
                  {i < steps.length - 1 && (
                    <ArrowRight size={16} className="absolute -right-2 top-7 hidden text-text-tertiary lg:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Features ────────────────────────────────────── */}
        <section id="features" className="scroll-mt-20">
          <Reveal>
            <SectionHeading eyebrow="Capabilities" title="Built for composable AI" />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} index={i % 3}>
                <div className="group h-full rounded-xl border border-border bg-bg-subtle p-6 transition-colors hover:border-border-focused">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-bg-primary text-accent transition-colors group-hover:border-accent">
                    <f.Icon size={20} />
                  </span>
                  <p className="mt-4 font-semibold text-text-primary">{f.title}</p>
                  <p className="mt-2 text-small text-text-secondary">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Roadmap ──────────────────────────────────────── */}
        <RoadmapSection />

        <SectionDivider />

        {/* ── Staking preview ─────────────────────────────── */}
        <section>
          <Reveal>
            <div className="relative overflow-hidden rounded-xl border border-border bg-bg-subtle p-6 sm:p-8">
              <GlowOrb className="left-[-40px] bottom-[-60px] h-56 w-56" />
              <div className="relative">
                <SectionHeading eyebrow="Real Yield" title="Stake & earn" />
                <p className="mt-3 max-w-prose text-body text-text-secondary">
                  Planned design: stake $SKRN into a protocol vault. When on-chain fee settlement is live, a share of
                  each execution fee flows to stakers pro-rata. Staking UI is intentionally disabled until programs ship.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <StatBox value={`${compact(stats.totalStaked)}`} label="$SKRN Staked" icon={<StakeIcon size={16} />} />
                  <StatBox value={`${compact(stats.totalDistributed)}`} label="Distributed" positive icon={<YieldIcon size={16} />} />
                  <StatBox value={stats.uniqueStakers.toLocaleString()} label="Stakers" icon={<ReceiptIcon size={16} />} />
                </div>
                <div className="mt-6">
                  <Link href="/stake">
                    <Button trailingIcon={<ArrowRight size={16} />}>Start staking</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Final CTA ───────────────────────────────────── */}
        <section>
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-2xl border border-border bg-bg-inverse px-6 py-14 text-center sm:px-8">
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-sm opacity-20" />
              <div className="flex justify-center">
                <Logo size={40} gradient />
              </div>
              <h2 className="mt-6 text-h1 text-text-inverse">Scan first. Build next.</h2>
              <p className="mx-auto mt-3 max-w-prose text-body text-text-inverse/70">
                Run a free mint scan now. When you&apos;re ready, publish a tool-using skill and prepare for paid
                settlement.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/skills/rug-risk-scanner">
                  <Button variant="accent" size="lg" trailingIcon={<ArrowRight size={18} />}>Run free scan</Button>
                </Link>
                <Link href="/skills">
                  <Button size="lg" variant="primary" className="bg-transparent border-text-inverse/25 hover:bg-text-inverse/10">
                    Explore the marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}

/* Local presentational helpers (kept colocated; only used on this page) */
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="font-mono text-tiny uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
      <h2 className="mt-2 text-h2">{title}</h2>
    </div>
  );
}

function Badgeish({ tone, children }: { tone: 'danger' | 'accent'; children: React.ReactNode }) {
  const cls =
    tone === 'danger'
      ? 'bg-danger-subtle text-danger'
      : 'bg-accent-subtle text-accent';
  return (
    <span className={`inline-flex items-center rounded-tag px-2.5 py-1 text-tiny font-semibold uppercase tracking-[0.14em] ${cls}`}>
      {children}
    </span>
  );
}
