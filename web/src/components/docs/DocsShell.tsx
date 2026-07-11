import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/cn";
import { DocBlock, DocPage, docHref, docNav, docsBySlug, getDoc, getNextDoc } from "@/lib/docs";
import { ArrowRight, CheckIcon, ReceiptIcon } from "@/components/icons";
import DocsSearch from "./DocsSearch";

type DocsShellProps = {
  slug?: string;
};

export default function DocsShell({ slug }: DocsShellProps) {
  const doc = getDoc(slug);
  if (!doc) notFound();

  const next = getNextDoc(doc.slug);
  const related = doc.related?.map((relatedSlug) => docsBySlug.get(relatedSlug)).filter(Boolean) as DocPage[] | undefined;

  return (
    <div className="border-t border-border bg-bg-primary">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_240px]">
        <aside className="border-b border-border bg-bg-subtle/60 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="p-4 sm:p-6">
            <Link href="/docs" className="font-mono text-small font-semibold uppercase tracking-[0.16em] text-text-primary">
              Docs
            </Link>
            <p className="mt-2 text-small text-text-secondary">Build, publish, execute, and stake on SolKernal.</p>
            <div className="mt-5">
              <DocsSearch />
            </div>
            <nav aria-label="Docs navigation" className="mt-6 space-y-6">
              {docNav.map((group) => (
                <div key={group.title}>
                  <p className="font-mono text-tiny uppercase tracking-[0.14em] text-text-tertiary">{group.title}</p>
                  <ul className="mt-2 space-y-1">
                    {group.pages.map((pageSlug) => {
                      const page = docsBySlug.get(pageSlug);
                      if (!page) return null;
                      const active = page.slug === doc.slug;
                      return (
                        <li key={page.slug}>
                          <Link
                            href={docHref(page.slug)}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "block rounded-md px-2.5 py-2 text-small transition-colors",
                              active
                                ? "bg-bg-primary font-medium text-text-primary shadow-sm"
                                : "text-text-secondary hover:bg-bg-hover hover:text-text-primary",
                            )}
                          >
                            {page.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <article className="min-w-0 px-4 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-small text-text-tertiary">
              <Link href="/docs" className="transition-colors hover:text-text-primary">
                Docs
              </Link>
              <span>/</span>
              <span>{doc.category}</span>
            </div>

            <header className="mt-5 border-b border-border pb-8">
              <h1 className="text-display-sm">{doc.title}</h1>
              <p className="mt-4 text-body-lg text-text-secondary">{doc.description}</p>
              <p className="mt-5 font-mono text-mono-sm text-text-tertiary">Last updated {doc.updated}</p>
            </header>

            <div className="docs-prose mt-9 space-y-11">
              {doc.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="text-h2">{section.title}</h2>
                  <div className="mt-4 space-y-4">
                    {section.blocks.map((block, index) => (
                      <DocBlockView block={block} key={`${section.id}-${index}`} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {related?.length ? (
              <section aria-labelledby="related-pages" className="mt-14 border-t border-border pt-8">
                <h2 id="related-pages" className="text-h3">
                  Related pages
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {related.map((page) => (
                    <Link key={page.slug} href={docHref(page.slug)} className="group rounded-lg border border-border bg-bg-subtle p-4 transition-colors hover:border-border-focused">
                      <span className="flex items-center gap-2 font-medium text-text-primary">
                        <ReceiptIcon size={16} className="text-accent" />
                        {page.title}
                      </span>
                      <span className="mt-1.5 line-clamp-2 block text-small text-text-secondary">{page.description}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {next ? (
              <Link href={docHref(next.slug)} className="mt-8 flex items-center justify-between rounded-lg border border-border bg-bg-subtle p-4 transition-colors hover:border-border-focused">
                <span>
                  <span className="block font-mono text-tiny uppercase tracking-[0.14em] text-text-tertiary">Next</span>
                  <span className="mt-1 block font-medium text-text-primary">{next.title}</span>
                </span>
                <ArrowRight size={18} className="text-text-tertiary" />
              </Link>
            ) : null}
          </div>
        </article>

        <aside className="hidden border-l border-border px-6 py-14 xl:block">
          <div className="sticky top-28">
            <p className="font-mono text-tiny uppercase tracking-[0.14em] text-text-tertiary">On this page</p>
            <nav aria-label="On this page" className="mt-3">
              <ul className="space-y-2">
                {doc.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-small text-text-secondary transition-colors hover:text-text-primary">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DocBlockView({ block }: { block: DocBlock }) {
  if (block.type === "p") return <p className="text-body text-text-secondary">{block.text}</p>;

  if (block.type === "ul") {
    return (
      <ul className="space-y-2.5">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3 text-body text-text-secondary">
            <CheckIcon size={16} className="mt-1 shrink-0 text-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "ol") {
    return (
      <ol className="space-y-3">
        {block.items.map((item, index) => (
          <li key={item} className="grid grid-cols-[2rem_1fr] gap-3 text-body text-text-secondary">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-bg-subtle font-mono text-mono-sm text-text-tertiary">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "callout") {
    const tone = block.tone ?? "accent";
    return (
      <div
        className={cn(
          "rounded-lg border p-4",
          tone === "warning" && "border-warning/30 bg-warning-subtle/50",
          tone === "success" && "border-success/30 bg-success-subtle/50",
          tone === "accent" && "border-accent/30 bg-accent-subtle/50",
        )}
      >
        <p className="font-medium text-text-primary">{block.title}</p>
        <p className="mt-1.5 text-small text-text-secondary">{block.text}</p>
      </div>
    );
  }

  if (block.type === "code") {
    return (
      <pre className="overflow-x-auto rounded-lg border border-border bg-bg-subtle p-4 text-mono text-text-primary">
        <code>{block.code}</code>
      </pre>
    );
  }

  if (block.type === "visual") return <DocVisual variant={block.variant} />;

  if (block.type === "table") {
    return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full border-collapse text-left text-small">
        <thead className="bg-bg-subtle text-text-primary">
          <tr>
            {block.headers.map((header) => (
              <th key={header} className="border-b border-border px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {block.rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`} className="px-4 py-3 text-text-secondary">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
  }

  return null;
}

function DocVisual({ variant }: { variant: Extract<DocBlock, { type: "visual" }>["variant"] }) {
  if (variant === "system-map") return <SystemMapVisual />;
  if (variant === "execution-flow") return <ExecutionFlowVisual />;
  if (variant === "fee-split") return <FeeSplitVisual />;
  if (variant === "architecture") return <ArchitectureVisual />;
  if (variant === "roadmap") return <RoadmapVisual />;
  return <StakingRevenueVisual />;
}

function VisualFrame({ title, caption, children }: { title: string; caption: string; children: React.ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-bg-subtle">
      <div className="border-b border-border bg-bg-primary px-4 py-3">
        <figcaption className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <span className="font-medium text-text-primary">{title}</span>
          <span className="font-mono text-mono-sm text-text-tertiary">{caption}</span>
        </figcaption>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </figure>
  );
}

function VisualNode({ label, detail, tone = "default" }: { label: string; detail: string; tone?: "default" | "accent" | "success" }) {
  return (
    <div
      className={cn(
        "rounded-md border bg-bg-primary p-3 shadow-sm",
        tone === "accent" && "border-accent/40",
        tone === "success" && "border-success/40",
        tone === "default" && "border-border",
      )}
    >
      <p className="font-mono text-mono-sm uppercase tracking-[0.12em] text-text-tertiary">{label}</p>
      <p className="mt-1 text-small text-text-secondary">{detail}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center text-text-tertiary" aria-hidden="true">
      <ArrowRight size={18} className="hidden sm:block" />
      <div className="h-5 w-px bg-border sm:hidden" />
    </div>
  );
}

function SystemMapVisual() {
  return (
    <VisualFrame title="SolKernal mental model" caption="skill -> execution -> revenue">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
        <VisualNode label="Skills" detail="Versioned prompt bundles with pricing, ownership, routing, and public metadata." tone="accent" />
        <FlowArrow />
        <VisualNode label="Executions" detail="Wallet-triggered runs through the LLM adapter, saved with receipt metadata." />
        <FlowArrow />
        <VisualNode label="Revenue" detail="Fees split to builders, $SKRN stakers, and protocol treasury." tone="success" />
      </div>
    </VisualFrame>
  );
}

function ExecutionFlowVisual() {
  const steps = [
    ["01", "Publish", "Builder submits skill metadata and prompt."],
    ["02", "Discover", "User opens marketplace, API, or Blink."],
    ["03", "Execute", "Input routes through SolKernal to the LLM."],
    ["04", "Receipt", "Result and output hash are recorded."],
    ["05", "Settle", "Fee attribution updates protocol stats."],
  ];

  return (
    <VisualFrame title="Execution lifecycle" caption="end-to-end flow">
      <div className="grid gap-2 sm:grid-cols-5">
        {steps.map(([n, title, detail], index) => (
          <div key={n} className="relative rounded-md border border-border bg-bg-primary p-3">
            <span className="font-mono text-mono-sm text-accent">{n}</span>
            <p className="mt-2 font-medium text-text-primary">{title}</p>
            <p className="mt-1 text-small text-text-secondary">{detail}</p>
            {index < steps.length - 1 ? (
              <span className="absolute -right-2 top-7 hidden h-4 w-4 items-center justify-center rounded-full border border-border bg-bg-subtle text-text-tertiary sm:flex">
                <ArrowRight size={10} />
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function FeeSplitVisual() {
  const segments = [
    { label: "Stakers", value: "50%", className: "bg-success" },
    { label: "Builder", value: "30%", className: "bg-accent" },
    { label: "Treasury", value: "20%", className: "bg-warning" },
  ];

  return (
    <VisualFrame title="Execution fee split" caption="planned design — not live">
      <div className="overflow-hidden rounded-md border border-border bg-bg-primary">
        <div className="flex h-4 w-full">
          <div className="bg-success" style={{ width: "50%" }} />
          <div className="bg-accent" style={{ width: "30%" }} />
          <div className="bg-warning" style={{ width: "20%" }} />
        </div>
        <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {segments.map((segment) => (
            <div key={segment.label} className="p-4">
              <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", segment.className)} />
                <span className="font-medium text-text-primary">{segment.label}</span>
              </div>
              <p className="mt-2 font-mono text-h2 text-text-primary">{segment.value}</p>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

function ArchitectureVisual() {
  return (
    <VisualFrame title="Application architecture" caption="current app + protocol layer">
      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <VisualNode label="Web app" detail="Marketplace, docs, run, submit, and staking surfaces." tone="accent" />
          <VisualNode label="API routes" detail="Skills, execution, staking, rate limits, and validation." />
          <VisualNode label="Database" detail="Prisma index for skills, executions, and protocol stats." />
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <VisualNode label="LLM adapter" detail="Provider routing with Cloudflare Workers AI and safe fallback." />
          <FlowArrow />
          <VisualNode label="Solana programs" detail="Registry, receipts, staking pool, and fee router planned for production." tone="success" />
        </div>
      </div>
    </VisualFrame>
  );
}

function StakingRevenueVisual() {
  const bars = [
    { label: "Execution fees", value: "100%", width: "100%", tone: "bg-accent" },
    { label: "Staker pool", value: "50%", width: "50%", tone: "bg-success" },
    { label: "Builder rewards", value: "30%", width: "30%", tone: "bg-accent" },
    { label: "Treasury", value: "20%", width: "20%", tone: "bg-warning" },
  ];

  return (
    <VisualFrame title="Planned fee split" caption="design only — not live">
      <div className="space-y-3 rounded-md border border-border bg-bg-primary p-4">
        {bars.map((bar) => (
          <div key={bar.label} className="grid gap-2 sm:grid-cols-[8rem_1fr_3rem] sm:items-center">
            <span className="text-small text-text-secondary">{bar.label}</span>
            <div className="h-2.5 overflow-hidden rounded-full bg-bg-hover">
              <div className={cn("h-full rounded-full", bar.tone)} style={{ width: bar.width }} />
            </div>
            <span className="font-mono text-mono-sm text-text-tertiary">{bar.value}</span>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function RoadmapVisual() {
  const stages = [
    ["01", "Shipped", "Marketplace, free trial, mint scanner, tools, /r receipts, honest claims."],
    ["02", "Building", "Live-data focus, structured results, streaming, builder mini-dashboard."],
    ["03", "Next", "Pay-per-run, builder payouts, Blinks, Telegram, API keys, soft $SKRN utility."],
    ["04", "Later", "On-chain receipts, registry, stake vaults after volume, remix, governance."],
  ];

  return (
    <VisualFrame title="Product roadmap" caption="sequenced · no fake live claims">
      <div className="relative">
        <div className="absolute left-[1.05rem] top-4 hidden h-[calc(100%-2rem)] w-px bg-border sm:block" aria-hidden="true" />
        <div className="grid gap-3">
          {stages.map(([n, title, detail]) => (
            <div key={n} className="relative grid gap-3 rounded-md border border-border bg-bg-primary p-3 sm:grid-cols-[2.2rem_1fr] sm:items-start">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-accent/40 bg-accent-subtle font-mono text-mono-sm text-accent">
                {n}
              </span>
              <span>
                <span className="block font-medium text-text-primary">{title}</span>
                <span className="mt-1 block text-small text-text-secondary">{detail}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
