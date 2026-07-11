import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import ReceiptShareBar from "@/components/ReceiptShareBar";
import { isLiveDataSkill, maskWallet } from "@/lib/skillsPublic";
import { parseReceiptHighlights, riskTone } from "@/lib/receiptShare";
import { ArrowRight, BoltIcon, ReceiptIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://solkernal.xyz";

type Props = { params: { id: string } };

async function getExecution(id: string) {
  if (!id || id.length > 40) return null;
  return prisma.execution.findUnique({
    where: { id },
    select: {
      id: true,
      input: true,
      output: true,
      status: true,
      feePaid: true,
      walletAddress: true,
      createdAt: true,
      skill: {
        select: {
          name: true,
          slug: true,
          category: true,
          tags: true,
          description: true,
        },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const exec = await getExecution(params.id);
  if (!exec) {
    return { title: "Receipt not found" };
  }

  const highlights = parseReceiptHighlights(exec.output);
  const scoreBit =
    highlights.riskScore != null ? ` · Risk ${highlights.riskScore}/100` : "";
  const verdictBit = highlights.verdict ? ` · ${highlights.verdict}` : "";
  const title = `${exec.skill.name}${scoreBit}${verdictBit}`;
  const shortIn =
    exec.input.length > 100 ? `${exec.input.slice(0, 100)}…` : exec.input;
  const description =
    highlights.summary ||
    `SolKernal public run${scoreBit}${verdictBit}. Input: ${shortIn}. Not financial advice.`;

  const url = `${siteUrl.replace(/\/$/, "")}/r/${exec.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "SolKernal",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function scoreBadgeTone(
  tone: ReturnType<typeof riskTone>,
): "success" | "warning" | "danger" | "neutral" {
  return tone;
}

export default async function ReceiptPage({ params }: Props) {
  const exec = await getExecution(params.id);
  if (!exec) notFound();

  const live = isLiveDataSkill(exec.skill.tags);
  const mocked = exec.status === "mocked";
  const succeeded = exec.status === "success" || mocked;
  const highlights = parseReceiptHighlights(exec.output);
  const tone = riskTone(highlights.riskScore);
  const receiptPath = `/r/${exec.id}`;

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href={`/skills/${exec.skill.slug}`}
        className="group inline-flex items-center gap-1.5 text-small text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowRight size={14} className="rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Run this skill again
      </Link>

      <header className="mt-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent" mono>
            {exec.skill.category}
          </Badge>
          {live && (
            <Badge tone="success" mono>
              Live data
            </Badge>
          )}
          <Badge tone={succeeded ? (mocked ? "warning" : "success") : "danger"} mono>
            {exec.status}
          </Badge>
        </div>
        <h1 className="text-h1">{exec.skill.name}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-small text-text-tertiary">
          <span className="inline-flex items-center gap-1.5">
            <ReceiptIcon size={13} />
            {exec.id.slice(0, 8)}…
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BoltIcon size={13} />
            {maskWallet(exec.walletAddress)}
          </span>
          <span>{new Date(exec.createdAt).toLocaleString()}</span>
        </div>
        <p className="max-w-prose text-body text-text-secondary">
          Public execution receipt. Share this link — not financial advice.
        </p>
      </header>

      {/* Highlight strip — tweetable at a glance */}
      {(highlights.riskScore != null || highlights.verdict || highlights.summary) && (
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {highlights.riskScore != null && (
            <div className="rounded-xl border border-border bg-bg-subtle p-5">
              <p className="font-mono text-tiny uppercase tracking-[0.14em] text-text-tertiary">Risk score</p>
              <p
                className={`mt-2 font-mono text-display font-bold tabular-nums ${
                  tone === "danger"
                    ? "text-danger"
                    : tone === "warning"
                      ? "text-warning"
                      : tone === "success"
                        ? "text-success"
                        : "text-text-primary"
                }`}
              >
                {highlights.riskScore}
                <span className="text-body font-medium text-text-tertiary"> /100</span>
              </p>
              <Badge tone={scoreBadgeTone(tone)} mono className="mt-2">
                {tone === "danger" ? "Higher risk" : tone === "warning" ? "Caution zone" : "Lower risk band"}
              </Badge>
            </div>
          )}
          {highlights.verdict && (
            <div className="rounded-xl border border-border bg-bg-subtle p-5">
              <p className="font-mono text-tiny uppercase tracking-[0.14em] text-text-tertiary">Verdict</p>
              <p className="mt-2 font-mono text-h2 font-bold text-text-primary">{highlights.verdict}</p>
              <p className="mt-2 text-small text-text-tertiary">Parsed from model output · not a guarantee</p>
            </div>
          )}
          {highlights.summary && (
            <div className={`rounded-xl border border-border bg-bg-subtle p-5 ${highlights.riskScore == null && !highlights.verdict ? "sm:col-span-3" : ""}`}>
              <p className="font-mono text-tiny uppercase tracking-[0.14em] text-text-tertiary">Summary</p>
              <p className="mt-2 text-body text-text-primary">{highlights.summary}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <ReceiptShareBar
          skillName={exec.skill.name}
          input={exec.input}
          receiptPath={receiptPath}
          riskScore={highlights.riskScore}
          verdict={highlights.verdict}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="space-y-3">
          <h2 className="font-mono text-tiny uppercase tracking-[0.16em] text-text-tertiary">Input</h2>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-bg-subtle p-4 font-mono text-small text-text-primary">
            {exec.input}
          </pre>
          <p className="text-mono-sm text-text-tertiary">
            Listed fee {Number(exec.feePaid).toLocaleString(undefined, { maximumFractionDigits: 2 })} $SKRN · payment not
            enforced yet
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-mono text-tiny uppercase tracking-[0.16em] text-text-tertiary">Full output</h2>
          {mocked && (
            <div className="rounded-md border border-warning/40 bg-warning-subtle px-3 py-2 text-small text-warning" role="status">
              Mock response — live LLM keys were not used for this run.
            </div>
          )}
          <pre
            className={`max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-lg border p-4 font-mono text-small ${
              succeeded
                ? "border-border bg-bg-subtle text-text-primary"
                : "border-danger/40 bg-danger-subtle text-danger"
            }`}
          >
            {exec.output}
          </pre>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={`/skills/${exec.skill.slug}`}>
          <Button variant="accent" trailingIcon={<ArrowRight size={16} />}>
            Run again
          </Button>
        </Link>
        <Link href="/skills">
          <Button variant="secondary">Browse skills</Button>
        </Link>
        <Link href="/">
          <Button variant="ghost">Scan a mint on home</Button>
        </Link>
      </div>
    </div>
  );
}
