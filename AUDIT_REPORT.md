# SolKernal Production Readiness Audit

**Date:** 2026-07-09  
**Scope:** Full monorepo (`web/` Next.js app + root docs)  
**Method:** Code inspection, config review, typecheck, lint (no secret values printed)

---

## 1. Project summary

| Item | Detail |
|------|--------|
| **Product** | SolKernal — AI skill marketplace + execution layer oriented around Solana / $SKRN |
| **Type** | Combined: marketing site + skill marketplace app + docs + REST API |
| **Stack** | Next.js 14 (App Router), TypeScript, Tailwind, Prisma, Solana wallet-adapter, OpenAI SDK (multi-provider LLM) |
| **Deploy** | Vercel (`vercel.json`), optional Docker |
| **DB** | Prisma schema: **PostgreSQL**; local `.env` may use file SQLite (mismatch risk) |
| **Auth** | No traditional auth; wallet connect only (address string, **no signature verification**) |

### Public routes

| Route | Purpose |
|-------|---------|
| `/` | Landing |
| `/skills`, `/skills/[slug]` | Marketplace + execute UI |
| `/submit` | Publish skill form |
| `/run` | How-to guide |
| `/stake` | Staking **coming soon** placeholder |
| `/docs`, `/docs/[slug]` | In-app documentation |

### API routes

| Method | Path | Notes |
|--------|------|-------|
| GET/POST | `/api/skills` | List / create |
| GET | `/api/skills/[slug]` | Detail (+ recent executions) |
| POST | `/api/execute` | Run LLM, save receipt |
| GET/POST | `/api/staking` | Off-chain mock staking API (UI is disabled) |

---

## 2. Current status

**Honest status:** Production **web foundation** is live (marketplace, submit, LLM execution with mock fallback, docs). **Not** a full on-chain protocol yet.

| Capability | Status |
|------------|--------|
| Skill CRUD (DB) | Working (server-side DB) |
| LLM execution | Working when provider keys set; mock otherwise |
| Wallet connect | Working (Phantom) |
| On-chain payments | **Not implemented** |
| Blinks / Actions | **Not implemented** (URLs are placeholders) |
| Staking | **UI “coming soon”**; API is off-chain / forgeable |
| Anchor programs | **Not in repo** |
| Fee settlement | **Recorded in DB only**, not verified on-chain |

---

## 3. Critical broken issues

1. **Public APIs leak `systemPrompt`** — `GET /api/skills` and `GET /api/skills/[slug]` return full Prisma rows including proprietary prompts.
2. **No payment or wallet proof** — Execute/submit accept any `walletAddress` string; free unlimited LLM usage abuse risk.
3. **Schema vs local env mismatch** — `schema.prisma` = PostgreSQL; examples/local often `file:./dev.db`; migration SQL is SQLite-flavored while lock is `postgresql`.
4. **Hardcoded execution fee UI** — Skill detail shows `500 $SKRN` instead of `skill.fee`.
5. **Fake / missing Blinks** — `https://solkernal.xyz/blink/{slug}` has **no route**.
6. **Staking API unauthenticated** — Anyone can POST stake/unstake/claim and mutate stats without chain proof.
7. **Trust-breaking copy** — “Live on mainnet”, “on-chain registry/receipts”, “All systems operational”, fixed “24 skills live” ticker.

---

## 4. High-priority fixes

- Strip secrets from API responses (`systemPrompt`)
- Surface real `skill.fee`; show mock vs live execution
- Honest roadmap / landing / run / footer copy
- Replace Blink URL with shareable skill URL + “Blinks planned”
- Rate-limit + validate skill create; validate wallet format
- `/api/health` for deploy checks
- Align fee split messaging (30% builder / 50% stakers / 20% protocol)
- Fix token mint messaging (CA vs “TBD”)
- README accuracy + Current Status section
- API list search/error handling

---

## 5. Medium-priority improvements

- Disable or clearly gate staking POST when product is “coming soon”
- Indexes on `Execution.skillId`, `Execution.createdAt`
- Dockerfile: prisma generate + non-production-only install for build
- Open Graph image asset
- CSP / Permissions-Policy headers
- Skills fetch failure empty state
- Case-insensitive search on Postgres

---

## 6. Low-priority polish

- More wallets than Phantom
- Server-side skills page for SEO
- Output hashing in receipts
- Shared Redis rate limit for serverless
- Sitemap / robots.txt

---

## 7. Security risks

| Risk | Severity |
|------|----------|
| System prompts exposed publicly | **High** |
| Unauthenticated execute (LLM cost abuse) | **High** |
| Unauthenticated staking mutations | **High** |
| No signature verify on builder wallet | **High** |
| In-memory rate limit (serverless weak) | Medium |
| Dependency vulns (npm audit) | Medium |
| Secrets in chat/local env only if gitignored | OK if never committed |

---

## 8. Deployment risks

- Postgres required in production; wrong `DATABASE_URL` = blank/broken marketplace
- Docker image incomplete for Prisma standalone
- No health endpoint (fixed in remediation)
- Env: `DATABASE_URL`, LLM keys optional but mock without them

---

## 9. Missing / required environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | **Yes** | Postgres connection (prod) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical / metadata |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Optional | Wallet RPC |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Optional | Label |
| `NEXT_PUBLIC_SKRN_MINT_ADDRESS` | Optional | Token CA display |
| `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` | For CF skills | LLM |
| `GOOGLE_API_KEY` | For Gemini skills | LLM |
| `GROQ_API_KEY` | For Groq skills | LLM |
| `XAI_API_KEY` | For Grok skills | LLM |
| `TAVILY_API_KEY` | Optional | Web search tool |

---

## 10. Recommended fix order

1. Security (prompt leak, validation)  
2. Honest product status / copy  
3. Core UX bugs (fee, blink, mock badge)  
4. Health + API resilience  
5. Docs / README  
6. Verify build/lint  

---

*Remediation follows this report in the same change set.*
