"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import LottiePlayer from "@/components/lottie/LottiePlayer";
import { isLiveDataSkill } from "@/lib/skillsPublic";
import { buildTweetText, parseReceiptHighlights, twitterIntentUrl } from "@/lib/receiptShare";
import { ArrowRight, CopyIcon, CheckIcon, BoltIcon, ReceiptIcon, RouterIcon } from "@/components/icons";

type Skill = {
  name: string; slug: string; builderWallet: string; version: string; runs: number;
  tags: string; fee: number; description: string; provider: string; model: string; category: string;
  executions: { id: string; walletAddress: string; status: string; createdAt: string }[];
};

export default function SkillDetailPage({ params }: { params: { slug: string } }) {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [context, setContext] = useState("");
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState("");
  const [mocked, setMocked] = useState(false);
  const [guest, setGuest] = useState(false);
  const [sharePath, setSharePath] = useState("");
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  useEffect(() => {
    fetch(`/api/skills/${params.slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setSkill)
      .finally(() => setLoading(false));
  }, [params.slug]);

  const execute = async () => {
    if (!skill) return;
    setExecuting(true);
    setResult("");
    setMocked(false);
    setGuest(false);
    setSharePath("");
    try {
      const body: { slug: string; input: string; walletAddress?: string } = {
        slug: skill.slug,
        input: `${input}\n${context}`.trim(),
      };
      if (connected && publicKey) {
        body.walletAddress = publicKey.toBase58();
      }
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.output);
        setMocked(Boolean(data.mocked));
        setGuest(Boolean(data.guest));
        setSharePath(data.sharePath || (data.executionId ? `/r/${data.executionId}` : ""));
        setSkill((s) => (s ? { ...s, runs: s.runs + 1 } : s));
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch {
      setResult("Execution failed. Try again.");
    } finally {
      setExecuting(false);
    }
  };

  const skillShareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/skills/${params.slug}`
      : `https://solkernal.xyz/skills/${params.slug}`;

  const receiptUrl =
    sharePath && typeof window !== "undefined"
      ? `${window.location.origin}${sharePath}`
      : sharePath
        ? `https://solkernal.xyz${sharePath}`
        : "";

  const highlights = parseReceiptHighlights(result);
  const tweetIntent =
    receiptUrl && skill
      ? twitterIntentUrl(
          buildTweetText({
            skillName: skill.name,
            input: input.trim() || skill.slug,
            receiptUrl,
            riskScore: highlights.riskScore,
            verdict: highlights.verdict,
          }),
        )
      : "";

  const copy = (text: string, which: "share" | "result" | "receipt") => {
    navigator.clipboard.writeText(text);
    if (which === "share") {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 1600);
    } else if (which === "result") {
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 1600);
    } else {
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 1600);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div className="h-5 w-32 animate-pulse rounded bg-bg-hover" />
            <div className="h-9 w-2/3 animate-pulse rounded bg-bg-hover" />
            <div className="h-4 w-40 animate-pulse rounded bg-bg-hover" />
            <div className="h-24 animate-pulse rounded bg-bg-hover" />
          </div>
          <div className="h-80 animate-pulse rounded-lg bg-bg-hover" />
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-mono text-text-tertiary">Skill not found</p>
      </div>
    );
  }

  const tags = skill.tags ? skill.tags.split(",").map((t) => t.trim().toUpperCase()) : [skill.category.toUpperCase(), skill.provider.toUpperCase()];
  const shortBuilder = `${skill.builderWallet.slice(0, 4)}…${skill.builderWallet.slice(-4)}`;
  const succeeded = !!result && !result.startsWith("Error") && !result.startsWith("Execution failed");
  const liveData = isLiveDataSkill(skill.tags);
  const mintPlaceholder =
    skill.slug.includes("rug") || skill.slug.includes("token") || skill.slug.includes("mint")
      ? "e.g. mint address"
      : skill.slug.includes("wallet")
        ? "e.g. wallet address"
        : "e.g. SOL or paste input";

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/skills" className="group inline-flex items-center gap-1.5 text-small text-text-secondary transition-colors hover:text-text-primary">
        <ArrowRight size={14} className="rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Back to marketplace
      </Link>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <div className="w-full space-y-8 lg:w-[60%]">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {liveData && <Badge tone="success" mono>Live data</Badge>}
              {tags.filter((t) => t !== "TOOLS").map((tag) => (
                <Badge key={tag} tone="accent" mono>{tag}</Badge>
              ))}
            </div>
            <h1 className="text-h1">{skill.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-small text-text-tertiary">
              <span className="text-text-secondary">by {shortBuilder}</span>
              <span className="inline-flex items-center gap-1.5"><ReceiptIcon size={13} /> {skill.version}</span>
              <span className="inline-flex items-center gap-1.5"><BoltIcon size={13} /> {skill.runs.toLocaleString()} runs</span>
              <span className="inline-flex items-center gap-1.5"><RouterIcon size={13} /> {skill.provider} / {skill.model.split("/").pop()}</span>
            </div>
          </header>

          <section>
            <h2 className="font-mono text-tiny uppercase tracking-[0.16em] text-text-tertiary">About</h2>
            <p className="mt-2.5 text-body-lg text-text-primary">{skill.description}</p>
          </section>

          {executing && (
            <section aria-live="polite">
              <h2 className="font-mono text-tiny uppercase tracking-[0.16em] text-text-tertiary">Execution</h2>
              <div className="mt-2.5 flex flex-col items-center gap-3 rounded-lg border border-border bg-bg-subtle p-8">
                <LottiePlayer name="ai-thinking" className="h-20 w-20" ariaLabel="Running skill" />
                <p className="font-mono text-small text-text-secondary">
                  Routing to {skill.provider} · running prompt…
                </p>
              </div>
            </section>
          )}

          {result && !executing && (
            <section aria-live="polite">
              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 font-mono text-tiny uppercase tracking-[0.16em] text-text-tertiary">
                  {succeeded && (
                    <LottiePlayer name="success-check" loop={false} className="h-6 w-6" ariaLabel="Execution complete" />
                  )}
                  Execution result
                </h2>
                <div className="flex flex-wrap gap-3">
                  {tweetIntent && (
                    <a
                      href={tweetIntent}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-small font-medium text-accent transition-colors hover:underline"
                    >
                      Post on X
                    </a>
                  )}
                  {receiptUrl && (
                    <button
                      onClick={() => copy(receiptUrl, "receipt")}
                      className="inline-flex items-center gap-1.5 text-small text-text-secondary transition-colors hover:text-text-primary"
                      aria-label="Copy receipt URL"
                    >
                      {copiedReceipt ? <CheckIcon size={14} className="text-success" /> : <ReceiptIcon size={14} />}
                      {copiedReceipt ? "Receipt copied" : "Copy receipt"}
                    </button>
                  )}
                  <button
                    onClick={() => copy(result, "result")}
                    className="inline-flex items-center gap-1.5 text-small text-text-secondary transition-colors hover:text-text-primary"
                    aria-label="Copy result"
                  >
                    {copiedResult ? <CheckIcon size={14} className="text-success" /> : <CopyIcon size={14} />}
                    {copiedResult ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              {mocked && succeeded && (
                <div className="mb-2.5 rounded-md border border-warning/40 bg-warning-subtle px-3 py-2 text-small text-warning" role="status">
                  Mock response — no live LLM was called. Configure provider API keys on the server for real execution.
                </div>
              )}
              {!mocked && succeeded && (
                <div className="mb-2.5 rounded-md border border-border bg-bg-subtle px-3 py-2 text-small text-text-secondary" role="status">
                  {guest
                    ? "Guest trial — no wallet required. Rate limited to 5 runs/hour per IP. On-chain fee settlement not enforced yet."
                    : "Wallet used for identity only. On-chain fee settlement is not enforced yet."}
                  {sharePath && (
                    <>
                      {" "}
                      <Link href={sharePath} className="font-medium text-accent underline-offset-2 hover:underline">
                        Open public receipt →
                      </Link>
                    </>
                  )}
                </div>
              )}
              <pre className={`overflow-x-auto whitespace-pre-wrap rounded-lg border p-4 font-mono text-small ${succeeded ? "border-border bg-bg-subtle text-text-primary" : "border-danger/40 bg-danger-subtle text-danger"}`}>{result}</pre>
            </section>
          )}

          {skill.executions.length > 0 && (
            <section>
              <h2 className="mb-2.5 font-mono text-tiny uppercase tracking-[0.16em] text-text-tertiary">Recent executions</h2>
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                {skill.executions.map((exec) => (
                  <li key={exec.id} className="flex items-center justify-between bg-bg-subtle px-4 py-2.5">
                    <Link href={`/r/${exec.id}`} className="flex items-center gap-2.5 hover:text-accent">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                      <span className="font-mono text-small text-text-primary">
                        {exec.walletAddress.startsWith("guest:") ? "guest" : `${exec.walletAddress.slice(0, 4)}…${exec.walletAddress.slice(-4)}`}
                      </span>
                    </Link>
                    <span className="font-mono text-mono-sm text-text-tertiary">{new Date(exec.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="w-full lg:w-[40%]">
          <div className="sticky top-20 space-y-5 rounded-xl border border-border bg-bg-subtle p-6 shadow-sm">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-tiny uppercase tracking-[0.16em] text-text-tertiary">Listed fee</span>
              <span className="font-mono text-h2 text-text-primary">
                {Number(skill.fee).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                <span className="text-body text-text-tertiary">$SKRN</span>
              </span>
            </div>
            <p className="text-mono-sm text-text-tertiary">
              Free trial live · chain payment not charged yet. Guest: 5 runs/hour without wallet.
            </p>

            <div>
              <label htmlFor="skill-input" className="mb-1.5 block text-small font-medium text-text-secondary">Input</label>
              <input
                id="skill-input"
                type="text"
                placeholder={mintPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 font-mono text-body text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              />
            </div>

            <div>
              <label htmlFor="skill-context" className="mb-1.5 block text-small font-medium text-text-secondary">Additional context</label>
              <textarea
                id="skill-context"
                rows={3}
                placeholder="Optional instructions…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full resize-none rounded-md border border-border bg-bg-primary px-3 py-2.5 font-mono text-body text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              />
            </div>

            <div className="space-y-2 rounded-lg border border-border bg-bg-primary p-3">
              <p className="font-mono text-tiny uppercase tracking-[0.14em] text-text-tertiary">Fee split (when settlement ships)</p>
              {[
                { label: "Builder", value: skill.fee * 0.3 },
                { label: "Stakers", value: skill.fee * 0.5 },
                { label: "Protocol", value: skill.fee * 0.2 },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between font-mono text-small">
                  <span className="text-text-secondary">{row.label}</span>
                  <span className="text-text-primary">{row.value.toFixed(2)} $SKRN</span>
                </div>
              ))}
            </div>

            <Button
              fullWidth
              size="lg"
              variant="accent"
              onClick={() => void execute()}
              loading={executing}
              disabled={!input.trim()}
              leadingIcon={!executing ? <BoltIcon size={18} /> : undefined}
            >
              {executing ? "Executing…" : connected ? "Execute skill" : "Run free trial"}
            </Button>
            {!connected && (
              <button
                type="button"
                onClick={() => setVisible(true)}
                className="w-full text-center text-small text-text-tertiary underline-offset-2 hover:text-text-secondary hover:underline"
              >
                Or connect wallet for identity
              </button>
            )}

            <div className="border-t border-border pt-4">
              <p id="share-label" className="mb-2 font-mono text-tiny uppercase tracking-[0.14em] text-text-tertiary">Share skill</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  aria-labelledby="share-label"
                  value={skillShareUrl}
                  className="min-w-0 flex-1 rounded-md border border-border bg-bg-primary px-3 py-2 font-mono text-mono-sm text-text-secondary"
                />
                <Button variant="secondary" size="sm" onClick={() => copy(skillShareUrl, "share")} aria-label="Copy skill URL" className="shrink-0">
                  {copiedShare ? <CheckIcon size={15} className="text-success" /> : <CopyIcon size={15} />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
