import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/db";
import { executeLLM } from "@/lib/llm";
import { rateLimit, peekRateLimit } from "@/lib/rateLimit";
import {
  GUEST_WALLET_PREFIX,
  isValidSolanaAddress,
} from "@/lib/skillsPublic";
import {
  getPayPerRunConfig,
  isPaywallSkill,
  lamportsToSol,
  payPerRunPublicInfo,
  verifySolPayment,
} from "@/lib/payPerRun";

const MAX_INPUT_LENGTH = 8_000;
const WALLET_RATE_LIMIT = 10;
const WALLET_RATE_WINDOW_MS = 60_000;
const GUEST_RATE_LIMIT = 5;
const GUEST_RATE_WINDOW_MS = 60 * 60 * 1000; // 5 free runs / hour / IP
const PAID_RATE_LIMIT = 30;
const PAID_RATE_WINDOW_MS = 60 * 60 * 1000; // 30 paid runs / hour / payer

function clientIp(request: Request): string {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function guestWalletId(ip: string): string {
  const hash = createHash("sha256").update(ip).digest("hex").slice(0, 16);
  return `${GUEST_WALLET_PREFIX}${hash}`;
}

function guestQuotaPayload(ip: string) {
  const peek = peekRateLimit(`execute:guest:${ip}`, GUEST_RATE_LIMIT, GUEST_RATE_WINDOW_MS);
  return {
    freeRemaining: peek.remaining,
    freeLimit: GUEST_RATE_LIMIT,
    freeResetAt: peek.resetAt,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { slug, input, walletAddress, txSignature } = body as {
      slug?: unknown;
      input?: unknown;
      walletAddress?: unknown;
      txSignature?: unknown;
    };

    if (typeof slug !== "string" || typeof input !== "string") {
      return NextResponse.json(
        { error: "slug and input are required and must be strings" },
        { status: 400 },
      );
    }

    const trimmedInput = input.trim();
    const trimmedSlug = slug.trim();
    const paidSig =
      typeof txSignature === "string" && txSignature.trim().length > 0
        ? txSignature.trim()
        : null;

    if (!trimmedSlug || !trimmedInput) {
      return NextResponse.json(
        { error: "slug and input must not be empty" },
        { status: 400 },
      );
    }

    if (trimmedInput.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: `Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters` },
        { status: 413 },
      );
    }

    const hasWallet =
      typeof walletAddress === "string" && walletAddress.trim().length > 0;
    let identity: string;
    let isGuest = false;
    let freeRemaining: number | null = null;
    let freeLimit: number | null = null;
    let paymentEnforced = false;
    let paidSol = 0;
    let verifiedPayer: string | null = null;

    const payCfg = getPayPerRunConfig();
    const paywallSkill = isPaywallSkill(trimmedSlug);
    const ip = clientIp(request);

    // ── Paid path: verify on-chain SOL transfer (paywall skills only) ──
    if (paidSig) {
      if (!paywallSkill) {
        return NextResponse.json(
          { error: "Pay-per-run is only available on rug-risk-scanner for now." },
          { status: 400 },
        );
      }
      if (!payCfg.enabled || !payCfg.treasury) {
        return NextResponse.json(
          {
            error: "Pay-per-run is not configured. Set NEXT_PUBLIC_PROTOCOL_TREASURY.",
            paymentEnabled: false,
          },
          { status: 503 },
        );
      }

      const existing = await prisma.execution.findFirst({
        where: { txSignature: paidSig },
        select: { id: true },
      });
      if (existing) {
        return NextResponse.json(
          { error: "This payment signature was already used for a run." },
          { status: 409 },
        );
      }

      const expectedPayer =
        hasWallet && isValidSolanaAddress((walletAddress as string).trim())
          ? (walletAddress as string).trim()
          : undefined;

      const verified = await verifySolPayment({
        signature: paidSig,
        treasury: payCfg.treasury,
        minLamports: payCfg.payLamports,
        expectedPayer,
      });

      if (!verified.ok) {
        return NextResponse.json(
          {
            error: `Payment verification failed: ${verified.reason}`,
            paymentRequired: true,
            ...payPerRunPublicInfo(trimmedSlug),
          },
          { status: 402 },
        );
      }

      verifiedPayer = verified.from;
      paidSol = lamportsToSol(verified.lamports);
      paymentEnforced = true;
      identity = verifiedPayer;

      const paidLimit = rateLimit(
        `execute:paid:${verifiedPayer}`,
        PAID_RATE_LIMIT,
        PAID_RATE_WINDOW_MS,
      );
      if (!paidLimit.allowed) {
        const retryAfter = Math.max(1, Math.ceil((paidLimit.resetAt - Date.now()) / 1000));
        return NextResponse.json(
          { error: "Paid run rate limit exceeded. Please slow down." },
          { status: 429, headers: { "Retry-After": String(retryAfter) } },
        );
      }
    } else if (hasWallet) {
      const trimmedWallet = (walletAddress as string).trim();
      if (!isValidSolanaAddress(trimmedWallet)) {
        return NextResponse.json({ error: "Invalid walletAddress" }, { status: 400 });
      }
      identity = trimmedWallet;
      const limit = rateLimit(`execute:wallet:${identity}`, WALLET_RATE_LIMIT, WALLET_RATE_WINDOW_MS);
      if (!limit.allowed) {
        // Wallet burst limit hit — offer pay path on flagship skill if configured
        if (paywallSkill && payCfg.enabled) {
          const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
          return NextResponse.json(
            {
              error:
                "Free rate limit reached. Pay a small SOL amount to continue, or wait and retry.",
              paymentRequired: true,
              guestLimit: false,
              freeRemaining: 0,
              freeLimit: WALLET_RATE_LIMIT,
              freeResetAt: limit.resetAt,
              ...payPerRunPublicInfo(trimmedSlug),
            },
            { status: 402, headers: { "Retry-After": String(retryAfter) } },
          );
        }
        const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
        return NextResponse.json(
          { error: "Rate limit exceeded. Please slow down." },
          { status: 429, headers: { "Retry-After": String(retryAfter) } },
        );
      }
      freeRemaining = limit.remaining;
      freeLimit = WALLET_RATE_LIMIT;
    } else {
      // Free trial: no wallet required (rate-limited by IP).
      isGuest = true;
      identity = guestWalletId(ip);
      const limit = rateLimit(`execute:guest:${ip}`, GUEST_RATE_LIMIT, GUEST_RATE_WINDOW_MS);
      if (!limit.allowed) {
        const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
        const quota = guestQuotaPayload(ip);

        if (paywallSkill && payCfg.enabled) {
          return NextResponse.json(
            {
              error:
                "Free trial limit reached (5 runs/hour). Pay a small SOL amount to unlock another rug scan, or try again later.",
              paymentRequired: true,
              guestLimit: true,
              ...quota,
              freeRemaining: 0,
              ...payPerRunPublicInfo(trimmedSlug),
            },
            { status: 402, headers: { "Retry-After": String(retryAfter) } },
          );
        }

        return NextResponse.json(
          {
            error:
              paywallSkill && !payCfg.enabled
                ? "Free trial limit reached (5 runs/hour). Pay-per-run is not configured yet — try again later or connect a wallet."
                : "Free trial limit reached (5 runs/hour). Connect a wallet or try again later.",
            guestLimit: true,
            paymentRequired: false,
            paymentEnabled: false,
            ...quota,
            freeRemaining: 0,
          },
          { status: 429, headers: { "Retry-After": String(retryAfter) } },
        );
      }
      freeRemaining = limit.remaining;
      freeLimit = GUEST_RATE_LIMIT;
    }

    const skill = await prisma.skill.findUnique({ where: { slug: trimmedSlug } });
    if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    if (!skill.active) return NextResponse.json({ error: "Skill is not active" }, { status: 409 });

    const llmResult = await executeLLM({
      provider: skill.provider,
      model: skill.model,
      systemPrompt: skill.systemPrompt,
      userInput: trimmedInput,
    });

    const feeRecorded = paymentEnforced ? paidSol : skill.fee;

    const execution = await prisma.execution.create({
      data: {
        skillId: skill.id,
        walletAddress: identity,
        input: trimmedInput,
        output: llmResult.output,
        feePaid: feeRecorded,
        status: llmResult.mocked ? "mocked" : "success",
        txSignature: paidSig,
      },
    });

    await prisma.skill.update({ where: { id: skill.id }, data: { runs: { increment: 1 } } });
    await prisma.protocolStats.upsert({
      where: { id: "global" },
      create: { id: "global", totalExecutions: 1 },
      update: { totalExecutions: { increment: 1 } },
    });

    return NextResponse.json({
      executionId: execution.id,
      sharePath: `/r/${execution.id}`,
      output: llmResult.output,
      feePaid: feeRecorded,
      status: execution.status,
      mocked: llmResult.mocked,
      paymentEnforced,
      paidSol: paymentEnforced ? paidSol : 0,
      paymentToken: paymentEnforced ? "SOL" : skill.paymentToken,
      txSignature: paidSig,
      guest: isGuest && !paymentEnforced,
      freeRemaining,
      freeLimit,
      payPerRun: paywallSkill ? payPerRunPublicInfo(trimmedSlug) : null,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Execution failed";
    console.error("[api/execute POST]", message);
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
}
