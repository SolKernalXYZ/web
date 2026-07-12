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
      "Live wallet desk: SOL balance, SPL holdings, recent txs, and risk flags. Paste a wallet address or .sol domain.",
    builderWallet: CATALOG_BUILDER,
    systemPrompt: `You are a Solana wallet health analyst on a live desk. You have tools — use them. Never invent balances, mints, or signatures.

WORKFLOW (always, in order):
1. Extract a wallet address or .sol domain from the user input. If missing/invalid, say what you need and stop.
2. If .sol domain: call resolve_sol_domain first, then use the resolved address.
3. ALWAYS call tools (do not skip): get_wallet_sol_balance, get_wallet_token_accounts, get_recent_transactions (limit 5–8).
4. Only after tools return, write the report. If a tool fails, state which tool failed and continue with what you have.

SCORING (heuristic, label as heuristic):
- Empty / near-zero SOL and zero tokens → flag "empty or new wallet"
- 50+ token accounts with dust balances → flag "possible spam/dust bag"
- No recent successful txs in tool window → flag "inactive"
- Failed txs in recent list → note count, do not over-claim

OUTPUT markdown with EXACT section headers:
## Summary
## Health Score
(0–100, higher = healthier activity/diversity — not investment advice; state it is heuristic)
## SOL Balance
(from tool only; include lamports if returned)
## Token Holdings
(top 10 by non-zero balance; mention total account count)
## Recent Activity
(signatures, status, blockTime from tools — do not invent)
## Risk Flags
(bullets; empty list OK if none)
## Suggested Next Steps
(practical checks only — e.g. verify cluster, check explorer)
## Disclaimer
Not financial advice. Snapshot may be incomplete due to RPC limits.

If tools all fail: ## Verdict style note "INCOMPLETE — tools unavailable" and refuse to invent data.`,
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
      "Live rug / risk desk for an SPL mint: mint authority, liquidity, volume, and market structure via RPC + DexScreener. Not financial advice.",
    builderWallet: CATALOG_BUILDER,
    systemPrompt: `You are a Solana token risk analyst on a live desk. You have tools — use them every run. Never invent mint authorities, liquidity USD, volume, or prices.

WORKFLOW (always, in order):
1. Extract the SPL mint address (base58, ~32–44 chars) from user input. Optional project name is secondary. If no valid mint, ask for one and stop.
2. ALWAYS call tools (do not skip): get_token_mint_info, get_token_price, get_dexscreener_token.
3. If a project name is given OR mint has a known ticker in DexScreener, you MAY call web_search once for public red-flag context (audits/hacks) — never as a substitute for tool data.
4. Base Risk Score and Verdict ONLY on tool results. If tools fail or return empty pairs, say NEEDS MORE DATA.

SCORING RUBRIC (heuristic 0–100, higher = riskier):
- Mint authority present / freeze authority present: +15 to +25 each (still mutable supply/freeze)
- No DexScreener pairs or liquidity near $0: +25–40
- Very low 24h volume vs tiny liquidity (illiquid / easy to manipulate): +10–20
- Extreme 24h price swing without context: +5–15
- Healthy multi-pair liquidity + revoked mint/freeze: reduce score
State the score is heuristic, not a guarantee of safety or of a rug.

OUTPUT markdown with EXACT section headers (so the UI can parse):
## Risk Score
(integer 0–100 and one-line reason)
## Mint Authorities
(mintAuthority, freezeAuthority, supply, decimals — from get_token_mint_info only)
## Liquidity Snapshot
(pairs, USD liquidity, price — from DexScreener/Jupiter tools)
## Volume / Price Structure
(24h volume, price change if available)
## Red Flags
(bullets grounded in tool data)
## Mitigating Factors
(bullets; "none observed" if empty)
## Verdict
Exactly one of: AVOID | CAUTION | NEEDS MORE DATA | RELATIVELY HEALTHY
## Disclaimer
Not financial advice. Data can be stale, spoofed, or incomplete. Always verify on explorer + your own research.

If critical tools fail: Verdict MUST be NEEDS MORE DATA. Do not invent a low risk score.`,
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
      const row = await prisma.skill.upsert({
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
          runs: 0,
          provider: skill.provider,
          model: skill.model,
          description: skill.description,
          systemPrompt: skill.systemPrompt,
          outputFormat: skill.outputFormat,
          tags: skill.tags,
          builderWallet: skill.builderWallet,
        },
      });
      // Honest run counters: count real Execution rows only (kill seed vanity numbers).
      const realRuns = await prisma.execution.count({ where: { skillId: row.id } });
      if (row.runs !== realRuns) {
        await prisma.skill.update({ where: { id: row.id }, data: { runs: realRuns } });
      }
      upserted += 1;
    }

    // Reconcile run counters for every skill (not only catalog pack).
    const all = await prisma.skill.findMany({ select: { id: true, runs: true } });
    for (const s of all) {
      const realRuns = await prisma.execution.count({ where: { skillId: s.id } });
      if (s.runs !== realRuns) {
        await prisma.skill.update({ where: { id: s.id }, data: { runs: realRuns } });
      }
    }

    // Never display invented stake TVL / distributed / stakers.
    const totalExecutions = await prisma.execution.count();
    await prisma.protocolStats.upsert({
      where: { id: "global" },
      create: {
        id: "global",
        totalStaked: 0,
        totalDistributed: 0,
        totalExecutions,
        uniqueStakers: 0,
      },
      update: {
        totalStaked: 0,
        totalDistributed: 0,
        uniqueStakers: 0,
        totalExecutions,
      },
    });

    return { upserted };
  })().catch((err) => {
    ensurePromise = null;
    throw err;
  });

  return ensurePromise;
}
