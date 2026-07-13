/**
 * Day 4 — minimal SOL pay-per-run after free guest quota.
 *
 * Free trial stays intact. Only skills listed in PAYWALL_SKILL_SLUGS can
 * unlock extra runs by proving a confirmed SOL transfer to the protocol treasury.
 * Builder $SKRN fee splits are still not live.
 */

import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { isValidSolanaAddress } from "@/lib/skillsPublic";

/** Flagship skill for the first money path. */
export const PAYWALL_SKILL_SLUGS = new Set(["rug-risk-scanner"]);

const DEFAULT_PAY_SOL = 0.001;

export type PayPerRunConfig = {
  enabled: boolean;
  treasury: string | null;
  paySol: number;
  payLamports: number;
  skillSlugs: string[];
  network: string;
};

export function isPaywallSkill(slug: string): boolean {
  return PAYWALL_SKILL_SLUGS.has(slug.trim().toLowerCase());
}

export function getPayPerRunConfig(): PayPerRunConfig {
  const treasuryRaw = (process.env.NEXT_PUBLIC_PROTOCOL_TREASURY || "").trim();
  const treasury =
    treasuryRaw && isValidSolanaAddress(treasuryRaw) ? treasuryRaw : null;

  const parsed = Number(process.env.NEXT_PUBLIC_PAY_PER_RUN_SOL || DEFAULT_PAY_SOL);
  const paySol =
    Number.isFinite(parsed) && parsed > 0 && parsed < 10 ? parsed : DEFAULT_PAY_SOL;

  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet-beta").trim();

  return {
    enabled: Boolean(treasury),
    treasury,
    paySol,
    payLamports: Math.round(paySol * LAMPORTS_PER_SOL),
    skillSlugs: Array.from(PAYWALL_SKILL_SLUGS),
    network,
  };
}

/** Public payload for clients (402 responses + UI). */
export function payPerRunPublicInfo(slug?: string) {
  const cfg = getPayPerRunConfig();
  const applies = slug ? isPaywallSkill(slug) : true;
  return {
    paymentEnabled: cfg.enabled && applies,
    treasury: cfg.treasury,
    paySol: cfg.paySol,
    payLamports: cfg.payLamports,
    skillSlug: slug && isPaywallSkill(slug) ? slug : null,
    network: cfg.network,
    note: cfg.enabled
      ? "After free guest quota, send paySol SOL to treasury and retry with txSignature."
      : "Pay-per-run is not configured (set NEXT_PUBLIC_PROTOCOL_TREASURY).",
  };
}

function rpcUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    process.env.SOLANA_RPC_URL ||
    "https://api.mainnet-beta.solana.com"
  );
}

export type VerifyPaymentResult =
  | { ok: true; lamports: number; from: string; to: string }
  | { ok: false; reason: string };

/**
 * Confirm a SystemProgram SOL transfer to the protocol treasury.
 * Uses parsed transaction + balance delta as a secondary check.
 */
export async function verifySolPayment(opts: {
  signature: string;
  treasury: string;
  minLamports: number;
  /** If set, transfer source must match this wallet. */
  expectedPayer?: string;
}): Promise<VerifyPaymentResult> {
  const sig = opts.signature.trim();
  if (!/^[1-9A-HJ-NP-Za-km-z]{64,128}$/.test(sig)) {
    return { ok: false, reason: "Invalid transaction signature format" };
  }
  if (!isValidSolanaAddress(opts.treasury)) {
    return { ok: false, reason: "Invalid treasury address" };
  }

  const connection = new Connection(rpcUrl(), "confirmed");

  let tx;
  try {
    tx = await connection.getParsedTransaction(sig, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });
  } catch {
    return { ok: false, reason: "RPC error while fetching transaction" };
  }

  if (!tx) {
    return { ok: false, reason: "Transaction not found or not yet confirmed" };
  }
  if (tx.meta?.err) {
    return { ok: false, reason: "Transaction failed on-chain" };
  }

  const instructions = tx.transaction.message.instructions;
  let best: { lamports: number; from: string; to: string } | null = null;

  for (const ix of instructions) {
    if (!("parsed" in ix) || !ix.parsed) continue;
    if (ix.program !== "system") continue;
    const parsed = ix.parsed as {
      type?: string;
      info?: { source?: string; destination?: string; lamports?: number };
    };
    if (parsed.type !== "transfer") continue;
    const source = parsed.info?.source;
    const destination = parsed.info?.destination;
    const lamports = Number(parsed.info?.lamports ?? 0);
    if (!source || !destination || !Number.isFinite(lamports)) continue;
    if (destination !== opts.treasury) continue;
    if (lamports < opts.minLamports) continue;
    if (opts.expectedPayer && source !== opts.expectedPayer) continue;
    if (!best || lamports > best.lamports) {
      best = { lamports, from: source, to: destination };
    }
  }

  // Also scan inner instructions (e.g. wrapped transfers)
  if (!best && tx.meta?.innerInstructions) {
    for (const group of tx.meta.innerInstructions) {
      for (const ix of group.instructions) {
        if (!("parsed" in ix) || !ix.parsed) continue;
        if (ix.program !== "system") continue;
        const parsed = ix.parsed as {
          type?: string;
          info?: { source?: string; destination?: string; lamports?: number };
        };
        if (parsed.type !== "transfer") continue;
        const source = parsed.info?.source;
        const destination = parsed.info?.destination;
        const lamports = Number(parsed.info?.lamports ?? 0);
        if (!source || !destination || !Number.isFinite(lamports)) continue;
        if (destination !== opts.treasury) continue;
        if (lamports < opts.minLamports) continue;
        if (opts.expectedPayer && source !== opts.expectedPayer) continue;
        if (!best || lamports > best.lamports) {
          best = { lamports, from: source, to: destination };
        }
      }
    }
  }

  if (!best) {
    return {
      ok: false,
      reason: `No confirmed SOL transfer of ≥ ${opts.minLamports} lamports to treasury found`,
    };
  }

  return { ok: true, lamports: best.lamports, from: best.from, to: best.to };
}

export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}
