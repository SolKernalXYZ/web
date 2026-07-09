import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PUBLIC_SKILL_SELECT } from "@/lib/skillsPublic";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    if (!params.slug || params.slug.length > 120) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const skill = await prisma.skill.findUnique({
      where: { slug: params.slug },
      select: {
        ...PUBLIC_SKILL_SELECT,
        executions: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            walletAddress: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    return NextResponse.json(skill);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load skill";
    console.error("[api/skills/[slug] GET]", message);
    return NextResponse.json({ error: "Failed to load skill" }, { status: 500 });
  }
}
