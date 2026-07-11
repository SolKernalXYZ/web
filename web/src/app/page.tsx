import Link from 'next/link';
import { prisma } from '@/lib/db';
import Button from '@/components/Button';
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
  { href: '/skills', title: 'Skills', ext: 'db', Icon: SkillsIcon, desc: 'Browse listed skills. Prefer Live data tools that call chain & market APIs.' },
  { href: '/skills/rug-risk-scanner', title: 'Scan', ext: 'exe', Icon: RunIcon, desc: 'Paste a mint. Get a structured risk brief — free trial, no wallet. Not financial advice.' },
  { href: '/stake', title: 'Stake', ext: 'db', Icon: StakeIcon, desc: 'Not live. Vaults and fee share are planned only after on-chain settlement exists.' },
  { href: '/submit', title: 'Submit', ext: 'md', Icon: SubmitIcon, desc: 'Publish a skill to the off-chain registry. Paid earnings start when settlement ships.' },
];

const features = [
  { Icon: RegistryIcon, title: 'Live-data skills', desc: 'Skills can call Solana + market tools (mint info, balances, prices). Output quality depends on tools + model.' },
  { Icon: BlinkIcon, title: 'Free guest trial', desc: 'Rate-limited runs without a wallet. Payment is not charged today.' },
  { Icon: YieldIcon, title: 'Fee design (planned)', desc: 'Target split is designed for later on-chain settlement. No staking APY or fee payouts today.' },
  { Icon: ReceiptIcon, title: 'Shareable receipts', desc: 'Each run can get a public /r/ link in the app DB. On-chain receipt hashes are not live yet.' },
  { Icon: RouterIcon, title: 'Multi-provider LLM', desc: 'Cloudflare, Gemini, Grok, or Groq when keys are configured. Mock is labeled if a provider fails.' },
  { Icon: ComposeIcon, title: 'Mint-first wedge', desc: 'Homepage scanner and Solana risk tools first. Full OS composition is later work.' },
];

const steps = [
  { n: '01', title: 'Paste a mint (or wallet)', desc: 'Use the homepage scanner or a Live data skill. Free trial does not require a wallet.' },
  { n: '02', title: 'Tools + LLM run', desc: 'Where enabled, the skill may call chain/market tools, then the model formats a brief.' },
  { n: '03', title: 'Read the output', desc: 'Risk highlights when the model includes them. Mock vs live is labeled. Not financial advice.' },
  { n: '04', title: 'Share the receipt', desc: 'Optional public /r/ link. Fee payment and on-chain proofs are not enforced yet.' },
];

const tiers = [
  { hold: 'Hold $SKRN', perk: 'Utility planned — not active' },
  { hold: 'Builders', perk: 'Listing works; paid splits planned' },
  { hold: 'Stakers', perk: 'Vaults not live — no yield UI' },
];

// Revalidate landing stats at most once per minute (ISR).
export const revalidate = 60;

async function getStats() {
  // Only real counts. Never invent TVL / stakers / distributed.
  try {
    const [skillCount, execCount] = await Promise.all([
      prisma.skill.count({ where: { active: true } }),
      prisma.execution.count(),
    ]);
    return { skillCount, execCount };
  } catch {
    return { skillCount: 0, execCount: 0 };
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
              Paste a mint or wallet for a structured risk brief powered by tools + LLM. Web app is live.
              Payments, staking, and on-chain settlement are not live yet. Not financial advice.
            </p>
            <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:180ms]">
              <Link
                href="/skills/rug-risk-scanner"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-6 text-body font-semibold text-accent-text shadow-sm transition-[opacity,transform] duration-200 hover:bg-accent-hover active:scale-[0.98]"
              >
                Open rug scanner
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/skills"
                className="inline-flex h-12 items-center justify-center rounded-md border border-border-strong bg-transparent px-6 text-body font-semibold text-text-primary transition-colors hover:bg-bg-hover"
              >
                Browse skills
              </Link>
            </div>
            <dl className="mt-12 grid animate-fade-up grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border [animation-delay:240ms]">
              {[
                { v: String(stats.skillCount), l: 'Skills listed' },
                { v: String(stats.execCount), l: 'Runs recorded' },
                { v: 'Off', l: 'Payments / stake' },
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
                  <h2 className="mt-3 text-h2">Token exists. Product utility is not live.</h2>
                  <p className="mt-3 text-body text-text-secondary">
                    $SKRN is the community token on Pump.fun. Free runs, fee discounts, staking, and builder rank are
                    planned — none of those utilities are enforced in the app today.
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
                <p>Solana users still ape mints with thin context. Generic chatbots invent numbers. Traders bounce between explorers, DexScreener, and Twitter.</p>
                <p>We want one place to run decision tools that can pull live chain data — without pretending staking or payments already work.</p>
              </div>
            </div>
          </Reveal>
          <Reveal index={1}>
            <div className="h-full rounded-xl border border-accent/30 bg-accent-subtle/40 p-6 sm:p-8">
              <Badgeish tone="accent">What ships today</Badgeish>
              <div className="mt-4 space-y-3 text-body text-text-secondary">
                <p>A web marketplace of AI skills, multi-provider LLM routing, optional live tools (mint, wallet, market), free guest trial, and public run receipts in our database.</p>
                <p>Not live yet: wallet payment enforcement, $SKRN fee splits, staking vaults, Blinks, or on-chain skill registry. Those are roadmap items, not current features.</p>
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
            <SectionHeading eyebrow="Capabilities" title="What the web app does" />
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

        {/* ── Staking honesty ─────────────────────────────── */}
        <section>
          <Reveal>
            <div className="relative overflow-hidden rounded-xl border border-border bg-bg-subtle p-6 sm:p-8">
              <GlowOrb className="left-[-40px] bottom-[-60px] h-56 w-56" />
              <div className="relative">
                <SectionHeading eyebrow="Not live" title="Staking is disabled" />
                <p className="mt-3 max-w-prose text-body text-text-secondary">
                  There is no stake vault, no APY, and no fee distribution today. We will not show staked TVL or
                  staker counts until on-chain programs are real. Planned later: usage-backed fee share for stakers.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/stake">
                    <Button variant="secondary">Read stake status</Button>
                  </Link>
                  <Link href="/skills/rug-risk-scanner">
                    <Button variant="accent" trailingIcon={<ArrowRight size={16} />}>
                      Use a live skill instead
                    </Button>
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
                Run a free mint scan now. Publishing skills is open; paid fee splits are not live yet.
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
