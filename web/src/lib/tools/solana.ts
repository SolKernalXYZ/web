import { Connection, PublicKey } from "@solana/web3.js";
import type { ToolDefinition } from "./types";

const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.devnet.solana.com";

const JUPITER_PRICE_API = "https://api.jup.ag/price/v3";

function getConnection() {
  return new Connection(RPC_URL);
}

function isValidAddress(addr: string) {
  try {
    new PublicKey(addr);
    return true;
  } catch {
    return false;
  }
}

export const solanaTools: ToolDefinition[] = [
  {
    name: "get_wallet_sol_balance",
    description:
      "Get the SOL balance of any Solana wallet address. Returns balance in SOL.",
    parameters: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Solana wallet address (base58 encoded)",
        },
      },
      required: ["address"],
    },
    execute: async (args) => {
      const address = String(args.address || "");
      if (!isValidAddress(address)) {
        return { error: "Invalid Solana address format", address };
      }
      const conn = getConnection();
      const balanceLamports = await conn.getBalance(new PublicKey(address));
      return {
        address,
        balanceSOL: balanceLamports / 1e9,
        balanceLamports,
      };
    },
  },
  {
    name: "get_wallet_token_accounts",
    description:
      "Get all SPL token accounts (balances) for a Solana wallet. Returns token mints, amounts, and decimals.",
    parameters: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Solana wallet address (base58 encoded)",
        },
      },
      required: ["address"],
    },
    execute: async (args) => {
      const address = String(args.address || "");
      if (!isValidAddress(address)) {
        return { error: "Invalid Solana address format", address };
      }
      const conn = getConnection();
      const tokenAccounts =
        await conn.getParsedTokenAccountsByOwner(
          new PublicKey(address),
          { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") },
        );
      const tokens = tokenAccounts.value.map((ta) => ({
        mint: ta.account.data.parsed.info.mint,
        balance: ta.account.data.parsed.info.tokenAmount.uiAmount,
        decimals: ta.account.data.parsed.info.tokenAmount.decimals,
      }));
      return { address, tokens, total: tokens.length };
    },
  },
  {
    name: "get_token_mint_info",
    description:
      "Get metadata about an SPL token mint: supply, decimals, authority info.",
    parameters: {
      type: "object",
      properties: {
        mintAddress: {
          type: "string",
          description: "SPL token mint address (base58 encoded)",
        },
      },
      required: ["mintAddress"],
    },
    execute: async (args) => {
      const mintAddress = String(args.mintAddress || "");
      if (!isValidAddress(mintAddress)) {
        return { error: "Invalid mint address format", mintAddress };
      }
      const conn = getConnection();
      const mintInfo = await conn.getParsedAccountInfo(
        new PublicKey(mintAddress),
      );
      if (!mintInfo.value) {
        return { error: "Mint not found", mintAddress };
      }
      const data = mintInfo.value.data;
      if (data && typeof data === "object" && "parsed" in data) {
        const parsed = data.parsed;
        if (parsed.info) {
          return {
            mintAddress,
            supply: parsed.info.supply,
            decimals: parsed.info.decimals,
            mintAuthority: parsed.info.mintAuthority || null,
            freezeAuthority: parsed.info.freezeAuthority || null,
          };
        }
      }
      return { mintAddress, error: "Could not parse mint info" };
    },
  },
  {
    name: "get_token_price",
    description:
      "Get the current USD price of an SPL token from Jupiter price API. Provide a token mint address.",
    parameters: {
      type: "object",
      properties: {
        mintAddress: {
          type: "string",
          description: "SPL token mint address (base58 encoded)",
        },
      },
      required: ["mintAddress"],
    },
    execute: async (args) => {
      const mintAddress = String(args.mintAddress || "");
      if (!isValidAddress(mintAddress)) {
        return { error: "Invalid mint address format", mintAddress };
      }
      const url = `${JUPITER_PRICE_API}?ids=${mintAddress}`;
      const resp = await fetch(url);
      if (!resp.ok) {
        return { error: `Jupiter API error: ${resp.status}`, mintAddress };
      }
      const data = (await resp.json()) as Record<
        string,
        { usdPrice: number; blockId: number; decimals: number; priceChange24h: number } | undefined
      >;
      const priceData = data[mintAddress];
      if (!priceData) {
        return { mintAddress, price: null, error: "Token not found or price unreliable on Jupiter" };
      }
      return {
        mintAddress,
        priceUSD: priceData.usdPrice,
        decimals: priceData.decimals,
        priceChange24h: priceData.priceChange24h,
      };
    },
  },
  {
    name: "get_recent_transactions",
    description:
      "Get recent transaction signatures for a Solana wallet address. Returns signatures and slot info.",
    parameters: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Solana wallet address (base58 encoded)",
        },
        limit: {
          type: "number",
          description: "Number of transactions to fetch (max 10)",
          default: 5,
        },
      },
      required: ["address"],
    },
    execute: async (args) => {
      const address = String(args.address || "");
      if (!isValidAddress(address)) {
        return { error: "Invalid Solana address format", address };
      }
      const limit = Math.min(Math.max(1, Number(args.limit) || 5), 10);
      const conn = getConnection();
      const sigs = await conn.getSignaturesForAddress(
        new PublicKey(address),
        { limit },
      );
      return {
        address,
        transactions: sigs.map((s) => ({
          signature: s.signature,
          slot: s.slot,
          blockTime: s.blockTime
            ? new Date(s.blockTime * 1000).toISOString()
            : null,
          status: s.confirmationStatus || "unknown",
          err: s.err ? JSON.stringify(s.err) : null,
        })),
      };
    },
  },
  {
    name: "get_transaction_details",
    description:
      "Fetch a Solana transaction by signature: success/failure, fee, log messages, and error if any. Use for failed-tx debugging.",
    parameters: {
      type: "object",
      properties: {
        signature: {
          type: "string",
          description: "Transaction signature (base58)",
        },
      },
      required: ["signature"],
    },
    execute: async (args) => {
      const signature = String(args.signature || "").trim();
      if (!signature || signature.length < 64 || signature.length > 128) {
        return { error: "Invalid transaction signature", signature };
      }
      const conn = getConnection();
      const tx = await conn.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
        commitment: "confirmed",
      });
      if (!tx) {
        return {
          signature,
          error: "Transaction not found on this RPC cluster. Check network (mainnet vs devnet).",
        };
      }
      const meta = tx.meta;
      const logs = meta?.logMessages?.slice(0, 40) ?? [];
      return {
        signature,
        slot: tx.slot,
        blockTime: tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : null,
        err: meta?.err ? JSON.stringify(meta.err) : null,
        status: meta?.err ? "failed" : "success",
        feeLamports: meta?.fee ?? null,
        computeUnitsConsumed: meta?.computeUnitsConsumed ?? null,
        logMessages: logs,
        note: logs.length === 40 ? "Log messages truncated to first 40 lines." : undefined,
      };
    },
  },
];
