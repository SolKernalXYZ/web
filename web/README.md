# SolKernal — AI Skill OS for Solana

Deploy, execute, and compose autonomous AI skills on-chain. A permissionless marketplace where developers publish prompt bundles, users pay per execution, and stakers earn real yield.

## Quick Start

```bash
cd web
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── skills/         GET (list/filter) + POST (submit)
│   │   │   │   └── [slug]/     GET (detail + executions)
│   │   │   ├── execute/        POST (run skill via LLM)
│   │   │   └── staking/        GET (stats) + POST (stake/unstake/claim)
│   │   ├── skills/             Marketplace (browse, filter, detail, execute)
│   │   ├── run/                Execution guide
│   │   ├── stake/              $SKRN staking dashboard
│   │   └── submit/             Publish new skills
│   ├── components/             Nav, Button, Card, Input, WalletButton, SolanaProvider
│   └── lib/
│       ├── db.ts               Prisma client singleton
│       └── llm.ts              LLM execution engine (Cloudflare Workers AI)
├── prisma/
│   ├── schema.prisma           Data models
│   ├── migrations/             SQLite migrations
│   └── seed.ts                 Seed data (6 skills + protocol stats)
├── Dockerfile                  Multi-stage production build
└── docker-compose.yml          Container orchestration
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Database | SQLite + Prisma 5 |
| Styling | Tailwind CSS 3.4 |
| Wallet | @solana/wallet-adapter (Phantom) |
| LLM | Cloudflare Workers AI (OpenAI-compatible API; mock fallback) |
| Deployment | Docker / Vercel |

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/skills` | List skills (filter: category, provider, search, sort) |
| POST | `/api/skills` | Submit new skill |
| GET | `/api/skills/[slug]` | Get skill detail + recent executions |
| POST | `/api/execute` | Execute a skill (calls LLM, saves receipt) |
| GET | `/api/staking` | Get protocol stats + wallet position |
| POST | `/api/staking` | Stake, unstake, or claim rewards |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | SQLite connection (`file:./dev.db`) |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL for metadata (defaults to `https://solkernal.xyz`) |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | No | Solana RPC endpoint (defaults to devnet) |
| `NEXT_PUBLIC_SOLANA_NETWORK` | No | Solana cluster label (e.g. `devnet`, `mainnet-beta`) |
| `NEXT_PUBLIC_SKRN_MINT_ADDRESS` | No | $SKRN token mint address (set when deployed) |
| `CLOUDFLARE_API_TOKEN` | No | Cloudflare Workers AI API token for real skill execution |
| `CLOUDFLARE_ACCOUNT_ID` | No | Cloudflare account ID for the Workers AI endpoint |

Without `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, skill execution
returns a clearly-labeled mock response (the engine also falls back to the mock
if the upstream LLM call fails), so the app remains fully runnable locally.

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:reset     # Reset & re-seed
npm run lint         # ESLint
```

## Deployment

### Docker

```bash
docker compose up --build
```

### Vercel

Connect repo → set env vars → deploy. Prisma requires a persistent database (use Turso, PlanetScale, or Neon for production).

## What's Live

- ✅ Skill marketplace with search, filter, sort
- ✅ Skill detail page with real execution
- ✅ LLM engine (Cloudflare Workers AI + mock fallback)
- ✅ Staking dashboard with stake/unstake/claim
- ✅ Skill submission form
- ✅ Phantom wallet integration
- ✅ On-chain execution receipts (DB)
- ✅ Protocol stats tracking
- ✅ Responsive design + accessibility
- ✅ SEO + Open Graph metadata

## What's Next (v2)

- Solana smart contracts (Anchor programs for on-chain registry)
- $SKRN Token-2022 deployment
- Real USDC payment via Solana transactions
- Solana Blinks/Actions integration
- Skill chaining (compose multiple skills)
- Builder analytics dashboard
