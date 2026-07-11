import type { ToolDefinition } from "./types";

const DEXSCREENER_TOKEN = "https://api.dexscreener.com/latest/dex/tokens";
const JUPITER_QUOTE = "https://quote-api.jup.ag/v6/quote";
const SNS_RESOLVE = "https://sns-sdk-proxy.bonfida.com/resolve";

function isLikelyBase58(addr: string) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
}

async function fetchJson(url: string, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const resp = await fetch(url, { ...init, signal: controller.signal });
    if (!resp.ok) {
      return { ok: false as const, status: resp.status, data: null };
    }
    const data = await resp.json();
    return { ok: true as const, status: resp.status, data };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Market / discovery tools — public HTTP APIs only (no private keys).
 */
export const marketTools: ToolDefinition[] = [
  {
    name: "get_dexscreener_token",
    description:
      "Get DexScreener market data for an SPL token mint: pairs, price USD, 24h volume, liquidity, price change. Use for rug/liquidity risk and token briefs.",
    parameters: {
      type: "object",
      properties: {
        mintAddress: {
          type: "string",
          description: "SPL token mint address (base58)",
        },
      },
      required: ["mintAddress"],
    },
    execute: async (args) => {
      const mintAddress = String(args.mintAddress || "").trim();
      if (!isLikelyBase58(mintAddress)) {
        return { error: "Invalid mint address format", mintAddress };
      }
      const res = await fetchJson(`${DEXSCREENER_TOKEN}/${mintAddress}`);
      if (!res.ok) {
        return { error: `DexScreener API error: ${res.status}`, mintAddress };
      }
      const pairs = (res.data as { pairs?: unknown[] } | null)?.pairs;
      if (!Array.isArray(pairs) || pairs.length === 0) {
        return { mintAddress, pairs: [], note: "No pairs found on DexScreener" };
      }
      // Return a compact summary of top pairs by liquidity
      const summarized = pairs
        .map((p) => {
          const pair = p as Record<string, unknown>;
          const liq = pair.liquidity as { usd?: number } | undefined;
          const vol = pair.volume as { h24?: number } | undefined;
          const ch = pair.priceChange as { h24?: number } | undefined;
          return {
            dexId: pair.dexId,
            pairAddress: pair.pairAddress,
            baseToken: (pair.baseToken as { symbol?: string; name?: string } | undefined)?.symbol,
            quoteToken: (pair.quoteToken as { symbol?: string } | undefined)?.symbol,
            priceUsd: pair.priceUsd,
            liquidityUsd: liq?.usd ?? null,
            volume24h: vol?.h24 ?? null,
            priceChange24h: ch?.h24 ?? null,
            url: pair.url,
          };
        })
        .sort((a, b) => (Number(b.liquidityUsd) || 0) - (Number(a.liquidityUsd) || 0))
        .slice(0, 5);

      return {
        mintAddress,
        pairCount: pairs.length,
        topPairs: summarized,
        disclaimer: "Market data from DexScreener; not financial advice.",
      };
    },
  },
  {
    name: "get_jupiter_swap_quote",
    description:
      "Get a Jupiter swap quote for amount of input mint to output mint. Returns expected out amount and price impact. Does NOT execute a swap.",
    parameters: {
      type: "object",
      properties: {
        inputMint: {
          type: "string",
          description: "Input token mint (base58). Use So11111111111111111111111111111111111111112 for SOL.",
        },
        outputMint: {
          type: "string",
          description: "Output token mint (base58)",
        },
        amount: {
          type: "string",
          description:
            "Raw amount in smallest units (lamports for SOL). Example: 1000000 = 0.001 SOL if 9 decimals.",
        },
        slippageBps: {
          type: "number",
          description: "Slippage in basis points (default 50 = 0.5%)",
        },
      },
      required: ["inputMint", "outputMint", "amount"],
    },
    execute: async (args) => {
      const inputMint = String(args.inputMint || "").trim();
      const outputMint = String(args.outputMint || "").trim();
      const amount = String(args.amount || "").trim();
      const slippageBps = Math.min(Math.max(Number(args.slippageBps) || 50, 1), 5000);

      if (!isLikelyBase58(inputMint) || !isLikelyBase58(outputMint)) {
        return { error: "Invalid mint address format" };
      }
      if (!/^\d+$/.test(amount)) {
        return { error: "amount must be an integer string in raw units" };
      }

      const url = new URL(JUPITER_QUOTE);
      url.searchParams.set("inputMint", inputMint);
      url.searchParams.set("outputMint", outputMint);
      url.searchParams.set("amount", amount);
      url.searchParams.set("slippageBps", String(slippageBps));

      const res = await fetchJson(url.toString());
      if (!res.ok) {
        return { error: `Jupiter quote API error: ${res.status}`, inputMint, outputMint };
      }
      const q = res.data as Record<string, unknown> | null;
      if (!q || q.error) {
        return { error: "No route found or quote failed", detail: q?.error ?? null };
      }
      return {
        inputMint,
        outputMint,
        inAmount: q.inAmount,
        outAmount: q.outAmount,
        otherAmountThreshold: q.otherAmountThreshold,
        priceImpactPct: q.priceImpactPct,
        routePlanLength: Array.isArray(q.routePlan) ? q.routePlan.length : null,
        slippageBps,
        disclaimer: "Quote only — no swap was executed.",
      };
    },
  },
  {
    name: "resolve_sol_domain",
    description:
      "Resolve a Solana Name Service (.sol) domain to a wallet address. Pass domain with or without .sol suffix.",
    parameters: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          description: "SNS domain e.g. bonfida or bonfida.sol",
        },
      },
      required: ["domain"],
    },
    execute: async (args) => {
      const domain = String(args.domain || "")
        .trim()
        .toLowerCase()
        .replace(/\.sol$/i, "");
      if (!domain || !/^[a-z0-9-]+$/i.test(domain)) {
        return { error: "Invalid domain", domain: args.domain };
      }
      const res = await fetchJson(`${SNS_RESOLVE}/${encodeURIComponent(domain)}`);
      if (!res.ok) {
        return { error: `SNS resolve failed: ${res.status}`, domain: `${domain}.sol` };
      }
      const data = res.data as { result?: string; s?: string } | string | null;
      const address =
        typeof data === "string"
          ? data
          : data && typeof data === "object"
            ? data.result || data.s || null
            : null;
      if (!address || address === "Domain not found") {
        return { domain: `${domain}.sol`, address: null, error: "Domain not found" };
      }
      return { domain: `${domain}.sol`, address };
    },
  },
];
