/**
 * Public skill projection — never expose systemPrompt or other secret fields.
 */

const PUBLIC_SKILL_SELECT = {
  id: true,
  slug: true,
  name: true,
  category: true,
  description: true,
  tags: true,
  provider: true,
  model: true,
  outputFormat: true,
  fee: true,
  paymentToken: true,
  builderWallet: true,
  version: true,
  runs: true,
  active: true,
  createdAt: true,
  updatedAt: true,
} as const;

export { PUBLIC_SKILL_SELECT };

/** Solana base58 address: 32–44 chars, no 0/O/I/l. */
export function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export function slugifySkillName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export const ALLOWED_PROVIDERS = ["Cloudflare", "Google", "Grok", "Groq"] as const;
export const ALLOWED_CATEGORIES = [
  "DeFi",
  "Trading",
  "Writing",
  "Code",
  "Research",
  "Utility",
] as const;

export const MIN_FEE = 0.01;
export const MAX_FEE = 1_000_000;
export const MAX_PROMPT_LENGTH = 20_000;
export const MAX_NAME_LENGTH = 80;
export const MAX_DESCRIPTION_LENGTH = 2_000;
