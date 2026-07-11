import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/db";
import { executeLLM } from "@/lib/llm";
import { rateLimit } from "@/lib/rateLimit";
import {
  GUEST_WALLET_PREFIX,
  isValidSolanaAddress,
} from "@/lib/skillsPublic";

const MAX_INPUT_LENGTH = 8_000;
const WALLET_RATE_LIMIT = 10;
const WALLET_RATE_WINDOW_MS = 60_000;
const GUEST_RATE_LIMIT = 5;
const GUEST_RATE_WINDOW_MS = 60 * 60 * 1000; // 5 free runs / hour / IP

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

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { slug, input, walletAddress } = body as {
      slug?: unknown;
      input?: unknown;
      walletAddress?: unknown;
    };

    if (typeof slug !== "string" || typeof input !== "string") {
      return NextResponse.json(
        { error: "slug and input are required and must be strings" },
        { status: 400 },
      );
    }

    const trimmedInput = input.trim();
    const trimmedSlug = slug.trim();

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

    if (hasWallet) {
      const trimmedWallet = (walletAddress as string).trim();
      if (!isValidSolanaAddress(trimmedWallet)) {
        return NextResponse.json({ error: "Invalid walletAddress" }, { status: 400 });
      }
      identity = trimmedWallet;
      const limit = rateLimit(`execute:wallet:${identity}`, WALLET_RATE_LIMIT, WALLET_RATE_WINDOW_MS);
      if (!limit.allowed) {
        const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
        return NextResponse.json(
          { error: "Rate limit exceeded. Please slow down." },
          { status: 429, headers: { "Retry-After": String(retryAfter) } },
        );
      }
    } else {
      // Free trial: no wallet required (rate-limited by IP).
      isGuest = true;
      const ip = clientIp(request);
      identity = guestWalletId(ip);
      const limit = rateLimit(`execute:guest:${ip}`, GUEST_RATE_LIMIT, GUEST_RATE_WINDOW_MS);
      if (!limit.allowed) {
        const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
        return NextResponse.json(
          {
            error: "Free trial limit reached (5 runs/hour). Connect a wallet or try again later.",
            guestLimit: true,
          },
          { status: 429, headers: { "Retry-After": String(retryAfter) } },
        );
      }
    }

    const skill = await prisma.skill.findUnique({ where: { slug: trimmedSlug } });
    if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    if (!skill.active) return NextResponse.json({ error: "Skill is not active" }, { status: 409 });

    // NOTE: On-chain fee settlement is not enforced yet. Execution is free at the
    // application layer; feePaid is recorded for accounting/preview only.
    const llmResult = await executeLLM({
      provider: skill.provider,
      model: skill.model,
      systemPrompt: skill.systemPrompt,
      userInput: trimmedInput,
    });

    const execution = await prisma.execution.create({
      data: {
        skillId: skill.id,
        walletAddress: identity,
        input: trimmedInput,
        output: llmResult.output,
        feePaid: skill.fee,
        status: llmResult.mocked ? "mocked" : "success",
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
      feePaid: skill.fee,
      status: execution.status,
      mocked: llmResult.mocked,
      paymentEnforced: false,
      guest: isGuest,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Execution failed";
    console.error("[api/execute POST]", message);
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
}
