import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const skill = await prisma.skill.findUnique({
    where: { slug: params.slug },
    include: { executions: { take: 5, orderBy: { createdAt: "desc" }, select: { id: true, walletAddress: true, status: true, createdAt: true } } },
  });

  if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  return NextResponse.json(skill);
}
