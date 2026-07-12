# SolKernal — 7-Day Revive Sprint
**Cadence:** every day = **Build → Push → Deploy → Tweet**  
**North star:** weekly active runners (non-mock executions)  
**Wedge:** “Don’t ape blind. Run the desk.” — Solana live-data decision tools  

---

## Daily ritual (non-negotiable)

```
Morning   → open this file, pick today's ship box only
Daytime   → build ONE public-facing thing (scope-cut ruthlessly)
Evening   → git push → Vercel deploy green → tweet with proof link
Night     → log what shipped + metric note below
```

**Tweet rule:** always attach a **live URL** (skill, receipt, or homepage scanner). No vapor screenshots of Figma.

**Do not** start Day N+1 features before Day N is deployed + tweeted.

---

## Day 1 — Trust + wedge (TODAY)

**Theme:** Stop looking like a dead token site. Make first value free and obvious.

### Build
- [x] This notepad (`REVIVE.md`)
- [x] Homepage hero → **mint scanner** (free, no wallet)
- [x] Guest execute API (5 runs/hour/IP, wallet optional)
- [x] Shareable receipts `/r/[id]`
- [x] Live-data badge + marketplace prioritization
- [x] Honest seed (zero fake runs / fake TVL; archive commodity skills)
- [x] Skill detail: **Run free trial** without wallet + receipt share

### Push / Deploy
- [x] `git add` → commit Day 1+2 → push `main` (`935362d`)
- [x] Confirm Vercel production green (`vercel --prod` → solkernal.xyz)
- [ ] Smoke: home scanner → result → open `/r/...` receipt
- [x] `npm run build` green locally

### Tweet (copy)
```
Day 1 of rebuilding SolKernal in public.

Don't ape blind — paste any SPL mint, get a risk brief in seconds.
No wallet required for free trial.

→ https://solkernal.xyz
$SKRN
```

### Done when
Stranger lands on home, pastes a mint, gets output + shareable receipt URL.

---

## Day 2 — Proof + polish (share loop)

**Theme:** Every run is content. Make receipts look tweetable.

### Build
- [x] Receipt page polish: risk score callout if parseable, clearer OG title/description
- [x] Dynamic OG image for `/r/[id]` (`opengraph-image.tsx`)
- [x] “Copy for X” + Post on X + copy link (`ReceiptShareBar`, mint scanner, skill detail)
- [x] Homepage features/steps rewrite to mint-first + free trial positioning
- [x] Day 1 QA: steps no longer force “connect wallet first”

### Push / Deploy
- [x] Ship (same commit as Day 1 — `935362d` on `main`)
- [x] Vercel prod deploy live
- [ ] Smoke: share receipt on mobile preview / X card
- [x] `npm run build` green locally

### Tweet
```
Day 2: every SolKernal run now has a public receipt you can share.

Scan → result → link.

Example: https://solkernal.xyz/r/<id>
Free trial still open → https://solkernal.xyz
```

### Done when
You post one real receipt URL from a trending mint.

---

## Day 3 — Skill quality bar (live data only)

**Theme:** Marketplace feels like a desk, not ChatGPT wrappers.

### Build
- [x] Featured row on `/skills`: only tool-using skills
- [x] Skill cards: “Live data” filter toggle
- [x] Improve rug-risk-scanner + wallet-health-checker prompts/tools if weak
- [x] Ensure mock vs live is unmistakable in UI
- [x] Docs page: “How free trial works” + “What Live data means”

### Push / Deploy
- [ ] Deploy
- [ ] Smoke all featured skills with real mints/wallets
- [x] `npm run build` green locally

### Tweet
```
Day 3: SolKernal marketplace now prioritizes Live data skills
(chain + market tools — not generic chat wrappers).

Start with Rug Risk Scanner → https://solkernal.xyz/skills/rug-risk-scanner
```

### Done when
Top of marketplace is 100% Solana decision tools.

---

## Day 4 — First real money path (even tiny)

**Theme:** Product becomes a business, not a demo.

### Build
- [ ] Optional SOL tip / paywall prototype on **one** skill (rug-risk-scanner)
- [ ] Or: “Support run” SOL transfer before unlimited runs after free quota
- [ ] Clear UI: free remaining vs paid path
- [ ] Server: verify signature / transfer before extra executes (minimal viable)

### Push / Deploy
- [ ] Deploy carefully; keep free trial intact

### Tweet
```
Day 4: free trial stays. After quota, pay-per-run path is live on the rug scanner.

Still early — but the loop is real: run → value → pay.

https://solkernal.xyz/skills/rug-risk-scanner
```

### Done when
You complete one paid (or tip) flow yourself on mainnet/devnet as documented.

---

## Day 5 — Distribution surface (Blinks or bot)

**Theme:** Meet degens where they are.

### Build (pick ONE — don’t both half-finish)
- [ ] **Option A:** Solana Action/Blink for rug scan  
- [ ] **Option B:** Telegram bot `/scan <mint>` hitting execute API  

### Push / Deploy
- [ ] Public endpoint live + documented in `/docs`

### Tweet
```
Day 5: [Blink / Telegram] scan is live.

Reply with a mint (or click the Blink) — get the desk brief without hunting the site.

https://solkernal.xyz
```

### Done when
Someone who isn’t you can run a scan from X or TG without reading docs.

---

## Day 6 — Builder loop

**Theme:** Supply side for the wedge only.

### Build
- [ ] Submit form: require `tools` tag or tool allowlist note for “Live data”
- [ ] Builder stats page (even simple): your skills, runs count, last 5 execs
- [ ] Publish bounty thread draft in repo (`BOUNTY.md`): best live-data skill

### Push / Deploy
- [ ] Deploy builder page

### Tweet
```
Day 6: builders — ship a Live data skill (must call chain/market tools).

Submit → https://solkernal.xyz/submit
Bounty details in next post / BOUNTY.md

We're rebuilding the desk in public.
```

### Done when
External builder can submit without DM’ing you.

---

## Day 7 — Week ship + narrative lock

**Theme:** Close the week with clarity and a public scoreboard.

### Build
- [ ] Changelog page `/changelog` or docs “Week 1”
- [ ] Homepage: “Shipped this week” strip (3 bullets, honest)
- [ ] Metric snapshot in this file (runs, unique guests, top skill)
- [ ] Soft $SKRN utility note: hold for free tier (even manual allowlist OK)

### Push / Deploy
- [ ] Final deploy of the week
- [ ] Tag release `revive-week-1` if you want

### Tweet (thread)
```
1/ Week 1 of rebuilding SolKernal in public — done.

What shipped:
• Free mint scanner (no wallet)
• Public run receipts
• Live-data marketplace focus
• [pay path / blink / bot — whatever landed]
• Honest metrics (no fake TVL)

2/ Try it: https://solkernal.xyz

3/ Week 2 focus: [paid volume / distribution / builders]

Building in public. Feedback welcome.
$SKRN
```

### Done when
Thread is up + this file’s Week 1 metrics filled.

---

## Week 1 metrics (fill Day 7)

| Metric | Value |
|--------|-------|
| Total executions (real DB) | |
| Non-mock executions | |
| Unique guest IPs / wallets (approx) | |
| Receipts opened / shared | |
| Top skill by runs | |
| Followers delta | |
| One user quote | |

---

## Backlog after Day 7 (do NOT pull forward early)

| Priority | Item |
|----------|------|
| P1 | Full USDC pay-per-run + fee split accounting |
| P1 | Streaming LLM tokens |
| P1 | Structured risk cards (parsed JSON UI) |
| P2 | On-chain receipt hash |
| P2 | $SKRN discount / free tier on-chain check |
| P2 | Staking vaults (only after fee revenue) |
| P2 | Anchor skill registry |
| Dist | Daily CT scan posts (ops, not just eng) |
| Dist | 10 KOL free credits |
| Dist | API keys for bots |

### Explicitly banned this week
- Fancy staking APY UI  
- 20 new generic writing skills  
- Multi-chain  
- DAO / governance  
- Perfect rewrite of entire design system  

---

## Sprint log

### 2026-07-10 — Day 1 code
- Wrote 7-day plan
- Guest execute, receipts, mint scanner, badges, seed honesty, free trial UI
- **Next human step:** push → deploy → tweet Day 1 copy above

### 2026-07-11 — Day 2 code
- Receipt highlights parse (score / verdict / summary)
- Dynamic OG image + richer metadata on `/r/[id]`
- Share bar: Post on X, Copy for X, Copy link
- Mint scanner + skill detail share hooks
- Homepage how-it-works / features aligned to free trial
- **Next:** push Day 1+2 → deploy → tweet with a real `/r/` URL

### 2026-07-12 — Day 3 code
- Featured desk row on `/skills` (tools-tagged skills only)
- Live data only filter (header chip + sidebar) + docs link
- Stronger rug-risk-scanner + wallet-health-checker system prompts (workflow, rubric, parseable headers)
- Mock vs Live LLM banners on skill detail, mint scanner, receipts (warning border for mock)
- Docs: `/docs/free-trial-and-live-data` (trial limits, Live data meaning, mock vs live)
- **Next:** push → deploy → smoke featured skills → tweet Day 3 copy

---

## Quick links

| What | URL |
|------|-----|
| Home scanner | https://solkernal.xyz |
| Rug scanner | https://solkernal.xyz/skills/rug-risk-scanner |
| Marketplace | https://solkernal.xyz/skills |
| Receipts | https://solkernal.xyz/r/[id] |
| CA | `9LnqE9nevGsDHqs7bhJSyMzXwxdQJ2x4ypJNreEZpump` |

---

## How we work tomorrow with the agent

Say: **“Day 2 start”** (or Day N) → we only touch that day’s checklist → then you push/deploy/tweet.

If you want full autonomy on a day: **“Day 2 — ship it end to end”**.
