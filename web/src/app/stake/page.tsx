"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Button from "@/components/Button";
import StatBox from "@/components/StatBox";
import Badge from "@/components/Badge";
import LottiePlayer from "@/components/lottie/LottiePlayer";
import { YieldIcon, StakeIcon, ReceiptIcon, LockIcon, SparkIcon } from "@/components/icons";

type Stats = { totalStaked: number; totalDistributed: number; totalExecutions: number; uniqueStakers: number };
type Position = { amount: number; totalClaimed: number; pendingRewards: number } | null;

export default function StakePage() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [stats, setStats] = useState<Stats | null>(null);
  const [position, setPosition] = useState<Position>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const fetchData = () => {
    const wallet = publicKey?.toBase58() || "";
    fetch(`/api/staking${wallet ? `?wallet=${wallet}` : ""}`)
      .then((r) => r.json())
      .then((data) => { setStats(data.stats); setPosition(data.position); });
  };

  useEffect(() => { fetchData(); }, [publicKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const doAction = async (action: string) => {
    if (!connected || !publicKey) return;
    setLoading(true);
    setFlash(null);
    try {
      const body: Record<string, unknown> = { action, walletAddress: publicKey.toBase58() };
      if (action !== "claim") body.amount = parseFloat(amount);
      const res = await fetch("/api/staking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      fetchData();
      setAmount("");
      if (res.ok) {
        const labels: Record<string, string> = { stake: "Stake confirmed", unstake: "Unstake confirmed", claim: "Rewards claimed" };
        setFlash(labels[action] ?? "Done");
      }
    } finally { setLoading(false); }
  };

  const hasStake = !!position && position.amount > 0;
  const canClaim = !!position && position.pendingRewards > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <p className="font-mono text-tiny uppercase tracking-[0.16em] text-accent">Stake.db</p>
        <h1 className="mt-2 text-h1">$SKRN Staking</h1>
        <p className="mt-2 max-w-prose text-body text-text-secondary">
          Stake $SKRN to earn a share of protocol execution fees. Every AI skill invocation generates a fee — 50% is
          distributed to stakers proportionally in USDC. No lockups.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatBox value="0.5 USDC" label="Exec fee" icon={<ReceiptIcon size={16} />} />
        <StatBox value="50%" label="To stakers" icon={<YieldIcon size={16} />} />
        <StatBox value="USDC" label="Yield token" icon={<SparkIcon size={16} />} />
      </div>

      {/* Position */}
      <section className="mt-6 rounded-xl border border-border bg-bg-subtle p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-h3">Your position</h2>
          {connected && <Badge tone={hasStake ? "success" : "neutral"}>{hasStake ? "Active" : "No stake"}</Badge>}
        </div>

        {!connected ? (
          <div className="mt-5 flex flex-col items-start gap-3">
            <p className="text-body text-text-secondary">Connect a wallet to stake $SKRN and start earning USDC yield.</p>
            <Button onClick={() => setVisible(true)} leadingIcon={<LockIcon size={16} />}>Connect wallet to stake</Button>
          </div>
        ) : (
          <>
            {hasStake && position && (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-bg-primary p-4">
                  <div className="text-tiny uppercase tracking-[0.12em] text-text-tertiary">Staked</div>
                  <div className="mt-1 font-mono text-h3 text-text-primary">{position.amount.toLocaleString()}</div>
                  <div className="text-mono-sm text-text-tertiary">$SKRN</div>
                </div>
                <div className="rounded-lg border border-border bg-bg-primary p-4">
                  <div className="text-tiny uppercase tracking-[0.12em] text-text-tertiary">Pending</div>
                  <div className="mt-1 font-mono text-h3 text-success">{position.pendingRewards.toFixed(2)}</div>
                  <div className="text-mono-sm text-text-tertiary">USDC</div>
                </div>
                <div className="rounded-lg border border-border bg-bg-primary p-4">
                  <div className="text-tiny uppercase tracking-[0.12em] text-text-tertiary">Claimed</div>
                  <div className="mt-1 font-mono text-h3 text-text-primary">{position.totalClaimed.toFixed(2)}</div>
                  <div className="text-mono-sm text-text-tertiary">USDC</div>
                </div>
              </div>
            )}

            <div className="mt-5">
              <label htmlFor="stake-amount" className="mb-1.5 block text-small font-medium text-text-secondary">Amount</label>
              <div className="flex items-center rounded-md border border-border bg-bg-primary focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/40">
                <input
                  id="stake-amount"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-md bg-transparent px-3 py-2.5 font-mono text-body text-text-primary placeholder:text-text-tertiary focus:outline-none"
                />
                <span className="whitespace-nowrap pr-3 font-mono text-small text-text-tertiary" aria-hidden="true">$SKRN</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="accent" onClick={() => doAction("stake")} loading={loading} disabled={!amount} leadingIcon={<StakeIcon size={16} />}>Stake</Button>
              <Button variant="secondary" onClick={() => doAction("unstake")} disabled={loading || !amount || !hasStake}>Unstake</Button>
              <Button variant="secondary" onClick={() => doAction("claim")} disabled={loading || !canClaim} leadingIcon={<YieldIcon size={16} />}>
                {canClaim && position ? `Claim ${position.pendingRewards.toFixed(2)} USDC` : "Claim"}
              </Button>
            </div>

            {flash && (
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-success/40 bg-success-subtle px-4 py-3" role="status" aria-live="polite">
                <LottiePlayer
                  name="success-check"
                  loop={false}
                  className="h-8 w-8 shrink-0"
                  ariaLabel={flash}
                  onComplete={() => setTimeout(() => setFlash(null), 1600)}
                />
                <span className="text-small font-medium text-success">{flash}</span>
              </div>
            )}
          </>
        )}
      </section>

      {/* Global stats */}
      {stats && (
        <section className="mt-6">
          <h2 className="mb-3 text-h3">Global stats</h2>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            {[
              { l: "Total staked", v: `${stats.totalStaked.toLocaleString()}`, u: "$SKRN" },
              { l: "Distributed", v: `${stats.totalDistributed.toLocaleString()}`, u: "USDC", pos: true },
              { l: "Executions", v: stats.totalExecutions.toLocaleString(), u: "" },
              { l: "Stakers", v: stats.uniqueStakers.toLocaleString(), u: "" },
            ].map((s) => (
              <div key={s.l} className="bg-bg-subtle p-4">
                <dt className="text-tiny uppercase tracking-[0.12em] text-text-tertiary">{s.l}</dt>
                <dd className={`mt-1 font-mono text-body font-semibold ${s.pos ? "text-success" : "text-text-primary"}`}>
                  {s.v} {s.u && <span className="text-mono-sm font-normal text-text-tertiary">{s.u}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Tiers */}
      <section className="mt-6">
        <h2 className="mb-3 text-h3">Staking tiers</h2>
        <div className="space-y-3">
          {[
            { name: "Premium", req: "10M $SKRN", perk: "Premium access + yield", tone: "accent" as const },
            { name: "Priority", req: "100M $SKRN", perk: "Priority access + support + 1.5× rewards", tone: "success" as const },
          ].map((t) => (
            <div key={t.name} className="flex flex-col gap-2 rounded-xl border border-border bg-bg-subtle p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Badge tone={t.tone} mono>{t.name}</Badge>
                <span className="font-mono text-body font-semibold text-text-primary">{t.req}</span>
              </div>
              <span className="text-small text-text-secondary">{t.perk}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
