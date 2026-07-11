# SolKernal Product Roadmap

**Updated:** 2026-07-11  
**Source of truth (code):** `src/lib/roadmap.ts`  
**Public pages:** homepage `#roadmap` · [docs/roadmap](https://solkernal.xyz/docs/roadmap) · nav Roadmap menu  

> Sequenced by dependency, not hype. **Shipped** means live on the web app. Everything else is planned until it ships. We do not claim payments, staking yield, or on-chain programs as live.

---

## Principles

1. **Honesty first** — no fake TVL, APY, or fee-payout claims.
2. **Wedge before platform** — Solana live-data decision tools beat a generic AI marketplace.
3. **Revenue before vaults** — real pay-per-run before staking UI.
4. **Trust before scale** — receipts, mock labels, rate limits before aggressive growth.
5. **One public surface at a time** — each ship must help a stranger in ~30 seconds.

---

## Phase overview

| Phase | Intent | Status language |
|-------|--------|-----------------|
| **Shipped** | What production does today | Live on the web app |
| **Building** | Near-term product depth | In progress / next deploys |
| **Next** | Revenue and distribution | Planned — not live |
| **Later** | On-chain protocol and scale | Only after usage + fee volume |

---

## 1. Shipped (live on web)

| Item | Detail |
|------|--------|
| Skill marketplace | Browse, search, filter; **off-chain** registry |
| Guest free trial | Rate-limited execute; wallet optional |
| Homepage mint scanner | Paste SPL mint → risk desk path |
| Multi-provider LLM | Cloudflare / Gemini / Grok / Groq; labeled mock fallback |
| Live-data tools | Mint, wallet, market tools when configured |
| Public run receipts | `/r/[id]` + share + OG (app DB, not chain) |
| Skill publish form | Listed fees **display-only** — not paid out |
| Honest product claims | No fake stake TVL / yield; payments & stake clearly off |

---

## 2. Building (near-term product)

| Item | Detail |
|------|--------|
| Live-data marketplace focus | Feature tool-using skills; de-emphasize chat wrappers |
| Structured result cards | Risk score / verdict UI on runs and receipts |
| Streaming execution | Token stream for long scans |
| Docs: trial + Live data | Free trial limits, mock vs live, tool meaning |
| Skill quality bar | Tool allowlists; stronger rug / wallet skills |
| Builder mini-dashboard | Runs + recent executions (pre-revenue) |

---

## 3. Next (revenue & distribution)

| Item | Detail |
|------|--------|
| Pay-per-run (SOL/USDC) | Enforce transfer after free quota; start with one skill |
| Builder fee payouts | Attribute paid runs once settlement exists |
| Solana Blinks / Actions | Top skills runnable from X / Action surfaces |
| Telegram `/scan` bot | Mint scan without the full site |
| API keys for bots | Authenticated execute + rate limits |
| $SKRN soft utility | Hold for free tier / discount **only if verifiable** — no fake APY |

---

## 4. Later (protocol & scale)

| Item | Detail |
|------|--------|
| On-chain execution receipts | Hash / PDA after app receipts are trusted |
| On-chain skill registry | Anchor (or equivalent) accounts |
| Staking vaults | Fee share **only after real paid volume** |
| Skill versioning & remix | Fork / version with attribution |
| Builder reputation | Quality signals for ranking |
| Composability / pipelines | Multi-skill workflows |
| Governance & SLA tiers | After enough real usage data |

---

## Readiness gates

| Gate | Required before advancing |
|------|---------------------------|
| Product reliability | Browse / execute / receipts stable; mock vs live always labeled |
| Honest economics | No payment/stake claims until real programs enforce them |
| Security posture | Rate limits, secrets, basic abuse controls |
| Usage signal | Weekly active runners + organic shares |
| Protocol confidence | Reviewed contracts, tests, upgrade/pause path |

---

## Explicitly out of scope

- Training foundation models  
- Custodial fund management beyond settlement  
- Multi-chain before Solana wedge wins  
- DAO / governance theater before usage  
- Fake yield, fake TVL, inflated run counts  
- Private user data on-chain  

---

## Operating cadence (internal)

See also `REVIVE.md` (7-day revive sprint). Default rhythm:

**Build → Push → Deploy → Tweet** with a live URL — never vapor claims.

---

## How to update this roadmap

1. Edit **`src/lib/roadmap.ts`** (canonical).  
2. Homepage + nav read from that file automatically.  
3. Keep **`ROADMAP.md`** and **docs `/docs/roadmap`** in sync when phases change.  
4. Bump `ROADMAP_UPDATED` date.  
5. Never mark an item **Shipped** until it is true in production.
