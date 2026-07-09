import type { Metadata } from 'next';
import Link from 'next/link';
import Button from '@/components/Button';
import Reveal from '@/components/Reveal';
import { GridBackdrop } from '@/components/graphics/Decor';
import { SearchIcon, WalletIcon, BoltIcon, CheckIcon, ArrowRight } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Run Skills',
  description: 'Execute any AI skill on the SolKernal network. Pay with a Solana wallet, get results in seconds.',
};

const steps = [
  { Icon: SearchIcon, title: 'Find a skill', body: <>Browse the <Link href="/skills" className="text-accent link-underline">marketplace</Link> and open a skill detail page.</> },
  { Icon: WalletIcon, title: 'Connect wallet', body: <>Connect Phantom (more wallets later). Used for identity; chain payment not enforced yet.</> },
  { Icon: BoltIcon, title: 'Provide input', body: <>Fill in the skill&apos;s input fields and review the listed fee and planned split.</> },
  { Icon: CheckIcon, title: 'Execute & receive', body: <>Run the skill. Output returns from the configured LLM (or a labeled mock if keys are missing).</> },
];

const specs = [
  ['Payment (live)', 'Not enforced yet (demo)'],
  ['Listed fee token', '$SKRN'],
  ['Providers', 'Cloudflare, Gemini, Grok, Groq'],
  ['Receipt (today)', 'App database record'],
  ['Receipt (next)', 'On-chain PDA / hash'],
  ['Wallet', 'Phantom adapter'],
];

export default function RunPage() {
  return (
    <div className="relative isolate">
      <GridBackdrop />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-tiny uppercase tracking-[0.16em] text-accent">Run.exe</p>
          <h1 className="mt-2 text-h1">Execute any skill in seconds</h1>
          <p className="mx-auto mt-3 max-w-prose text-body text-text-secondary">
            Find a skill, connect your wallet, and run it. SolKernal routes your input to the configured LLM and
            returns a result. On-chain fee settlement is the next protocol milestone.
          </p>
        </div>

        {/* Steps */}
        <ol className="mt-10 grid gap-4 sm:grid-cols-2">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} index={i}>
              <div className="flex h-full gap-4 rounded-xl border border-border bg-bg-subtle p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-bg-primary text-accent">
                  <s.Icon size={18} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-mono-sm text-text-tertiary">{String(i + 1).padStart(2, '0')}</span>
                    <p className="font-semibold text-text-primary">{s.title}</p>
                  </div>
                  <p className="mt-1 text-small text-text-secondary">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Specs */}
        <Reveal>
          <div className="mt-6 rounded-xl border border-border bg-bg-subtle p-6">
            <h2 className="font-mono text-tiny uppercase tracking-[0.16em] text-text-tertiary">Execution specs</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {specs.map(([k, val]) => (
                <div key={k} className="flex items-center justify-between border-b border-border pb-3 font-mono text-small">
                  <dt className="text-text-tertiary">{k}</dt>
                  <dd className="text-text-primary">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <div className="mt-8 flex justify-center">
          <Link href="/skills">
            <Button size="lg" variant="accent" trailingIcon={<ArrowRight size={18} />}>Browse skills</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
