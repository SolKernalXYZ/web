import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/staking — global stats + optional wallet position
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");

  const stats = await prisma.protocolStats.findUnique({ where: { id: "global" } });

  let position = null;
  if (wallet) {
    position = await prisma.stakePosition.findUnique({ where: { walletAddress: wallet } });
  }

  return NextResponse.json({ stats, position });
}

// POST /api/staking — stake, unstake, or claim
export async function POST(request: Request) {
  try {
    const { action, walletAddress, amount } = await request.json();

    if (!action || !walletAddress) {
      return NextResponse.json({ error: "action and walletAddress required" }, { status: 400 });
    }

    if (action === "stake") {
      if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

      const position = await prisma.stakePosition.upsert({
        where: { walletAddress },
        update: { amount: { increment: amount } },
        create: { walletAddress, amount },
      });

      await prisma.protocolStats.update({
        where: { id: "global" },
        data: { totalStaked: { increment: amount }, uniqueStakers: { increment: position.amount === amount ? 1 : 0 } },
      });

      return NextResponse.json({ success: true, position });
    }

    if (action === "unstake") {
      if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

      const existing = await prisma.stakePosition.findUnique({ where: { walletAddress } });
      if (!existing || existing.amount < amount) {
        return NextResponse.json({ error: "Insufficient staked balance" }, { status: 400 });
      }

      const position = await prisma.stakePosition.update({
        where: { walletAddress },
        data: { amount: { decrement: amount } },
      });

      await prisma.protocolStats.update({ where: { id: "global" }, data: { totalStaked: { decrement: amount } } });

      return NextResponse.json({ success: true, position });
    }

    if (action === "claim") {
      const existing = await prisma.stakePosition.findUnique({ where: { walletAddress } });
      if (!existing || existing.pendingRewards <= 0) {
        return NextResponse.json({ error: "No rewards to claim" }, { status: 400 });
      }

      const claimed = existing.pendingRewards;
      const position = await prisma.stakePosition.update({
        where: { walletAddress },
        data: { pendingRewards: 0, totalClaimed: { increment: claimed } },
      });

      await prisma.protocolStats.update({ where: { id: "global" }, data: { totalDistributed: { increment: claimed } } });

      return NextResponse.json({ success: true, claimed, position });
    }

    return NextResponse.json({ error: "Invalid action. Use: stake, unstake, claim" }, { status: 400 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Staking operation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
