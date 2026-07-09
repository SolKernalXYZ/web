import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import {
  ALLOWED_CATEGORIES,
  ALLOWED_PROVIDERS,
  MAX_DESCRIPTION_LENGTH,
  MAX_FEE,
  MAX_NAME_LENGTH,
  MAX_PROMPT_LENGTH,
  MIN_FEE,
  PUBLIC_SKILL_SELECT,
  isValidSolanaAddress,
  slugifySkillName,
} from "@/lib/skillsPublic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const provider = searchParams.get("provider");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "popular";

    const where: Record<string, unknown> = { active: true };
    if (category) where.category = category;
    if (provider) where.provider = provider;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy =
      sort === "fee-low"
        ? { fee: "asc" as const }
        : sort === "fee-high"
          ? { fee: "desc" as const }
          : sort === "newest"
            ? { createdAt: "desc" as const }
            : { runs: "desc" as const };

    const skills = await prisma.skill.findMany({
      where,
      orderBy,
      select: PUBLIC_SKILL_SELECT,
    });
    return NextResponse.json(skills);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to list skills";
    // Avoid leaking internal DB details in production responses.
    console.error("[api/skills GET]", message);
    return NextResponse.json({ error: "Failed to list skills" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const {
      name,
      category,
      description,
      tags,
      provider,
      model,
      systemPrompt,
      outputFormat,
      fee,
      paymentToken,
      builderWallet,
    } = body as Record<string, unknown>;

    if (
      typeof name !== "string" ||
      typeof category !== "string" ||
      typeof description !== "string" ||
      typeof provider !== "string" ||
      typeof model !== "string" ||
      typeof systemPrompt !== "string" ||
      typeof builderWallet !== "string"
    ) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    const feeNum = typeof fee === "number" ? fee : parseFloat(String(fee ?? ""));
    if (!Number.isFinite(feeNum) || feeNum < MIN_FEE || feeNum > MAX_FEE) {
      return NextResponse.json(
        { error: `fee must be a number between ${MIN_FEE} and ${MAX_FEE}` },
        { status: 400 },
      );
    }

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    const trimmedPrompt = systemPrompt.trim();
    const trimmedModel = model.trim();
    const trimmedWallet = builderWallet.trim();

    if (!trimmedName || !trimmedDesc || !trimmedPrompt || !trimmedModel || !trimmedWallet) {
      return NextResponse.json({ error: "Required fields must not be empty" }, { status: 400 });
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: `name exceeds ${MAX_NAME_LENGTH} characters` }, { status: 400 });
    }
    if (trimmedDesc.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        { error: `description exceeds ${MAX_DESCRIPTION_LENGTH} characters` },
        { status: 400 },
      );
    }
    if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { error: `systemPrompt exceeds ${MAX_PROMPT_LENGTH} characters` },
        { status: 400 },
      );
    }

    if (!(ALLOWED_CATEGORIES as readonly string[]).includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    if (!(ALLOWED_PROVIDERS as readonly string[]).includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }
    if (!isValidSolanaAddress(trimmedWallet)) {
      return NextResponse.json({ error: "Invalid builderWallet address" }, { status: 400 });
    }

    const limit = rateLimit(`skills-create:${trimmedWallet}`, 5, 60_000);
    if (!limit.allowed) {
      const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
      return NextResponse.json(
        { error: "Rate limit exceeded. Please slow down." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }

    let slug = slugifySkillName(trimmedName);
    if (!slug) {
      return NextResponse.json({ error: "name must contain alphanumeric characters" }, { status: 400 });
    }

    const existing = await prisma.skill.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const format =
      typeof outputFormat === "string" && ["plaintext", "markdown", "json"].includes(outputFormat)
        ? outputFormat
        : "plaintext";

    const skill = await prisma.skill.create({
      data: {
        slug,
        name: trimmedName,
        category,
        description: trimmedDesc,
        tags: typeof tags === "string" ? tags.slice(0, 200) : "",
        provider,
        model: trimmedModel,
        systemPrompt: trimmedPrompt,
        outputFormat: format,
        fee: feeNum,
        paymentToken: typeof paymentToken === "string" && paymentToken ? paymentToken : "$SKRN",
        builderWallet: trimmedWallet,
      },
      select: PUBLIC_SKILL_SELECT,
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to create skill";
    console.error("[api/skills POST]", message);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
