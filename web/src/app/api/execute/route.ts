import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { executeLLM } from "@/lib/llm";
import { rateLimit } from "@/lib/rateLimit";

const MAX_INPUT_LENGTH = 8_000; // characters
const RATE_LIMIT = 10; // executions
const RATE_WINDOW_MS = 60_000; // per minute, per wallet

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

    if (typeof slug !== "string" || typeof input !== "string" || typeof walletAddress !== "string") {
      return NextResponse.json(
        { error: "slug, input, and walletAddress are required and must be strings" },
        { status: 400 },
      );
    }

    const trimmedInput = input.trim();
    if (!slug || !trimmedInput || !walletAddress) {
      return NextResponse.json(
        { error: "slug, input, and walletAddress must not be empty" },
        { status: 400 },
      );
    }

    if (trimmedInput.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: `Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters` },
        { status: 413 },
      );
    }

    // Best-effort per-wallet rate limiting to curb runaway loops / abuse.
    const limit = rateLimit(`execute:${walletAddress}`, RATE_LIMIT, RATE_WINDOW_MS);
    if (!limit.allowed) {
      const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
      return NextResponse.json(
        { error: "Rate limit exceeded. Please slow down." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }

    const skill = await prisma.skill.findUnique({ where: { slug } });
    if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    if (!skill.active) return NextResponse.json({ error: "Skill is not active" }, { status: 409 });

    const llmResult = await executeLLM({
      provider: skill.provider,
      model: skill.model,
      systemPrompt: skill.systemPrompt,
      userInput: trimmedInput,
    });

    const execution = await prisma.execution.create({
      data: {
        skillId: skill.id,
        walletAddress,
        input: trimmedInput,
        output: llmResult.output,
        feePaid: skill.fee,
        status: "success",
      },
    });

    // Increment counters (best-effort; not in a transaction since they are independent stats).
    await prisma.skill.update({ where: { id: skill.id }, data: { runs: { increment: 1 } } });
    await prisma.protocolStats.update({
      where: { id: "global" },
      data: { totalExecutions: { increment: 1 } },
    });

    return NextResponse.json({
      executionId: execution.id,
      output: llmResult.output,
      feePaid: skill.fee,
      status: "success",
      mocked: llmResult.mocked,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Execution failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
