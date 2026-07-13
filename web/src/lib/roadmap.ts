/**
 * Canonical product roadmap — keep UI, docs, and repo notes aligned.
 * Status language is honest: shipped vs planned. No fake live claims.
 */

export type RoadmapPhaseId = "shipped" | "building" | "next" | "later";

export type RoadmapItem = {
  title: string;
  detail: string;
};

export type RoadmapPhase = {
  id: RoadmapPhaseId;
  /** Short label for cards / nav */
  status: string;
  /** Subtitle under status */
  label: string;
  /** One-line phase intent */
  summary: string;
  items: RoadmapItem[];
};

/** Last editorial refresh of this roadmap (ISO date). */
export const ROADMAP_UPDATED = "2026-07-12";

export const ROADMAP_TAGLINE =
  "Sequenced by dependency, not hype. Shipped items are live on the web app. Everything else is planned until it ships.";

export const ROADMAP_PRINCIPLES: string[] = [
  "Honesty first: never claim payments, staking yield, or on-chain programs before they work in production.",
  "Wedge before platform: Solana decision tools that pull live data beat a generic AI marketplace.",
  "Revenue before vaults: real pay-per-run and builder payouts before staking yield UI.",
  "Trust before scale: receipts, mock labels, rate limits, and abuse controls before aggressive growth.",
  "Ship one public surface at a time: each milestone must improve something a stranger can use in 30 seconds.",
];

/**
 * Four phases shown on the homepage and nav.
 * Item titles stay short for UI; `detail` is for docs / ROADMAP.md.
 */
export const roadmapPhases: RoadmapPhase[] = [
  {
    id: "shipped",
    status: "Shipped",
    label: "Live on web",
    summary: "What production does today — nothing more.",
    items: [
      {
        title: "Skill marketplace",
        detail: "Browse, search, filter, and open skills from an off-chain registry.",
      },
      {
        title: "Guest free trial",
        detail: "Rate-limited execute without a wallet (identity optional via Phantom).",
      },
      {
        title: "Homepage mint scanner",
        detail: "Paste an SPL mint and run the rug / risk desk path from the landing page.",
      },
      {
        title: "Multi-provider LLM routing",
        detail: "Cloudflare, Gemini, Grok, Groq when keys are set; failures fall back with a clear mock label.",
      },
      {
        title: "Live-data tools",
        detail: "Optional tool calls for mint info, wallets, txs, prices, and market snapshots.",
      },
      {
        title: "Public run receipts",
        detail: "Shareable /r/[id] pages with highlights, copy/share, and Open Graph images (app DB, not chain).",
      },
      {
        title: "Skill publish form",
        detail: "Builders can submit skills to the off-chain registry with listed fees (not paid out yet).",
      },
      {
        title: "Honest product claims",
        detail: "No fake stake TVL, no fake yield; $SKRN fees listed-only; staking not live.",
      },
      {
        title: "SOL pay-per-run (prototype)",
        detail:
          "After free guest quota on rug-risk-scanner, optional SOL transfer to protocol treasury is verified on-chain before extra runs (when treasury env is set).",
      },
    ],
  },
  {
    id: "building",
    status: "Building",
    label: "Near-term product",
    summary: "Next ships that deepen the desk and growth loop — still off-chain where needed.",
    items: [
      {
        title: "Live-data marketplace focus",
        detail: "Featured row and filters for tool-using skills; de-emphasize pure chat wrappers.",
      },
      {
        title: "Structured result cards",
        detail: "Parsed risk score / verdict UI on skill runs and receipts (not just raw markdown).",
      },
      {
        title: "Streaming execution output",
        detail: "Token streaming so long scans feel responsive instead of a blank wait.",
      },
      {
        title: "Docs: trial + Live data",
        detail: "Public docs for free trial limits, mock vs live, and what Live data means.",
      },
      {
        title: "Skill quality bar",
        detail: "Require or badge tool allowlists; improve rug scanner and wallet health prompts/tools.",
      },
      {
        title: "Builder mini-dashboard",
        detail: "Per-builder run counts and recent executions (even before real revenue).",
      },
    ],
  },
  {
    id: "next",
    status: "Next",
    label: "Revenue & distribution",
    summary: "Turn the desk into a business and meet users where they already are.",
    items: [
      {
        title: "Pay-per-run expansion (USDC + more skills)",
        detail: "SOL pay-per-run prototype is live on rug-risk-scanner when treasury is set. Expand to USDC and more skills after usage.",
      },
      {
        title: "Builder fee payouts",
        detail: "Attribute paid runs to builder wallets once settlement exists (split design is planned, not live).",
      },
      {
        title: "Solana Blinks / Actions",
        detail: "Run top skills (e.g. rug scan) from X or other Action surfaces.",
      },
      {
        title: "Telegram /scan bot",
        detail: "Mint scan command for degen distribution without the full site.",
      },
      {
        title: "API keys for bots",
        detail: "Authenticated execute for external bots and partners with rate limits.",
      },
      {
        title: "$SKRN soft utility",
        detail: "Hold-based free tier or fee discount only when verifiable — no fake APY.",
      },
    ],
  },
  {
    id: "later",
    status: "Later",
    label: "Protocol & scale",
    summary: "On-chain and ecosystem only after real usage and fee volume justify complexity.",
    items: [
      {
        title: "On-chain execution receipts",
        detail: "Hash / PDA proofs for runs after app receipts are trusted.",
      },
      {
        title: "On-chain skill registry",
        detail: "Anchor (or equivalent) accounts for canonical skill metadata and status.",
      },
      {
        title: "Staking vaults",
        detail: "Fee-share for stakers only after paid execution volume is real — never vanity APY first.",
      },
      {
        title: "Skill versioning & remix",
        detail: "Fork, version, and remix skills with clear attribution.",
      },
      {
        title: "Builder reputation",
        detail: "Quality and reliability signals for marketplace ranking.",
      },
      {
        title: "Composability / pipelines",
        detail: "Chain multiple skills into multi-step workflows when primitives are solid.",
      },
      {
        title: "Governance & SLA tiers",
        detail: "Parameter governance and higher-SLA API only with enough real usage data.",
      },
    ],
  },
];

/** Explicit non-goals to keep the product focused. */
export const ROADMAP_OUT_OF_SCOPE: string[] = [
  "Training foundation models",
  "Custodial fund management beyond execution settlement",
  "Multi-chain expansion before Solana wedge is winning",
  "DAO theater / governance before product usage",
  "Fake yield, fake TVL, or inflated run counts",
  "Private user data storage on-chain",
];

/** Short titles only — for compact UI (nav dropdown). */
export function roadmapPhaseTitles(phaseId: RoadmapPhaseId): string[] {
  const phase = roadmapPhases.find((p) => p.id === phaseId);
  return phase ? phase.items.map((i) => i.title) : [];
}
