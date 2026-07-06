import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const provider = searchParams.get("provider");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "popular";

  const where: Record<string, unknown> = { active: true };
  if (category) where.category = category;
  if (provider) where.provider = provider;
  if (search) where.name = { contains: search };

  const orderBy =
    sort === "fee-low" ? { fee: "asc" as const } :
    sort === "fee-high" ? { fee: "desc" as const } :
    sort === "newest" ? { createdAt: "desc" as const } :
    { runs: "desc" as const };

  const skills = await prisma.skill.findMany({ where, orderBy });
  return NextResponse.json(skills);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, description, tags, provider, model, systemPrompt, outputFormat, fee, paymentToken, builderWallet } = body;

    if (!name || !category || !description || !provider || !model || !systemPrompt || !fee || !builderWallet) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const skill = await prisma.skill.create({
      data: { slug, name, category, description, tags: tags || "", provider, model, systemPrompt, outputFormat: outputFormat || "plaintext", fee, paymentToken: paymentToken || "USDC", builderWallet },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to create skill";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
