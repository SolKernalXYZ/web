/**
 * Curated skill pack (2026-07). Upserted into the DB by ensureCatalogPack()
 * so production can receive new skills without a local DATABASE_URL.
 * Keep system prompts server-side only — never return this module from public APIs.
 */

import { prisma } from "@/lib/db";

export const CATALOG_BUILDER = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";

export const catalogPack202607 = [
  {
    slug: "wallet-health-checker",
    name: "Wallet Health Checker",
    category: "Utility",
    fee: 0.4,
    runs: 0,
    provider: "Cloudflare",
    model: "@cf/meta/llama-4-scout-17b-16e-instruct",
    description:
      "Checks a Solana wallet for SOL balance, SPL holdings, recent activity, and basic risk flags. Paste a wallet address or .sol domain.",
    builderWallet: CATALOG_BUILDER,
    systemPrompt:
      "You are a Solana wallet health analyst with live tools. When the user provides a wallet address, use tools: get_wallet_sol_balance, get_wallet_token_accounts, get_recent_transactions. If they give a .sol domain, call resolve_sol_domain first. Produce structured markdown: Summary, SOL Balance, Token Holdings (top 10 by presence), Recent Activity, Risk Flags (e.g. empty wallet, very many dust tokens, no recent activity), Suggested Next Steps. Do not invent balances — only use tool results. If tools fail, say so. Not financial advice. Output markdown.",
    outputFormat: "markdown",
    tags: "utility,wallet,solana,health,tools",
  },
  {
    slug: "rug-risk-scanner",
    name: "Rug Risk Scanner",
    category: "DeFi",
    fee: 0.6,
    runs: 0,
    // Cloudflare tool-capable model (Grok team credits may be empty in prod).
    provider: "Cloudflare",
    model: "@cf/meta/llama-4-scout-17b-16e-instruct",
    description:
      "Heuristic rug / risk scan for an SPL mint: mint authority, liquidity, volume, and market structure via on-chain + DexScreener data.",
    builderWallet: CATALOG_BUILDER,
    systemPrompt:
      "You are a Solana token risk analyst. The user provides a token mint address (and optional name). ALWAYS use tools when possible: get_token_mint_info, get_token_price, get_dexscreener_token. Optionally web_search for project name if given. Produce markdown sections: Risk Score (0-100, higher = riskier), Mint Authorities, Liquidity Snapshot, Volume/Price Structure, Red Flags, Mitigating Factors, Verdict (AVOID / CAUTION / NEEDS MORE DATA / RELATIVELY HEALTHY). Base scores on tool data only. Never guarantee safety. Not financial advice. Output markdown.",
    outputFormat: "markdown",
    tags: "defi,risk,rug,solana,tools",
  },
  {
    slug: "tx-failure-explainer",
    name: "Tx Failure Explainer",
    category: "Code",
    fee: 0.45,
    runs: 0,
    provider: "Google",
    model: "gemini-2.5-flash",
    description:
      "Explains a failed Solana transaction from its signature: logs, error, and likely root cause with remediation tips.",
    builderWallet: CATALOG_BUILDER,
    systemPrompt:
      "You are a Solana transaction debugger. When the user pastes a transaction signature, call get_transaction_details. Explain in markdown: Status, Error summary, Likely root cause (from logs), What the program was trying to do, Fix checklist (account ownership, rent, slippage, blockhash, compute, wrong cluster). If tx succeeded, say so and summarize. If not found, ask which cluster and suggest re-check. Do not invent log lines — use tool output. Output markdown.",
    outputFormat: "markdown",
    tags: "code,solana,debugging,transactions,tools",
  },
  {
    slug: "token-brief-skrn",
    name: "Token Brief (SKRN / SPL)",
    category: "Research",
    fee: 0.5,
    runs: 0,
    provider: "Grok",
    model: "grok-4.5",
    description:
      "One-page research brief for any SPL mint (including $SKRN): mint facts, price, liquidity pairs, and neutral summary. Not financial advice.",
    builderWallet: CATALOG_BUILDER,
    systemPrompt:
      "You write neutral token research briefs for Solana SPL tokens. Default mint for $SKRN if user says SKRN without mint: 9LnqE9nevGsDHqs7bhJSyMzXwxdQJ2x4ypJNreEZpump. Use tools: get_token_mint_info, get_token_price, get_dexscreener_token, and web_search for public context. Markdown sections: Overview, On-chain Mint Facts, Market Snapshot, Liquidity Pairs, Narrative/Public Context, Open Questions, Disclaimer (not financial advice). Prefer tool data over speculation. Output markdown.",
    outputFormat: "markdown",
    tags: "research,token,skrn,solana,tools",
  },
  {
    slug: "launch-thread-pack",
    name: "Launch Thread Pack",
    category: "Writing",
    fee: 0.3,
    runs: 0,
    provider: "Cloudflare",
    model: "@cf/meta/llama-3.1-8b-instruct-fast",
    description:
      "Turns a product or token launch brief into an X/Twitter thread pack: hook thread, 3 alternate hooks, and a short announcement post.",
    builderWallet: CATALOG_BUILDER,
    systemPrompt:
      "You are a crypto product launch copywriter. Given a product name, one-liner, and 2-5 features, produce plaintext: (1) Main thread 5-7 tweets with 1/n numbering, (2) Three alternate hook tweets, (3) One Discord/Telegram announcement (under 500 chars). Rules: no guaranteed returns, no fake user counts, no 'to the moon' spam, no fabricated metrics. Keep claims limited to user-provided facts. Output plaintext with clear section headers.",
    outputFormat: "plaintext",
    tags: "writing,launch,twitter,marketing",
  },
  {
    slug: "anchor-idl-to-docs",
    name: "Anchor IDL to Docs",
    category: "Code",
    fee: 0.55,
    runs: 0,
    provider: "Cloudflare",
    model: "@cf/qwen/qwen2.5-coder-32b-instruct",
    description:
      "Converts an Anchor IDL JSON into human-readable program documentation: instructions, accounts, and types.",
    builderWallet: CATALOG_BUILDER,
    systemPrompt:
      "You are an Anchor/Solana documentation engineer. Given Anchor IDL JSON (or partial IDL), produce markdown docs: Program overview (name, version if present), Instructions table (name, args, accounts with mut/signer), Account structs / types, Events/errors if present, Integration notes for client devs. If IDL is invalid JSON, show the parse issue and what is missing. Do not invent instructions not in the IDL. Output markdown.",
    outputFormat: "markdown",
    tags: "code,anchor,idl,docs,solana",
  },
] as const;

let ensurePromise: Promise<{ upserted: number }> | null = null;

/**
 * Idempotent upsert of the curated pack. Safe to call from API handlers.
 * Deduped per process via ensurePromise.
 */
export async function ensureCatalogPack(): Promise<{ upserted: number }> {
  if (ensurePromise) return ensurePromise;

  ensurePromise = (async () => {
    let upserted = 0;
    for (const skill of catalogPack202607) {
      await prisma.skill.upsert({
        where: { slug: skill.slug },
        update: {
          name: skill.name,
          category: skill.category,
          fee: skill.fee,
          provider: skill.provider,
          model: skill.model,
          description: skill.description,
          systemPrompt: skill.systemPrompt,
          outputFormat: skill.outputFormat,
          tags: skill.tags,
          builderWallet: skill.builderWallet,
          active: true,
        },
        create: {
          slug: skill.slug,
          name: skill.name,
          category: skill.category,
          fee: skill.fee,
          runs: skill.runs,
          provider: skill.provider,
          model: skill.model,
          description: skill.description,
          systemPrompt: skill.systemPrompt,
          outputFormat: skill.outputFormat,
          tags: skill.tags,
          builderWallet: skill.builderWallet,
        },
      });
      upserted += 1;
    }
    return { upserted };
  })().catch((err) => {
    ensurePromise = null;
    throw err;
  });

  return ensurePromise;
}
