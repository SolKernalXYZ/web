import Link from "next/link";
import Button from "@/components/Button";
import { ArrowRight } from "@/components/icons";

export default function StakePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-bg-subtle">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-accent" aria-hidden="true">
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
          <path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
        </svg>
      </div>
      <h1 className="text-h1">Staking — not live</h1>
      <p className="mt-3 text-body text-text-secondary">
        No vault, no APY, no fee share today. We do not accept stake deposits or display staked balances. A
        usage-backed fee split for stakers is planned only after on-chain settlement is real.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/skills">
          <Button variant="accent" trailingIcon={<ArrowRight size={16} />}>Browse skills</Button>
        </Link>
        <Link href="/submit">
          <Button variant="secondary">Publish a skill</Button>
        </Link>
      </div>
    </div>
  );
}
