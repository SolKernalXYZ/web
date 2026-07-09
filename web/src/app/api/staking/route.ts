import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isValidSolanaAddress } from "@/lib/skillsPublic";

/**
 * Staking is not live on-chain. GET remains available for future UI.
 * POST is disabled until real Token-2022 / vault programs ship.
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (wallet && !isValidSolanaAddress(wallet)) {
      return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
    }

    const stats = await prisma.protocolStats.findUnique({ where: { id: "global" } });

    let position = null;
    if (wallet) {
      position = await prisma.stakePosition.findUnique({ where: { walletAddress: wallet } });
    }

    return NextResponse.json({
      live: false,
      message: "On-chain staking is not available yet. UI shows coming-soon state.",
      stats: stats ?? {
        id: "global",
        totalStaked: 0,
        totalDistributed: 0,
        totalExecutions: 0,
        uniqueStakers: 0,
      },
      position,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load staking";
    console.error("[api/staking GET]", message);
    return NextResponse.json({ error: "Failed to load staking" }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Staking is not live yet. On-chain stake / unstake / claim will open after $SKRN vault programs deploy.",
      live: false,
    },
    { status: 503 },
  );
}
