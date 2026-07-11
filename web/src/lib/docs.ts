export type DocBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; title: string; text: string; tone?: "accent" | "warning" | "success" }
  | { type: "code"; language: string; code: string }
  | { type: "visual"; variant: "system-map" | "execution-flow" | "fee-split" | "architecture" | "staking-revenue" | "roadmap" }
  | { type: "table"; headers: string[]; rows: string[][] };

export type DocSection = {
  id: string;
  title: string;
  blocks: DocBlock[];
};

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  category: string;
  updated: string;
  sections: DocSection[];
  related?: string[];
};

export const docNav = [
  {
    title: "Get started",
    pages: ["introduction", "quickstart", "authentication"],
  },
  {
    title: "Core concepts",
    pages: ["how-solkernal-works", "skills", "execution-receipts", "architecture"],
  },
  {
    title: "Guides",
    pages: ["execute-a-skill", "publish-a-skill", "solana-blinks", "staking"],
  },
  {
    title: "API reference",
    pages: ["api-overview", "skills-api", "execution-api", "staking-api"],
  },
  {
    title: "Token",
    pages: ["skrn-token", "supply-and-distribution", "treasury-and-revenue", "governance"],
  },
  {
    title: "Platform",
    pages: ["security", "production-checklist", "roadmap", "troubleshooting", "faq"],
  },
];

export const docs: DocPage[] = [
  {
    slug: "introduction",
    title: "Introduction",
    description:
      "SolKernal is a web marketplace for Solana-oriented AI skills. Payments, staking, and on-chain registry are planned — not live yet.",
    category: "Get started",
    updated: "July 11, 2026",
    related: ["quickstart", "how-solkernal-works"],
    sections: [
      {
        id: "what-is-solkernal",
        title: "What is SolKernal",
        blocks: [
          {
            type: "p",
            text: "SolKernal is a web marketplace and execution layer for AI skills aimed at Solana users. A skill is a versioned prompt bundle with metadata, inputs, listed pricing, provider routing, and a public run surface.",
          },
          {
            type: "p",
            text: "Live today: browse skills, free guest trial runs (rate-limited), multi-provider LLM routing, optional live tools, and app-database receipts. Not live: wallet payment enforcement, $SKRN fee payouts, staking vaults, Blinks, or on-chain skill accounts.",
          },
          {
            type: "ul",
            items: [
              "Builders can publish prompt bundles to the off-chain registry.",
              "Users can run skills for free under rate limits; listed fees are not charged yet.",
              "Staking and 50% fee share are planned designs only — not active.",
              "Each execution can create an app receipt (input/output). On-chain hashes are not live.",
            ],
          },
        ],
      },
      {
        id: "who-it-is-for",
        title: "Who it is for",
        blocks: [
          {
            type: "table",
            headers: ["Audience", "What SolKernal gives them today"],
            rows: [
              ["AI builders", "A place to list reusable prompt/tool skills (earnings when settlement ships)."],
              ["End users", "Decision tools (e.g. mint risk) without claiming paid or staked utility yet."],
              ["Protocol teams", "A web surface that can grow into Blinks and embeds — roadmap, not shipped."],
              ["Token holders", "No enforced product utility today; planned utility is not a promise of yield."],
            ],
          },
        ],
      },
      {
        id: "mental-model",
        title: "The mental model",
        blocks: [
          {
            type: "p",
            text: "Three primitives: skills, executions, and (later) revenue routing. Skills define what can run. Executions record what happened in the app. Revenue routing to builders/stakers/treasury is designed for when on-chain settlement exists — it does not run today.",
          },
          {
            type: "visual",
            variant: "system-map",
          },
          {
            type: "callout",
            title: "V1 implementation",
            text: "The current app includes the marketplace, execution API, staking dashboard, submission flow, database receipts, and mock-safe LLM fallback. Full Anchor programs, Token-2022 mint deployment, and production Solana settlement are the next protocol layer.",
            tone: "accent",
          },
        ],
      },
      {
        id: "start-here",
        title: "Start here",
        blocks: [
          {
            type: "ul",
            items: [
              "Use Quickstart to run the app locally and seed the first skills.",
              "Read How SolKernal works for the end-to-end execution lifecycle.",
              "Open API overview when wiring an external client or agent.",
              "Use Production checklist before mainnet or public beta deployment.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "quickstart",
    title: "Quickstart",
    description: "Run SolKernal locally, seed the marketplace, and execute your first skill in a few minutes.",
    category: "Get started",
    updated: "July 2, 2026",
    related: ["authentication", "execute-a-skill"],
    sections: [
      {
        id: "requirements",
        title: "Requirements",
        blocks: [
          { type: "ul", items: ["Node.js 20 or newer.", "npm 10 or newer.", "A local SQLite-compatible environment.", "A Solana wallet such as Phantom for wallet-connected flows."] },
        ],
      },
      {
        id: "install",
        title: "Install and run",
        blocks: [
          {
            type: "code",
            language: "bash",
            code: "cd web\nnpm install\nnpx prisma migrate dev\nnpm run db:seed\nnpm run dev",
          },
          {
            type: "p",
            text: "Open http://localhost:3000. The seed script creates sample skills and protocol stats so the marketplace, detail pages, run flow, and staking dashboard have realistic data immediately.",
          },
        ],
      },
      {
        id: "environment",
        title: "Environment variables",
        blocks: [
          {
            type: "table",
            headers: ["Variable", "Required", "Purpose"],
            rows: [
              ["DATABASE_URL", "Yes", "Prisma database connection, usually file:./dev.db locally."],
              ["NEXT_PUBLIC_SITE_URL", "No", "Canonical URL used for metadata and generated links."],
              ["NEXT_PUBLIC_SOLANA_RPC_URL", "No", "Solana RPC endpoint. Defaults to devnet in the app."],
              ["NEXT_PUBLIC_SOLANA_NETWORK", "No", "Cluster label such as devnet or mainnet-beta."],
              ["NEXT_PUBLIC_SKRN_MINT_ADDRESS", "No", "Public $SKRN mint address once the token is deployed."],
              ["CLOUDFLARE_API_TOKEN", "No", "Enables real Cloudflare Workers AI execution."],
              ["CLOUDFLARE_ACCOUNT_ID", "No", "Cloudflare account ID for the Workers AI endpoint."],
              ["GOOGLE_API_KEY", "No", "Enables Google Gemini execution."],
              ["GROQ_API_KEY", "No", "Enables Groq execution."],
              ["XAI_API_KEY", "No", "Enables Grok (xAI) execution via OpenAI-compatible API."],
              ["TAVILY_API_KEY", "No", "Optional web search tool for tool-calling models."],
            ],
          },
          {
            type: "callout",
            title: "Current status",
            text: "The web marketplace and multi-provider LLM execution are live. On-chain fee settlement, Blinks, and staking vaults are not live yet. Execution uses wallet identity without charging $SKRN until settlement ships.",
            tone: "warning",
          },
          {
            type: "callout",
            title: "Safe local fallback",
            text: "If provider credentials are missing or the upstream LLM call fails, execution returns a clearly labeled mock result. This keeps local development deterministic and avoids broken demo flows.",
            tone: "success",
          },
        ],
      },
    ],
  },
  {
    slug: "authentication",
    title: "Authentication",
    description: "Wallet identity, server trust boundaries, and API hygiene for SolKernal integrations.",
    category: "Get started",
    updated: "July 2, 2026",
    related: ["security", "api-overview"],
    sections: [
      {
        id: "wallet-first",
        title: "Wallet-first identity",
        blocks: [
          { type: "p", text: "SolKernal uses Solana wallet addresses as the primary public identity. A builder wallet owns submitted skills, an executor wallet signs execution intent, and a staker wallet owns staking position state." },
          { type: "ul", items: ["Never treat a plain wallet string as proof of control for privileged actions.", "Use signed messages or transaction signatures before allowing paid, builder-owned, or staking-sensitive operations.", "Keep API routes responsible for validation and rate limiting, even when UI forms already validate inputs."] },
        ],
      },
      {
        id: "api-keys",
        title: "Service credentials",
        blocks: [
          { type: "p", text: "LLM provider keys and database credentials must stay server-side. The browser should only receive public values such as site URL, Solana RPC URL, network label, and token mint address." },
          { type: "code", language: "bash", code: "CLOUDFLARE_API_TOKEN=...\nCLOUDFLARE_ACCOUNT_ID=...\nGOOGLE_API_KEY=...\nXAI_API_KEY=...\nDATABASE_URL=file:./dev.db" },
        ],
      },
    ],
  },
  {
    slug: "how-solkernal-works",
    title: "How SolKernal works",
    description: "The complete lifecycle from skill publication to execution, receipt creation, and revenue distribution.",
    category: "Core concepts",
    updated: "July 2, 2026",
    related: ["skills", "execution-receipts", "treasury-and-revenue"],
    sections: [
      {
        id: "lifecycle",
        title: "Execution lifecycle",
        blocks: [
          {
            type: "visual",
            variant: "execution-flow",
          },
          {
            type: "ol",
            items: [
              "A builder publishes a skill with name, description, category, prompt template, model provider, fee, and wallet address.",
              "A user discovers the skill in the marketplace, opens a Blink, or calls the API.",
              "The app validates input, wallet identity, skill status, rate limits, and payment assumptions.",
              "The LLM engine injects user input into the skill prompt and routes to the configured provider.",
              "The result is returned to the user and an execution receipt is saved with fee, wallet, provider, output hash, and timestamp.",
              "Protocol stats update and the fee model attributes value to builder, stakers, and treasury.",
            ],
          },
        ],
      },
      {
        id: "fee-split",
        title: "Fee split",
        blocks: [
          {
            type: "visual",
            variant: "fee-split",
          },
          {
            type: "table",
            headers: ["Recipient", "Share", "Reason"],
            rows: [
              ["Builder", "30%", "Rewards the author of the skill that generated value."],
              ["Stakers", "50%", "Turns protocol usage into non-inflationary $SKRN yield."],
              ["Protocol treasury", "20%", "Funds infrastructure, moderation, audits, and ecosystem growth."],
            ],
          },
        ],
      },
      {
        id: "what-solkernal-is-not",
        title: "What SolKernal is not",
        blocks: [
          {
            type: "ul",
            items: [
              "It is not an LLM host. It coordinates execution across external or configured providers.",
              "It is not a centralized SaaS subscription bundle. Pricing is attached to each skill execution.",
              "It is not an EVM marketplace in v1. The product is designed around Solana primitives.",
              "It is not a place to store private user data on-chain. Receipts should contain hashes and metadata, not sensitive content.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "skills",
    title: "Skills",
    description: "A skill is a versioned AI capability with metadata, prompt instructions, input expectations, routing, pricing, and ownership.",
    category: "Core concepts",
    updated: "July 2, 2026",
    related: ["publish-a-skill", "execute-a-skill"],
    sections: [
      {
        id: "skill-fields",
        title: "Skill fields",
        blocks: [
          {
            type: "table",
            headers: ["Field", "Description"],
            rows: [
              ["Name and slug", "Human-readable title and stable URL identifier."],
              ["Description", "Clear explanation of what the skill does and what the user receives."],
              ["Category and tags", "Discovery metadata used by search, filters, and marketplace grouping."],
              ["System prompt", "The core instruction bundle sent to the LLM provider."],
              ["Provider and model", "Execution route, currently Cloudflare Workers AI compatible in the local app."],
              ["Fee", "Per-execution price shown before the user runs the skill."],
              ["Builder wallet", "Public wallet credited as the skill owner."],
              ["Version", "Audit-friendly version label such as v1.0.0."],
            ],
          },
        ],
      },
      {
        id: "quality-bar",
        title: "Quality bar",
        blocks: [
          {
            type: "ul",
            items: [
              "The description should explain the output shape, not only the topic.",
              "Prompts should be specific, bounded, and safe against prompt-injection attempts.",
              "Fees should match expected model cost and user value.",
              "Tags should describe function and audience, not marketing slogans.",
              "Future versions should preserve backward compatibility or clearly document breaking changes.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "execution-receipts",
    title: "Execution receipts",
    description: "Receipts create a verifiable trail for skill runs, payments, providers, and output hashes.",
    category: "Core concepts",
    updated: "July 2, 2026",
    related: ["execute-a-skill", "security"],
    sections: [
      {
        id: "receipt-data",
        title: "Receipt data",
        blocks: [
          {
            type: "p",
            text: "Every execution should leave behind enough data to prove what ran without exposing private prompt content or sensitive user input. The current app stores receipts in the database; the production protocol design writes compact receipt proofs to Solana accounts.",
          },
          {
            type: "table",
            headers: ["Attribute", "Purpose"],
            rows: [
              ["Skill ID", "Identifies which skill was run."],
              ["Executor wallet", "Connects the run to the paying public wallet."],
              ["Fee paid", "Supports accounting and revenue distribution."],
              ["Provider", "Shows which LLM route produced the output."],
              ["Output hash", "Verifies the returned result without storing full private output on-chain."],
              ["Timestamp", "Supports audit, analytics, and dispute review."],
            ],
          },
        ],
      },
      {
        id: "privacy",
        title: "Privacy model",
        blocks: [
          { type: "callout", title: "Keep receipts compact", text: "Never write private prompts, user secrets, API keys, documents, or full LLM outputs to a public ledger. Store hashes and references only.", tone: "warning" },
        ],
      },
    ],
  },
  {
    slug: "architecture",
    title: "Architecture",
    description: "How the web app, API routes, Prisma database, LLM engine, wallet layer, and future Solana programs fit together.",
    category: "Core concepts",
    updated: "July 2, 2026",
    related: ["api-overview", "production-checklist"],
    sections: [
      {
        id: "current-app",
        title: "Current app architecture",
        blocks: [
          {
            type: "visual",
            variant: "architecture",
          },
          {
            type: "table",
            headers: ["Layer", "Technology"],
            rows: [
              ["Framework", "Next.js 14 App Router and TypeScript."],
              ["Database", "Prisma with SQLite locally."],
              ["Wallet", "@solana/wallet-adapter with Phantom support."],
              ["LLM", "Cloudflare Workers AI through an OpenAI-compatible server-side adapter."],
              ["Styling", "Tailwind CSS design tokens with light and dark themes."],
              ["Deployment", "Vercel or Docker."],
            ],
          },
        ],
      },
      {
        id: "future-programs",
        title: "Future Solana program layer",
        blocks: [
          {
            type: "ul",
            items: [
              "Skill Registry Program for canonical on-chain skill metadata and status.",
              "Staking Pool Program for $SKRN deposits, reward accounting, and claims.",
              "Execution Log Program for compact execution receipt accounts.",
              "Fee Router Program for atomic split between builder, stakers, and treasury.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "execute-a-skill",
    title: "Execute a skill",
    description: "Run any active skill from the marketplace, skill detail page, or API.",
    category: "Guides",
    updated: "July 2, 2026",
    related: ["execution-api", "execution-receipts"],
    sections: [
      {
        id: "web-flow",
        title: "Web flow",
        blocks: [
          {
            type: "ol",
            items: [
              "Open the Skills marketplace and select a skill.",
              "Connect a wallet so the execution can be attributed to a public address.",
              "Enter the main input and optional context.",
              "Review the fee and execute the skill.",
              "Read the result and inspect recent executions or receipt metadata.",
            ],
          },
        ],
      },
      {
        id: "api-flow",
        title: "API flow",
        blocks: [
          {
            type: "code",
            language: "bash",
            code: "curl -X POST http://localhost:3000/api/execute \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"slug\":\"market-research-agent\",\"input\":\"Analyze Solana wallet tooling\",\"walletAddress\":\"YOUR_WALLET\"}'",
          },
        ],
      },
    ],
  },
  {
    slug: "publish-a-skill",
    title: "Publish a skill",
    description: "Prepare, price, and submit a new AI skill to the SolKernal marketplace.",
    category: "Guides",
    updated: "July 2, 2026",
    related: ["skills", "skills-api"],
    sections: [
      {
        id: "before-submit",
        title: "Before you submit",
        blocks: [
          {
            type: "ul",
            items: [
              "Write a clear system prompt with explicit output requirements.",
              "Choose a category that matches the user's job to be done.",
              "Set a price that covers model cost and leaves room for the protocol split.",
              "Test the prompt locally with normal, edge-case, and adversarial inputs.",
              "Use a wallet address you control as the builder wallet.",
            ],
          },
        ],
      },
      {
        id: "submission-checklist",
        title: "Submission checklist",
        blocks: [
          {
            type: "ol",
            items: [
              "Open Submit.",
              "Fill in name, description, category, tags, fee, provider, model, and system prompt.",
              "Connect wallet.",
              "Submit the skill.",
              "Open the generated skill page and run a test execution.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "solana-blinks",
    title: "Solana Blinks",
    description: "Expose SolKernal skills as shareable Solana Actions links that can run from social and wallet surfaces.",
    category: "Guides",
    updated: "July 2, 2026",
    related: ["execute-a-skill", "api-overview"],
    sections: [
      {
        id: "blink-model",
        title: "Blink model",
        blocks: [
          {
            type: "p",
            text: "A Blink turns a skill into a URL that a Blink-aware client can render as an action card. The client fetches metadata, shows inputs and fee context, and submits the user's signed action back to the execution endpoint.",
          },
          {
            type: "code",
            language: "text",
            code: "https://api.solkernal.xyz/blink/{skill_id}",
          },
        ],
      },
      {
        id: "implementation-notes",
        title: "Implementation notes",
        blocks: [
          {
            type: "ul",
            items: [
              "Metadata should include title, icon, description, labels, and expected input fields.",
              "POST handlers must verify signed transaction payloads before execution.",
              "Blink responses should return concise outputs because clients may have limited display space.",
              "Every Blink execution should still create a normal SolKernal receipt.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "staking",
    title: "Staking",
    description: "Stake $SKRN to participate in protocol revenue generated by skill executions.",
    category: "Guides",
    updated: "July 2, 2026",
    related: ["skrn-token", "treasury-and-revenue"],
    sections: [
      {
        id: "how-rewards-work",
        title: "How rewards work",
        blocks: [
          {
            type: "visual",
            variant: "staking-revenue",
          },
          {
            type: "p",
            text: "Planned design only: stakers would receive a share of execution fees when on-chain settlement is live. No stake deposits or rewards are active today.",
          },
          {
            type: "table",
            headers: ["Action", "Effect"],
            rows: [
              ["Stake", "Locks $SKRN into the staking position and increases reward share."],
              ["Unstake", "Returns selected $SKRN and claims pending rewards in the same flow where supported."],
              ["Claim", "Collects pending $SKRN rewards without changing the staked amount."],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "api-overview",
    title: "API overview",
    description: "The SolKernal API exposes skill discovery, submission, execution, and staking state.",
    category: "API reference",
    updated: "July 2, 2026",
    related: ["skills-api", "execution-api", "staking-api"],
    sections: [
      {
        id: "base-url",
        title: "Base URL",
        blocks: [
          { type: "code", language: "text", code: "Local:      http://localhost:3000/api\nProduction: https://solkernal.xyz/api" },
        ],
      },
      {
        id: "endpoints",
        title: "Endpoints",
        blocks: [
          {
            type: "table",
            headers: ["Method", "Route", "Description"],
            rows: [
              ["GET", "/api/skills", "List skills with optional filtering and sorting."],
              ["POST", "/api/skills", "Submit a new skill."],
              ["GET", "/api/skills/[slug]", "Fetch skill detail and recent executions."],
              ["POST", "/api/execute", "Run a skill and create an execution receipt."],
              ["GET", "/api/staking", "Fetch global stats and optional wallet staking position."],
              ["POST", "/api/staking", "Stake, unstake, or claim rewards."],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "skills-api",
    title: "Skills API",
    description: "List, filter, inspect, and submit skills.",
    category: "API reference",
    updated: "July 2, 2026",
    related: ["skills", "publish-a-skill"],
    sections: [
      {
        id: "list-skills",
        title: "List skills",
        blocks: [
          { type: "code", language: "bash", code: "curl \"http://localhost:3000/api/skills?category=research&sort=runs\"" },
          { type: "table", headers: ["Query", "Description"], rows: [["category", "Filter by category."], ["provider", "Filter by provider."], ["search", "Search name, description, or tags."], ["sort", "Sort by newest, fee, or run count."]] },
        ],
      },
      {
        id: "create-skill",
        title: "Create skill",
        blocks: [
          { type: "code", language: "bash", code: "curl -X POST http://localhost:3000/api/skills \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"name\":\"Research Copilot\",\"description\":\"Summarizes market research\",\"category\":\"research\",\"fee\":0.5,\"builderWallet\":\"WALLET\",\"systemPrompt\":\"You are a concise research analyst.\"}'" },
        ],
      },
    ],
  },
  {
    slug: "execution-api",
    title: "Execution API",
    description: "Run skills programmatically and receive result metadata.",
    category: "API reference",
    updated: "July 2, 2026",
    related: ["execute-a-skill", "execution-receipts"],
    sections: [
      {
        id: "request",
        title: "Request",
        blocks: [
          { type: "code", language: "json", code: "{\n  \"slug\": \"market-research-agent\",\n  \"input\": \"Find three risks for a Solana AI marketplace.\",\n  \"walletAddress\": \"YOUR_PUBLIC_KEY\"\n}" },
        ],
      },
      {
        id: "response",
        title: "Response",
        blocks: [
          { type: "code", language: "json", code: "{\n  \"output\": \"...\",\n  \"receipt\": {\n    \"id\": \"...\",\n    \"feePaid\": 0.5,\n    \"outputHash\": \"...\",\n    \"provider\": \"cloudflare\"\n  }\n}" },
        ],
      },
    ],
  },
  {
    slug: "staking-api",
    title: "Staking API",
    description: "Fetch protocol stats and simulate stake, unstake, and claim flows in the current app.",
    category: "API reference",
    updated: "July 2, 2026",
    related: ["staking", "skrn-token"],
    sections: [
      {
        id: "get-staking",
        title: "Get staking state",
        blocks: [
          { type: "code", language: "bash", code: "curl \"http://localhost:3000/api/staking?wallet=YOUR_WALLET\"" },
        ],
      },
      {
        id: "post-staking",
        title: "Mutate staking state",
        blocks: [
          { type: "code", language: "json", code: "{\n  \"action\": \"stake\",\n  \"wallet\": \"YOUR_WALLET\",\n  \"amount\": 100000\n}" },
        ],
      },
    ],
  },
  {
    slug: "skrn-token",
    title: "$SKRN token",
    description: "$SKRN aligns builders, executors, and stakers around usage-backed protocol value.",
    category: "Token",
    updated: "July 2, 2026",
    related: ["supply-and-distribution", "staking", "governance"],
    sections: [
      {
        id: "utility",
        title: "Utility",
        blocks: [
          {
            type: "ul",
            items: [
              "Stake $SKRN to earn protocol execution fees.",
              "Qualify for premium skill access tiers.",
              "Participate in future governance over protocol parameters.",
              "Signal alignment as a builder or ecosystem partner.",
            ],
          },
        ],
      },
      {
        id: "tiers",
        title: "Access tiers",
        blocks: [
          { type: "table", headers: ["Tier", "Requirement", "Benefit"], rows: [["Premium", "10,000,000 $SKRN", "Premium access plus yield participation."], ["Priority", "100,000,000 $SKRN", "Priority access, support, and boosted reward weighting where enabled."]] },
        ],
      },
    ],
  },
  {
    slug: "supply-and-distribution",
    title: "Supply and distribution",
    description: "High-level token supply model for the planned $SKRN Token-2022 launch.",
    category: "Token",
    updated: "July 2, 2026",
    related: ["skrn-token", "treasury-and-revenue"],
    sections: [
      {
        id: "supply",
        title: "Supply",
        blocks: [
          { type: "p", text: "The planned $SKRN token uses a fixed 1,000,000,000 supply model. Production deployment details should be confirmed at mint launch and documented with the final mint address." },
          { type: "callout", title: "Mint not final", text: "Do not publish a mint address until the Token-2022 deployment is complete and verified.", tone: "warning" },
        ],
      },
    ],
  },
  {
    slug: "treasury-and-revenue",
    title: "Treasury and revenue",
    description: "How execution fees create builder income, staker yield, and protocol runway.",
    category: "Token",
    updated: "July 2, 2026",
    related: ["how-solkernal-works", "staking"],
    sections: [
      {
        id: "revenue-routing",
        title: "Revenue routing",
        blocks: [
          {
            type: "visual",
            variant: "fee-split",
          },
          { type: "table", headers: ["Stream", "Share", "Use"], rows: [["Builder", "30%", "Creator monetization."], ["Stakers", "50%", "Usage-backed $SKRN rewards."], ["Treasury", "20%", "Infrastructure, audits, moderation, grants, and operations."]] },
        ],
      },
    ],
  },
  {
    slug: "governance",
    title: "Governance",
    description: "Planned governance surface for protocol parameters and ecosystem development.",
    category: "Token",
    updated: "July 2, 2026",
    related: ["skrn-token", "security"],
    sections: [
      {
        id: "scope",
        title: "Governance scope",
        blocks: [
          { type: "ul", items: ["Fee split adjustments after public notice.", "Provider allowlists and model policy.", "Treasury grant programs.", "Protocol upgrade timing.", "Marketplace quality and safety rules."] },
        ],
      },
    ],
  },
  {
    slug: "security",
    title: "Security",
    description: "Practical security model for wallet actions, prompts, provider keys, receipts, and production operations.",
    category: "Platform",
    updated: "July 2, 2026",
    related: ["authentication", "production-checklist"],
    sections: [
      {
        id: "principles",
        title: "Principles",
        blocks: [
          {
            type: "ul",
            items: [
              "Keep secrets server-side.",
              "Verify wallet ownership for privileged flows.",
              "Treat prompt input as untrusted data.",
              "Rate limit expensive routes.",
              "Avoid storing sensitive user content in public receipts.",
              "Prefer explicit failure states over silent mock behavior in production.",
            ],
          },
        ],
      },
      {
        id: "prompt-security",
        title: "Prompt security",
        blocks: [
          { type: "p", text: "Skill prompts should define boundaries, reject requests to reveal system instructions, and avoid promising deterministic or regulated outcomes unless the builder controls the full evaluation pipeline." },
        ],
      },
    ],
  },
  {
    slug: "production-checklist",
    title: "Production checklist",
    description: "The launch checklist for moving SolKernal from local demo to public beta or mainnet.",
    category: "Platform",
    updated: "July 2, 2026",
    related: ["security", "architecture", "troubleshooting"],
    sections: [
      {
        id: "before-launch",
        title: "Before launch",
        blocks: [
          {
            type: "ul",
            items: [
              "Replace SQLite with a managed production database.",
              "Set all required environment variables in the deployment platform.",
              "Disable mock execution in production or label it clearly.",
              "Add signed wallet-message verification for submissions and staking-sensitive actions.",
              "Run Prisma migrations against production.",
              "Configure rate limits for /api/execute and /api/skills.",
              "Verify Solana RPC reliability and fallback providers.",
              "Publish final $SKRN mint address only after deployment verification.",
              "Add monitoring for LLM latency, error rate, token usage, and execution volume.",
              "Review terms, risk disclosures, and moderation policy for public skill submissions.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "roadmap",
    title: "Roadmap",
    description:
      "What is shipped on the web app today, what we are building next, and what stays later — sequenced by dependency, with no fake live claims.",
    category: "Platform",
    updated: "July 11, 2026",
    related: ["architecture", "production-checklist", "introduction"],
    sections: [
      {
        id: "principles",
        title: "Roadmap principles",
        blocks: [
          {
            type: "p",
            text: "This roadmap is sequenced by dependency, not marketing dates. We only move forward when the current layer is honest, usable, and measurable. Payments, staking yield, and on-chain programs are not claimed as live until they work in production.",
          },
          {
            type: "ul",
            items: [
              "Honesty first: no fake TVL, APY, or fee-payout claims.",
              "Wedge before platform: Solana live-data decision tools before a generic AI OS.",
              "Revenue before vaults: pay-per-run and builder payouts before staking UI.",
              "Trust before scale: receipts, mock labels, rate limits before aggressive growth.",
              "One public surface at a time: each ship should improve something a stranger can try in 30 seconds.",
            ],
          },
        ],
      },
      {
        id: "overview",
        title: "Phase overview",
        blocks: [
          {
            type: "visual",
            variant: "roadmap",
          },
          {
            type: "table",
            headers: ["Phase", "Intent", "Status language"],
            rows: [
              ["Shipped", "What production does today", "Live on the web app"],
              ["Building", "Near-term product depth and UX", "In progress / next deploys"],
              ["Next", "Revenue and distribution", "Planned — not live"],
              ["Later", "On-chain protocol and scale", "Only after usage + fee volume"],
            ],
          },
        ],
      },
      {
        id: "shipped",
        title: "Shipped (live on web)",
        blocks: [
          {
            type: "ul",
            items: [
              "Skill marketplace (off-chain registry) with search and filters.",
              "Guest free trial execute (rate-limited; wallet optional).",
              "Homepage mint scanner and rug / risk skill path.",
              "Multi-provider LLM routing with labeled mock fallback.",
              "Optional live tools (mint, wallet, market data).",
              "Public /r/[id] run receipts with share and OG images (app DB).",
              "Skill submission form; listed fees are display-only.",
              "Honest copy: payments and staking clearly not live.",
            ],
          },
        ],
      },
      {
        id: "building",
        title: "Building (near-term product)",
        blocks: [
          {
            type: "ul",
            items: [
              "Live-data marketplace focus (feature tool-using skills; bury pure chat wrappers).",
              "Structured result cards (risk score / verdict UI, not only raw markdown).",
              "Streaming execution output for faster-feeling scans.",
              "Docs for free trial, mock vs live, and Live data meaning.",
              "Skill quality bar (tool allowlists, stronger rug and wallet skills).",
              "Builder mini-dashboard (runs and recent executions before real revenue).",
            ],
          },
        ],
      },
      {
        id: "next-phase",
        title: "Next (revenue and distribution)",
        blocks: [
          {
            type: "ul",
            items: [
              "Pay-per-run in SOL/USDC after free quota (start with one flagship skill).",
              "Builder fee payouts once settlement exists (split design is planned, not live).",
              "Solana Blinks / Actions for top skills.",
              "Telegram /scan bot for degen distribution.",
              "API keys for bots and partners with rate limits.",
              "$SKRN soft utility (hold for free tier or discount) only when verifiable — no fake APY.",
            ],
          },
        ],
      },
      {
        id: "later-phase",
        title: "Later (protocol and scale)",
        blocks: [
          {
            type: "ul",
            items: [
              "On-chain execution receipt hashes / PDAs.",
              "On-chain skill registry (Anchor or equivalent).",
              "Staking vaults and fee share only after real paid volume.",
              "Skill versioning, fork, and remix.",
              "Builder reputation and ranking signals.",
              "Skill pipelines / composability.",
              "Governance and higher-SLA API tiers with enough usage data.",
            ],
          },
        ],
      },
      {
        id: "readiness",
        title: "Readiness gates",
        blocks: [
          {
            type: "table",
            headers: ["Gate", "What must be true before moving forward"],
            rows: [
              ["Product reliability", "Browse, execute, and receipts work consistently; mock vs live is always labeled."],
              ["Honest economics", "No payment or stake claims until transfer + vault programs actually run."],
              ["Security posture", "Rate limits, secret handling, and basic abuse controls in place."],
              ["Usage signal", "Weekly active runners and organic shares before heavy protocol complexity."],
              ["Protocol confidence", "Contracts reviewed/tested with upgrade and pause procedures before mainnet money paths."],
            ],
          },
        ],
      },
      {
        id: "not-on-roadmap",
        title: "Not on the roadmap",
        blocks: [
          {
            type: "callout",
            title: "Scope discipline",
            text: "Out of scope for the current wedge: training foundation models, custodial fund management beyond settlement, multi-chain expansion before Solana wins, DAO theater before usage, fake yield or inflated metrics, and private user-data storage on-chain.",
            tone: "warning",
          },
        ],
      },
    ],
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    description: "Common setup and runtime problems with practical fixes.",
    category: "Platform",
    updated: "July 2, 2026",
    related: ["quickstart", "production-checklist"],
    sections: [
      {
        id: "common-issues",
        title: "Common issues",
        blocks: [
          {
            type: "table",
            headers: ["Symptom", "Likely fix"],
            rows: [
              ["Marketplace is empty", "Run npm run db:seed after migrations."],
              ["Execution returns mock output", "Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID."],
              ["Prisma client errors", "Run npm install or npx prisma generate."],
              ["Wallet modal does not open", "Check browser wallet extension and SolanaProvider setup."],
              ["Build fails on env access", "Confirm server-only credentials are not referenced from client components."],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    description: "Short answers to common SolKernal product, token, and execution questions.",
    category: "Platform",
    updated: "July 2, 2026",
    related: ["introduction", "security"],
    sections: [
      {
        id: "questions",
        title: "Questions",
        blocks: [
          { type: "table", headers: ["Question", "Answer"], rows: [["Is SolKernal live on mainnet?", "The current app is a production-ready web foundation. Full Anchor programs and Token-2022 deployment are planned next."], ["Does SolKernal train models?", "No. It coordinates skill execution through configured LLM providers."], ["Can anyone submit a skill?", "Yes in the permissionless model, with production moderation and abuse controls recommended."], ["Where do rewards come from?", "Rewards come from execution fees paid by users, not token emissions."], ["Are outputs stored on-chain?", "No. Receipts should store hashes and metadata, not full private outputs."]] },
        ],
      },
    ],
  },
];

export const docsBySlug = new Map(docs.map((doc) => [doc.slug, doc]));
export const defaultDoc = docsBySlug.get("introduction")!;

export function docHref(slug: string) {
  return slug === "introduction" ? "/docs" : `/docs/${slug}`;
}

export function getDoc(slug?: string) {
  if (!slug || slug === "introduction") return defaultDoc;
  return docsBySlug.get(slug);
}

export function getNextDoc(slug: string) {
  const current = docs.findIndex((doc) => doc.slug === slug);
  if (current < 0) return undefined;
  return docs[current + 1];
}

export const docsSearchIndex = docs.map((doc) => ({
  slug: doc.slug,
  title: doc.title,
  description: doc.description,
  category: doc.category,
  href: docHref(doc.slug),
}));
