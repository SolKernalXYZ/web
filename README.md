<div align="center">

# 🌐 SolKernal

### AI Skill Operating System on Solana

[![Website](https://img.shields.io/badge/🌐_solkernal.xyz-7C3AED?style=for-the-badge)](https://solkernal.xyz)
[![Twitter](https://img.shields.io/badge/@SolKernal__-Follow-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/SolKernal_)
[![License](https://img.shields.io/badge/License-MIT-A78BFA?style=for-the-badge)](LICENSE)

> **Publish and execute AI skills on Solana-oriented infrastructure.**  
> Web marketplace and multi-provider LLM routing are live. On-chain settlement, Blinks, and staking vaults are next.

**`$SKRN`**: `9LnqE9nevGsDHqs7bhJSyMzXwxdQJ2x4ypJNreEZpump`

[**Try Demo →**](https://solkernal.xyz/skills) • [**Read Docs →**](https://solkernal.xyz/docs) • [**Submit Skill →**](https://solkernal.xyz/submit)

</div>

---

## Current status

| Area | Status |
|------|--------|
| Web marketplace (list / detail / submit) | **Live** |
| Multi-provider LLM execution | **Live** (Cloudflare, Gemini, Grok, Groq; mock if keys missing) |
| Wallet connect (Phantom) | **Live** (identity only) |
| On-chain fee payment on execute | **Not live** |
| Solana Blinks / Actions | **Not live** |
| Staking vault + rewards | **Not live** (page shows coming soon) |
| Anchor programs / on-chain registry | **Not in this repo yet** |

See [`AUDIT_REPORT.md`](./AUDIT_REPORT.md) for the full production-readiness audit.

---

## 🎯 What is SolKernal?

SolKernal is building a **decentralized AI skill marketplace** on Solana:

- **Permissionless publishing** — Anyone can submit a skill to the registry (web app today)
- **Multi-provider execution** — Skills route to configured LLM providers
- **Fee design** — Target split: 30% builder / 50% stakers / 20% protocol (enforced when settlement ships)
- **Solana-native direction** — Wallet identity now; Blinks, receipts, and vaults next

### Why Solana?

| Dimension | Ethereum/Base | **Solana (SolKernal)** |
|-----------|---------------|------------------------|
| Transaction Finality | ~2-12 seconds | **~400ms** |
| Transaction Cost | $0.001 - $0.50 | **~$0.00025** |
| Throughput | 15-100 TPS | **50,000+ TPS** |
| Native Social Integration | ❌ | **✅ Blinks/Actions** |
| Micro-payments (<$0.01) | ❌ Impractical | **✅ Native** |
| Token Standard | ERC-20 | **Token-2022 (Transfer Fee + Interest)** |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Phantom Wallet (or any Solana wallet)

### Installation

```bash
# Clone the repository
git clone https://github.com/SolKernalXYZ/web.git
cd web

# Install dependencies
npm install

# Set up environment variables (PostgreSQL required)
cp .env.example .env.local
# Edit .env.local — set DATABASE_URL and optional LLM keys

# Initialize database
npx prisma migrate dev

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Requirements:** Node.js 18+, a **PostgreSQL** database (`DATABASE_URL`), optional LLM API keys for live execution.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         User Layer                                │
│  Twitter │ Telegram │ Web App │ Mobile App │ API       │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Solana Blinks/Actions                          │
│        (Executable URLs with wallet signature prompts)           │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                     SolKernal Core (Web App)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Marketplace │  │   Execution  │  │   Staking    │           │
│  │   Browser    │  │    Engine    │  │   Dashboard  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└────────────┬───────────────┬───────────────┬────────────────────┘
             │               │               │
             ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  On-Chain Layer  │ │  LLM Layer   │ │  Database Layer  │
│                  │ │              │ │                  │
│ • Registry PDA   │ │ • Cloudflare │ │ • Skill Catalog  │
│ • $SKRN Token    │ │   Workers AI │ │ • Executions     │
│ • Execution Log  │ │ • OpenAI     │ │ • User Data      │
│ • Fee Splitter   │ │ • Anthropic  │ │ • Staking Stats  │
└──────────────────┘ └──────────────┘ └──────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend & Backend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | Full-stack React framework with server components |
| **Language** | TypeScript 5 | Type-safe JavaScript with modern features |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **UI Components** | Custom + Framer Motion | Animations and micro-interactions |

### Blockchain & Wallet

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Blockchain** | Solana (devnet/mainnet) | High-throughput, low-cost L1 blockchain |
| **Wallet Adapter** | @solana/wallet-adapter | Universal wallet connection (Phantom, Solflare, etc.) |
| **Web3 Library** | @solana/web3.js | Interact with Solana programs and accounts |
| **Smart Contracts** | Anchor Framework (Rust) | Solana program framework for PDAs and instructions |

### Database & ORM

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Database** | PostgreSQL | Relational database for skill catalog, executions, stats |
| **ORM** | Prisma 5 | Type-safe database client with migrations |

### AI & LLM

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Primary LLM** | Cloudflare Workers AI | Serverless AI inference with OpenAI-compatible API |
| **LLM Providers** | Groq, Google Gemini, Grok (xAI) | Fast inference via OpenAI-compatible API |
| **Fallback** | OpenAI API | GPT-4o, GPT-4 Turbo for complex skills |
| **Local Testing** | Mock responses | Zero-cost development without API keys |

---

## 📂 Project Structure

```
kernal/
├── .gitignore              # Git ignore rules
└── web/                    # Next.js application
    ├── src/
    │   ├── app/
    │   │   ├── api/        # API routes
    │   │   │   ├── skills/     # GET /api/skills, POST /api/skills
    │   │   │   ├── execute/    # POST /api/execute
    │   │   │   └── staking/    # GET/POST /api/staking
    │   │   ├── skills/         # Marketplace UI
    │   │   ├── run/            # Execution guide
    │   │   ├── stake/          # Staking dashboard
    │   │   ├── submit/         # Skill submission form
    │   │   ├── layout.tsx      # Root layout with providers
    │   │   └── page.tsx        # Homepage
    │   ├── components/         # Reusable UI components
    │   │   ├── SolanaProvider.tsx
    │   │   └── WalletButton.tsx
    │   └── lib/
    │       ├── db.ts           # Prisma client singleton
    │       └── llm.ts          # LLM execution engine
    ├── prisma/
    │   ├── schema.prisma       # Database schema
    │   ├── migrations/         # Migration history
    │   └── seed.ts             # Sample data
    ├── public/                 # Static assets
    ├── Dockerfile              # Production container
    ├── docker-compose.yml      # Multi-service orchestration
    ├── next.config.mjs         # Next.js configuration
    ├── tailwind.config.ts      # Tailwind CSS configuration
    └── package.json            # Dependencies and scripts
```

---

## 🎮 How to Use

### 1️⃣ Browse Skills

Visit the [marketplace](https://solkernal.xyz/skills) to discover AI skills across categories:
- 💰 DeFi (token analysis, portfolio optimization)
- 🎨 NFT (trait analysis, collection insights)
- 📊 Analytics (wallet profiling, transaction forensics)
- 🛠️ Developer Tools (code generation, smart contract auditing)

### 2️⃣ Execute a Skill (web app)

1. Open any skill card
2. Enter inputs
3. Connect Phantom wallet (identity)
4. Execute — LLM runs server-side (or labeled mock if keys missing)
5. View result and app-level receipt

> On-chain fee payment and Blinks are **not** enforced yet.

### 3️⃣ Submit Your Own Skill

1. Go to [Submit Skill](https://solkernal.xyz/submit)
2. Fill in name, description, category, system prompt, provider (Cloudflare / Google / Grok), model, fee in $SKRN
3. Connect wallet and submit
4. Skill appears in the marketplace registry

### 4️⃣ Stake & Earn

Staking is **coming soon**. The `/stake` page explains the design; no off-chain stake mutations are accepted.

---

## 🌍 Environment Variables

Create a `.env.local` file in the `web/` directory:

```bash
# Database (PostgreSQL required)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Solana Network
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_NETWORK="devnet"
NEXT_PUBLIC_SKRN_MINT_ADDRESS="9LnqE9nevGsDHqs7bhJSyMzXwxdQJ2x4ypJNreEZpump"

# LLM Providers (optional — mock execution if missing)
CLOUDFLARE_API_TOKEN=""
CLOUDFLARE_ACCOUNT_ID=""
GROQ_API_KEY=""
GOOGLE_API_KEY=""
XAI_API_KEY=""
TAVILY_API_KEY=""
```

---

## 🧪 Development Workflow

### Running the App

```bash
cd web
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database Management

```bash
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data
npm run db:reset         # Reset database (destructive!)
npx prisma studio        # Open Prisma GUI
```

### Docker

```bash
# Development
docker compose up --build

# Production
docker build -t solkernal:latest .
docker run -p 3000:3000 solkernal:latest
```

---

## 🧩 Key Features

### ✅ Implemented (v1 web foundation)

- ✅ Skill marketplace with search, filter, sort
- ✅ Skill detail pages with execution history
- ✅ Multi-provider LLM (Cloudflare, Groq, Google Gemini, Grok)
- ✅ Mock fallback when provider keys are missing
- ✅ $SKRN mint listed (pump.fun)
- ✅ Phantom wallet connect (identity)
- ✅ Skill submission form (validated API)
- ✅ Docs, health check (`/api/health`), Vercel + Docker packaging
- ✅ Responsive UI, basic SEO (metadata, sitemap, OG image)

### 🚧 In Progress (protocol)

- 🚧 Solana smart contracts (Anchor programs)
- 🚧 Real $SKRN fee settlement on execute
- 🚧 Solana Blinks / Actions
- 🚧 On-chain execution receipts
- 🚧 Live staking vault + fee distribution
- 🚧 Signed wallet intents for submit / execute
- 🚧 Builder analytics

### 🔮 Later

- More LLM providers / local models
- Skill versioning, fork, remix
- Reputation and governance
- Mobile clients
- Higher-SLA API tier

---

## 🚢 Deployment (Vercel)

1. Link the `web/` project in Vercel (framework: Next.js).
2. Set production env vars (at minimum `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`).
3. Add LLM keys for live execution (`XAI_API_KEY`, `GOOGLE_API_KEY`, etc.).
4. Build command: `prisma generate && npm run build` (see `vercel.json`).
5. Deploy: `npx vercel --prod` from `web/`, or push to the connected Git branch.
6. Smoke-test: `GET /api/health`, `/skills`, `/docs`.

Never commit real secrets. Use Vercel Environment Variables or a secrets manager.

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** this repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style (we use Prettier + ESLint)
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Inspired by:
- [GitKernal](https://gitkernal.app) — AI Skill OS on Base Network
- [Ratspeak](https://ratspeak.org) — Modular networking ecosystem
- Solana Foundation — For building the fastest blockchain
- Cloudflare — For serverless AI inference
- The open-source community — For tools that make this possible

---

## 🔗 Links

- **Website:** [solkernal.xyz](https://solkernal.xyz)
- **Documentation:** [docs.solkernal.xyz](https://solkernal.xyz/docs)
- **Twitter:** [@SolKernal_](https://x.com/SolKernal_)
- **GitHub:** [github.com/SolKernalXYZ](https://github.com/SolKernalXYZ)
- **Email:** [hello@solkernal.xyz](mailto:hello@solkernal.xyz)

---

<div align="center">

**Built with 🧠 on Solana**

*Privacy is a human right. Decentralization is inevitable.*

[![Star this repo](https://img.shields.io/github/stars/SolKernalXYZ/web?style=social)](https://github.com/SolKernalXYZ/web)
[![Follow on Twitter](https://img.shields.io/twitter/follow/SolKernal_?style=social)](https://x.com/SolKernal_)

</div>
