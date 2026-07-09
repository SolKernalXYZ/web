import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Lightweight readiness probe for deploy platforms and uptime checks.
 * Does not expose secrets or full error messages.
 */
export async function GET() {
  const started = Date.now();
  let db: "ok" | "error" = "ok";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    db = "error";
  }

  const llmConfigured = Boolean(
    (process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ACCOUNT_ID) ||
      process.env.GOOGLE_API_KEY ||
      process.env.GROQ_API_KEY ||
      process.env.XAI_API_KEY,
  );

  const healthy = db === "ok";
  const body = {
    status: healthy ? "ok" : "degraded",
    service: "solkernal-web",
    time: new Date().toISOString(),
    latencyMs: Date.now() - started,
    checks: {
      database: db,
      llmProvidersConfigured: llmConfigured,
    },
  };

  return NextResponse.json(body, { status: healthy ? 200 : 503 });
}
