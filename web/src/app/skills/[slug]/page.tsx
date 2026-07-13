"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import LottiePlayer from "@/components/lottie/LottiePlayer";
import { isLiveDataSkill } from "@/lib/skillsPublic";
import { buildTweetText, parseReceiptHighlights, twitterIntentUrl } from "@/lib/receiptShare";
import { ArrowRight, CopyIcon, CheckIcon, BoltIcon, ReceiptIcon, RouterIcon } from "@/components/icons";

type Skill = {
  name: string;
  slug: string;
  builderWallet: string;
  version: string;
  runs: number;
  tags: string;
  fee: number;
  description: string;
  provider: string;
  model: string;
  category: string;
  executions: { id: string; walletAddress: string; status: string; createdAt: string }[];
};

type PayInfo = {
  paymentEnabled: boolean;
  paymentRequired?: boolean;
  treasury: string | null;
  paySol: number;
  payLamports: number;
  freeRemaining?: number | null;
  freeLimit?: number | null;
  guestLimit?: boolean;
  error?: string;
};

const PAYWALL_SLUG = "rug-risk-scanner";

export default function SkillDetailPage() {
  const routeParams = useParams();
  const slug = typeof routeParams?.slug === "string" ? routeParams.slug : Array.isArray(routeParams?.slug) ? routeParams.slug[0] : "";

  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction } = useWallet();
  const { setVisible } = useWalletModal();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [input, setInput] = useState("");
  const [context, setContext] = useState("");
  const [executing, setExecuting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [result, setResult] = useState("");
  const [mocked, setMocked] = useState(false);
  const [guest, setGuest] = useState(false);
  const [paidRun, setPaidRun] = useState(false);
  const [paidSol, setPaidSol] = useState(0);
  const [sharePath, setSharePath] = useState("");
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [origin, setOrigin] = useState("https://solkernal.xyz");
  const [freeRemaining, setFreeRemaining] = useState<number | null>(null);
  const [freeLimit, setFreeLimit] = useState<number | null>(null);
  const [payInfo, setPayInfo] = useState<PayInfo | null>(null);
  const [payError, setPayError] = useState("");

  const isPaywallSkill = slug === PAYWALL_SLUG;

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setLoadError("Missing skill slug");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError("");
    setSkill(null);

    fetch(`/api/skills/${encodeURIComponent(slug)}`)
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json().catch(() => null);
          throw new Error((data && data.error) || `Failed to load skill (${r.status})`);
        }
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setSkill(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setSkill(null);
          setLoadError(e instanceof Error ? e.message : "Failed to load skill");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Client-side pay config from public env (server still verifies on-chain).
  useEffect(() => {
    if (!isPaywallSkill) {
      setPayInfo(null);
      return;
    }
    const treasury = (process.env.NEXT_PUBLIC_PROTOCOL_TREASURY || "").trim() || null;
    const parsed = Number(process.env.NEXT_PUBLIC_PAY_PER_RUN_SOL || "0.001");
    const paySol = Number.isFinite(parsed) && parsed > 0 ? parsed : 0.001;
    setPayInfo({
      paymentEnabled: Boolean(treasury),
      treasury,
      paySol,
      payLamports: Math.round(paySol * LAMPORTS_PER_SOL),
    });
  }, [isPaywallSkill]);

  const runExecute = useCallback(
    async (opts?: { txSignature?: string }) => {
      if (!skill) return;
      const combined = `${input}\n${context}`.trim();
      if (!combined) {
        setResult("Error: Enter a mint address or input first.");
        return;
      }

      setExecuting(true);
      setResult("");
      setMocked(false);
      setGuest(false);
      setPaidRun(false);
      setPaidSol(0);
      setSharePath("");
      setPayError("");
      try {
        const body: {
          slug: string;
          input: string;
          walletAddress?: string;
          txSignature?: string;
        } = {
          slug: skill.slug,
          input: combined,
        };
        if (connected && publicKey) {
          body.walletAddress = publicKey.toBase58();
        }
        if (opts?.txSignature) {
          body.txSignature = opts.txSignature;
        }
        const res = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));

        if (typeof data.freeRemaining === "number") setFreeRemaining(data.freeRemaining);
        if (typeof data.freeLimit === "number") setFreeLimit(data.freeLimit);

        if (res.ok) {
          const out =
            typeof data.output === "string" && data.output.trim()
              ? data.output
              : "(Empty response from model — try again.)";
          setResult(out);
          setMocked(Boolean(data.mocked));
          setGuest(Boolean(data.guest));
          setPaidRun(Boolean(data.paymentEnforced));
          setPaidSol(typeof data.paidSol === "number" ? data.paidSol : 0);
          setSharePath(data.sharePath || (data.executionId ? `/r/${data.executionId}` : ""));
          setSkill((s) => (s ? { ...s, runs: s.runs + 1 } : s));
          setPayInfo((prev) =>
            prev
              ? {
                  ...prev,
                  paymentRequired: false,
                  freeRemaining: typeof data.freeRemaining === "number" ? data.freeRemaining : prev.freeRemaining,
                }
              : prev,
          );
        } else if (res.status === 402 || data.paymentRequired) {
          setPayInfo((prev) => ({
            paymentEnabled: Boolean(data.paymentEnabled ?? prev?.paymentEnabled),
            paymentRequired: true,
            treasury: data.treasury ?? prev?.treasury ?? null,
            paySol: typeof data.paySol === "number" ? data.paySol : prev?.paySol ?? 0.001,
            payLamports:
              typeof data.payLamports === "number"
                ? data.payLamports
                : prev?.payLamports ?? Math.round(0.001 * LAMPORTS_PER_SOL),
            freeRemaining: 0,
            freeLimit: typeof data.freeLimit === "number" ? data.freeLimit : prev?.freeLimit,
            guestLimit: Boolean(data.guestLimit),
            error: typeof data.error === "string" ? data.error : "Payment required",
          }));
          setFreeRemaining(0);
          setResult(`Error: ${data.error || "Free trial limit reached. Pay SOL to continue."}`);
        } else {
          setResult(`Error: ${data.error || res.statusText || "Execution failed"}`);
        }
      } catch {
        setResult("Execution failed. Check your network and try again.");
      } finally {
        setExecuting(false);
      }
    },
    [skill, input, context, connected, publicKey],
  );

  const execute = async () => {
    await runExecute();
  };

  const payAndRun = async () => {
    if (!skill || !payInfo?.paymentEnabled || !payInfo.treasury) {
      setPayError("Pay-per-run is not configured (missing treasury).");
      return;
    }
    if (!connected || !publicKey) {
      setVisible(true);
      setPayError("Connect a wallet that holds a little SOL, then tap Pay & run again.");
      return;
    }
    const combined = `${input}\n${context}`.trim();
    if (!combined) {
      setResult("Error: Enter a mint address or input first.");
      return;
    }

    setPaying(true);
    setPayError("");
    setResult("");
    try {
      const treasury = new PublicKey(payInfo.treasury);
      const lamports = payInfo.payLamports || Math.round(payInfo.paySol * LAMPORTS_PER_SOL);
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
      const tx = new Transaction({
        feePayer: publicKey,
        recentBlockhash: blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasury,
          lamports,
        }),
      );

      const signature = await sendTransaction(tx, connection, { skipPreflight: false });
      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");
      await runExecute({ txSignature: signature });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Payment failed";
      setPayError(msg);
      setResult(`Error: Payment failed — ${msg}`);
    } finally {
      setPaying(false);
    }
  };

  const skillShareUrl = `${origin}/skills/${slug}`;
  const receiptUrl = sharePath ? `${origin}${sharePath}` : "";

  const highlights = useMemo(() => parseReceiptHighlights(result), [result]);
  const tweetIntent = useMemo(() => {
    if (!receiptUrl || !skill) return "";
    return twitterIntentUrl(
      buildTweetText({
        skillName: skill.name,
        input: input.trim() || skill.slug,
        receiptUrl,
        riskScore: highlights.riskScore,
        verdict: highlights.verdict,
      }),
    );
  }, [receiptUrl, skill, input, highlights.riskScore, highlights.verdict]);

  const copy = (text: string, which: "share" | "result" | "receipt") => {
    navigator.clipboard.writeText(text).catch(() => {});
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
            <div className="h-9 w-3/4 max-w-md animate-pulse rounded bg-bg-hover" />
            <div className="h-4 w-40 animate-pulse rounded bg-bg-hover" />
            <div className="h-24 animate-pulse rounded bg-bg-hover" />
          </div>
          <div className="h-80 animate-pulse rounded-lg bg-bg-hover" />
        </div>
        <p className="mt-6 text-center font-mono text-mono-sm text-text-tertiary">Loading skill…</p>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <p className="font-mono text-text-tertiary">{loadError || "Skill not found"}</p>
        <Link href="/skills">
          <Button variant="secondary">Back to marketplace</Button>
        </Link>
      </div>
    );
  }

  const tags = skill.tags
    ? skill.tags.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean)
    : [skill.category.toUpperCase(), skill.provider.toUpperCase()];
  const shortBuilder =
    skill.builderWallet && skill.builderWallet.length >= 8
      ? `${skill.builderWallet.slice(0, 4)}…${skill.builderWallet.slice(-4)}`
      : skill.builderWallet || "—";
  const succeeded = !!result && !result.startsWith("Error") && !result.startsWith("Execution failed");
  const liveData = isLiveDataSkill(skill.tags);
  const modelLabel = skill.model ? skill.model.split("/").pop() : "model";
  const mintPlaceholder =
    skill.slug.includes("rug") || skill.slug.includes("token") || skill.slug.includes("mint")
      ? "e.g. mint address"
      : skill.slug.includes("wallet")
        ? "e.g. wallet address"
        : "e.g. SOL or paste input";

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/skills"
        className="group inline-flex items-center gap-1.5 text-small text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowRight size={14} className="rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Back to marketplace
      </Link>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <div className="w-full space-y-8 lg:w-[60%]">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {liveData ? (
                <Badge tone="success" mono>
                  Live data
                </Badge>
              ) : (
                <Badge tone="outline" mono>
                  Prompt only
                </Badge>
              )}
              {tags
                .filter((t) => t !== "TOOLS")
                .map((tag) => (
                  <Badge key={tag} tone="accent" mono>
                    {tag}
                  </Badge>
                ))}
            </div>
            <h1 className="text-h1">{skill.name}</h1>
            {liveData ? (
              <p className="max-w-prose text-small text-text-secondary">
                This skill can call Solana RPC + market tools (mint, balances, prices). Output quality depends on tools +
                model.{" "}
                <Link href="/docs/free-trial-and-live-data" className="text-accent underline-offset-2 hover:underline">
                  How free trial & Live data work
                </Link>
              </p>
            ) : (
              <p className="max-w-prose text-small text-text-secondary">
                Prompt-only skill — no live chain tools. Prefer{" "}
                <Link href="/skills" className="text-success underline-offset-2 hover:underline">
                  Live data
                </Link>{" "}
                skills for mint/wallet desk work.
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-small text-text-tertiary">
              <span className="text-text-secondary">by {shortBuilder}</span>
              <span className="inline-flex items-center gap-1.5">
                <ReceiptIcon size={13} /> {skill.version}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BoltIcon size={13} /> {Number(skill.runs || 0).toLocaleString()} runs
              </span>
              <span className="inline-flex items-center gap-1.5">
                <RouterIcon size={13} /> {skill.provider} / {modelLabel}
              </span>
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
                  Routing to {skill.provider} · running tools…
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
                      type="button"
                      onClick={() => copy(receiptUrl, "receipt")}
                      className="inline-flex items-center gap-1.5 text-small text-text-secondary transition-colors hover:text-text-primary"
                      aria-label="Copy receipt URL"
                    >
                      {copiedReceipt ? <CheckIcon size={14} className="text-success" /> : <ReceiptIcon size={14} />}
                      {copiedReceipt ? "Receipt copied" : "Copy receipt"}
                    </button>
                  )}
                  <button
                    type="button"
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
                <div
                  className="mb-2.5 rounded-md border-2 border-warning/60 bg-warning-subtle px-3 py-3 text-small text-warning"
                  role="status"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="warning" mono>
                      Mock
                    </Badge>
                    <span className="font-semibold">Not a live LLM run</span>
                  </div>
                  <p className="mt-1.5 text-warning/90">
                    Fallback output — provider keys missing, out of credits, or the call failed. Do not treat this as a
                    real desk brief. Configure LLM keys for live scans.
                  </p>
                </div>
              )}
              {!mocked && succeeded && (
                <div
                  className="mb-2.5 rounded-md border border-success/40 bg-success-subtle/40 px-3 py-3 text-small text-text-secondary"
                  role="status"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="success" mono>
                      Live LLM
                    </Badge>
                    {liveData && (
                      <Badge tone="success" mono>
                        Live data tools
                      </Badge>
                    )}
                    <span className="font-medium text-text-primary">Real model response</span>
                  </div>
                  <p className="mt-1.5">
                    {paidRun
                      ? `Paid run — ${paidSol > 0 ? `${paidSol} SOL` : "SOL"} transfer verified on-chain.`
                      : guest
                        ? "Guest trial — no wallet required. Rate limited to 5 runs/hour per IP."
                        : "Wallet used for identity only. $SKRN fee splits are not live."}
                    {liveData
                      ? " This skill may have called chain/market tools; tool data quality depends on RPC and APIs."
                      : " This skill is prompt-only (no live chain tools)."}
                    {sharePath && (
                      <>
                        {" "}
                        <Link href={sharePath} className="font-medium text-accent underline-offset-2 hover:underline">
                          Open public receipt →
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              )}
              <pre
                className={`overflow-x-auto whitespace-pre-wrap rounded-lg border p-4 font-mono text-small ${
                  succeeded
                    ? mocked
                      ? "border-warning/40 bg-warning-subtle/20 text-text-primary"
                      : "border-border bg-bg-subtle text-text-primary"
                    : "border-danger/40 bg-danger-subtle text-danger"
                }`}
              >
                {result}
              </pre>
            </section>
          )}

          {Array.isArray(skill.executions) && skill.executions.length > 0 && (
            <section>
              <h2 className="mb-2.5 font-mono text-tiny uppercase tracking-[0.16em] text-text-tertiary">
                Recent executions
              </h2>
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                {skill.executions.map((exec) => (
                  <li key={exec.id} className="flex items-center justify-between bg-bg-subtle px-4 py-2.5">
                    <Link href={`/r/${exec.id}`} className="flex items-center gap-2.5 hover:text-accent">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                      <span className="font-mono text-small text-text-primary">
                        {exec.walletAddress?.startsWith("guest:")
                          ? "guest"
                          : `${exec.walletAddress?.slice(0, 4) ?? "????"}…${exec.walletAddress?.slice(-4) ?? ""}`}
                      </span>
                    </Link>
                    <span className="font-mono text-mono-sm text-text-tertiary">
                      {new Date(exec.createdAt).toLocaleDateString()}
                    </span>
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
              {isPaywallSkill && payInfo?.paymentEnabled
                ? `Free trial first (5 guest runs/hour). After quota: ${payInfo.paySol} SOL pay-per-run (verified on-chain). $SKRN fee splits still not live. Not financial advice.`
                : "Free trial · guest 5 runs/hour. Listed $SKRN fee is display-only. Not financial advice."}
            </p>

            {(freeRemaining !== null || freeLimit !== null) && (
              <div className="rounded-md border border-border bg-bg-primary px-3 py-2 font-mono text-mono-sm text-text-secondary">
                Free remaining:{" "}
                <span className="font-semibold text-text-primary">
                  {freeRemaining ?? "—"}
                  {freeLimit !== null ? ` / ${freeLimit}` : ""}
                </span>
                {isPaywallSkill && payInfo?.paymentEnabled && (
                  <span className="text-text-tertiary"> · paid path available after quota</span>
                )}
              </div>
            )}

            {payInfo?.paymentRequired && (
              <div
                className="rounded-md border-2 border-warning/50 bg-warning-subtle px-3 py-3 text-small text-warning"
                role="status"
              >
                <p className="font-semibold">Free trial limit reached</p>
                <p className="mt-1 text-warning/90">
                  {payInfo.paymentEnabled
                    ? `Pay ${payInfo.paySol} SOL to unlock one more rug scan. Transfer is verified on-chain before execute.`
                    : "Pay-per-run is not configured yet. Wait for the free window to reset."}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="skill-input" className="mb-1.5 block text-small font-medium text-text-secondary">
                Input
              </label>
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
              <label htmlFor="skill-context" className="mb-1.5 block text-small font-medium text-text-secondary">
                Additional context
              </label>
              <textarea
                id="skill-context"
                rows={3}
                placeholder="Optional instructions…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full resize-none rounded-md border border-border bg-bg-primary px-3 py-2.5 font-mono text-body text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              />
            </div>

            <Button
              fullWidth
              size="lg"
              variant="accent"
              type="button"
              onClick={() => void execute()}
              loading={executing && !paying}
              disabled={!input.trim() || paying || (payInfo?.paymentRequired === true && !payInfo.paymentEnabled)}
              leadingIcon={!executing && !paying ? <BoltIcon size={18} /> : undefined}
            >
              {executing && !paying
                ? "Executing…"
                : payInfo?.paymentRequired
                  ? "Retry free trial"
                  : connected
                    ? "Execute skill"
                    : "Run free trial"}
            </Button>

            {isPaywallSkill && payInfo?.paymentEnabled && (
              <Button
                fullWidth
                size="lg"
                variant="secondary"
                type="button"
                onClick={() => void payAndRun()}
                loading={paying}
                disabled={!input.trim() || executing}
              >
                {paying
                  ? "Confirming SOL…"
                  : connected
                    ? `Pay ${payInfo.paySol} SOL & run`
                    : `Connect · pay ${payInfo.paySol} SOL & run`}
              </Button>
            )}

            {payError && (
              <p className="text-center text-small text-danger" role="alert">
                {payError}
              </p>
            )}

            {!connected && (
              <button
                type="button"
                onClick={() => setVisible(true)}
                className="w-full text-center text-small text-text-tertiary underline-offset-2 hover:text-text-secondary hover:underline"
              >
                {isPaywallSkill && payInfo?.paymentEnabled
                  ? "Connect wallet for paid runs (or free trial without it)"
                  : "Or connect wallet for identity"}
              </button>
            )}

            <div className="border-t border-border pt-4">
              <p id="share-label" className="mb-2 font-mono text-tiny uppercase tracking-[0.14em] text-text-tertiary">
                Share skill
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  aria-labelledby="share-label"
                  value={skillShareUrl}
                  className="min-w-0 flex-1 rounded-md border border-border bg-bg-primary px-3 py-2 font-mono text-mono-sm text-text-secondary"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => copy(skillShareUrl, "share")}
                  aria-label="Copy skill URL"
                  className="shrink-0"
                >
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
