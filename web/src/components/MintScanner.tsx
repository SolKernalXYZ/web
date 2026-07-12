"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import Button from "@/components/Button";
import { ArrowRight, BoltIcon, CopyIcon, CheckIcon } from "@/components/icons";
import { isValidSolanaAddress } from "@/lib/skillsPublic";
import { buildTweetText, parseReceiptHighlights, twitterIntentUrl } from "@/lib/receiptShare";

const DEFAULT_SKILL = "rug-risk-scanner";

export default function MintScanner() {
  const { publicKey } = useWallet();
  const [mint, setMint] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [sharePath, setSharePath] = useState("");
  const [mocked, setMocked] = useState(false);
  const [guest, setGuest] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    const value = mint.trim();
    if (!value) {
      setError("Paste a Solana mint address.");
      return;
    }
    if (!isValidSolanaAddress(value)) {
      setError("That doesn’t look like a valid Solana address.");
      return;
    }

    setRunning(true);
    setError("");
    setResult("");
    setSharePath("");
    setMocked(false);

    try {
      const body: { slug: string; input: string; walletAddress?: string } = {
        slug: DEFAULT_SKILL,
        input: value,
      };
      if (publicKey) body.walletAddress = publicKey.toBase58();

      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Scan failed");
        return;
      }
      setResult(data.output || "");
      setSharePath(data.sharePath || (data.executionId ? `/r/${data.executionId}` : ""));
      setMocked(Boolean(data.mocked));
      setGuest(Boolean(data.guest));
    } catch {
      setError("Network error. Try again.");
    } finally {
      setRunning(false);
    }
  };

  const absoluteShare = useMemo(() => {
    if (!sharePath) return "";
    if (typeof window !== "undefined") return `${window.location.origin}${sharePath}`;
    return `https://solkernal.xyz${sharePath}`;
  }, [sharePath]);

  const highlights = useMemo(() => parseReceiptHighlights(result), [result]);

  const tweetIntent = useMemo(() => {
    if (!absoluteShare) return "";
    return twitterIntentUrl(
      buildTweetText({
        skillName: "Rug Risk Scanner",
        input: mint.trim() || "mint",
        receiptUrl: absoluteShare,
        riskScore: highlights.riskScore,
        verdict: highlights.verdict,
      }),
    );
  }, [absoluteShare, mint, highlights.riskScore, highlights.verdict]);

  const copyShare = () => {
    if (!absoluteShare) return;
    navigator.clipboard.writeText(absoluteShare);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="relative rounded-2xl border border-border bg-bg-subtle/80 p-5 shadow-lg backdrop-blur-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-tiny uppercase tracking-[0.16em] text-accent">Free scan · no wallet required</p>
          <h2 className="mt-1 text-h3 font-semibold text-text-primary">Paste a mint. Get risk in seconds.</h2>
        </div>
        <Link
          href={`/skills/${DEFAULT_SKILL}`}
          className="text-small text-text-secondary underline-offset-2 hover:text-accent hover:underline"
        >
          Full skill →
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="mint-scanner-input" className="sr-only">
          SPL mint address
        </label>
        <input
          id="mint-scanner-input"
          type="text"
          value={mint}
          onChange={(e) => setMint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void run();
          }}
          placeholder="SPL mint address…"
          spellCheck={false}
          className="min-w-0 flex-1 rounded-md border border-border bg-bg-primary px-3 py-2.5 font-mono text-body text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        />
        <Button
          variant="accent"
          size="lg"
          onClick={() => void run()}
          loading={running}
          disabled={running || !mint.trim()}
          leadingIcon={!running ? <BoltIcon size={18} /> : undefined}
          className="sm:shrink-0"
        >
          {running ? "Scanning…" : "Run free scan"}
        </Button>
      </div>

      <p className="mt-2 text-mono-sm text-text-tertiary">
        5 free guest runs / hour · wallet optional · not financial advice
      </p>

      {error && (
        <div className="mt-4 rounded-md border border-danger/40 bg-danger-subtle px-3 py-2 text-small text-danger" role="alert">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-tiny uppercase tracking-[0.14em] text-text-tertiary">
              Result {guest ? "· guest trial" : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {tweetIntent && (
                <a href={tweetIntent} target="_blank" rel="noopener noreferrer">
                  <Button variant="accent" size="sm">Post on X</Button>
                </a>
              )}
              {sharePath && (
                <Button variant="secondary" size="sm" onClick={copyShare} leadingIcon={copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}>
                  {copied ? "Copied link" : "Copy receipt"}
                </Button>
              )}
              {sharePath && (
                <Link href={sharePath}>
                  <Button variant="ghost" size="sm" trailingIcon={<ArrowRight size={14} />}>
                    Open receipt
                  </Button>
                </Link>
              )}
            </div>
          </div>
          {(highlights.riskScore != null || highlights.verdict) && (
            <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-bg-primary px-3 py-2.5 font-mono text-small">
              {highlights.riskScore != null && (
                <span className="text-text-primary">
                  Risk <strong>{highlights.riskScore}</strong>/100
                </span>
              )}
              {highlights.verdict && (
                <span className="text-text-secondary">Verdict: {highlights.verdict}</span>
              )}
            </div>
          )}
          {mocked ? (
            <div
              className="rounded-md border-2 border-warning/60 bg-warning-subtle px-3 py-3 text-small text-warning"
              role="status"
            >
              <p className="font-semibold">Mock — not a live LLM scan</p>
              <p className="mt-1 text-warning/90">
                Fallback output. Provider keys missing, out of credits, or the call failed. Do not use this for trading
                decisions. Configure LLM API keys for live desk briefs.
              </p>
            </div>
          ) : (
            <div
              className="rounded-md border border-success/40 bg-success-subtle/40 px-3 py-2 text-small text-text-secondary"
              role="status"
            >
              <span className="font-medium text-success">Live LLM</span>
              {guest ? " · guest trial (5 runs/hour/IP)" : " · wallet identity only"}
              {" · "}tools may have hit chain/market APIs · not financial advice
            </div>
          )}
          <pre
            className={`max-h-80 overflow-auto whitespace-pre-wrap rounded-lg border p-4 font-mono text-small text-text-primary ${
              mocked ? "border-warning/40 bg-warning-subtle/20" : "border-border bg-bg-primary"
            }`}
          >
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
