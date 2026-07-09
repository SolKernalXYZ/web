<div align="center">

# 🌐 SolKernal

### AI Skill Operating System on Solana

[![Website](https://img.shields.io/badge/🌐_solkernal.xyz-7C3AED?style=for-the-badge)](https://solkernal.xyz)
[![Twitter](https://img.shields.io/badge/@SolKernal__-Follow-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/SolKernal_)
[![License](https://img.shields.io/badge/License-MIT-A78BFA?style=for-the-badge)](LICENSE)

> **Deploy, execute, and compose autonomous AI skills on-chain.**  
> A permissionless marketplace where developers publish prompt bundles, users pay per execution, and stakers earn real yield.

**`$SKRN`**: `9LnqE9nevGsDHqs7bhJSyMzXwxdQJ2x4ypJNreEZpump`

[**Try Demo →**](https://solkernal.xyz/skills) • [**Read Docs →**](https://solkernal.xyz/docs) • [**Submit Skill →**](https://solkernal.xyz/submit)

</div>

---

## 🎯 What is SolKernal?

SolKernal is a **decentralized AI execution layer** built on Solana that makes AI skills:

- **Permissionless** — Anyone can publish. No approval needed.
- **Executable Anywhere** — Every skill becomes a Solana Blink (run from Twitter, Telegram, or any URL)
- **Verifiable** — Every execution writes an on-chain receipt with provenance
- **Composable** — Skills can call other skills as sub-routines
- **Revenue-Generating** — Builders earn 30% per execution, stakers earn 50%, treasury retains 20%

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
cd kernal/web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Initialize database
npx prisma migrate dev

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
| **Database** | SQLite (dev) / PostgreSQL (prod) | Relational database for skill catalog, executions, users |
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

### 2️⃣ Execute a Skill

#### Via Web App
1. Click any skill card
2. Enter required inputs (e.g., wallet address, token symbol)
3. Connect your Solana wallet
4. Confirm execution transaction (pays skill fee in USDC/SOL)
5. View results and on-chain receipt

#### Via Solana Blink (Twitter/Telegram)
1. Copy skill's Blink URL from skill detail page
2. Paste into Twitter/Telegram
3. Click the embedded action button
4. Sign transaction in your wallet
5. Results appear in-app

### 3️⃣ Submit Your Own Skill

1. Go to [Submit Skill](https://solkernal.xyz/submit)
2. Fill in metadata:
   - **Name** & **Description**
   - **Category** (DeFi, NFT, Analytics, Dev Tools)
   - **Prompt Template** (use `{{input}}` placeholders)
   - **LLM Provider** (Cloudflare, Groq, Google)
   - **Price** (in USDC)
3. Submit (free on devnet, small fee on mainnet)
4. Your skill goes live instantly with a generated Blink URL

### 4️⃣ Stake & Earn

1. Visit [Staking Dashboard](https://solkernal.xyz/stake)
2. Connect wallet with $SKRN tokens
3. Choose stake amount
4. Confirm transaction
5. Earn 50% of ALL execution fees (paid in USDC)
6. Claim rewards anytime (no lock-up period)

---

## 🌍 Environment Variables

Create a `.env.local` file in the `web/` directory:

```bash
# Database
DATABASE_URL="file:./dev.db"  # Use PostgreSQL URL for production

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Solana Network
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_NETWORK="devnet"

# Token Addresses (set after deployment)
NEXT_PUBLIC_SKRN_MINT_ADDRESS="9LnqE9nevGsDHqs7bhJSyMzXwxdQJ2x4ypJNreEZpump"

# LLM Providers (optional for development)
CLOUDFLARE_API_TOKEN=""
CLOUDFLARE_ACCOUNT_ID=""
GROQ_API_KEY=""
GOOGLE_API_KEY=""
OPENAI_API_KEY=""
XAI_API_KEY=""
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

### ✅ Implemented (v1.0)

- ✅ Skill marketplace with search, filter, sort
- ✅ Skill detail pages with execution history
- ✅ Real LLM execution (Cloudflare Workers AI, Groq, Google Gemini)
- ✅ Mock fallback for zero-cost development
- ✅ $SKRN token launched on pump.fun
- ✅ Phantom wallet integration
- ✅ Skill submission form
- ✅ Staking dashboard (UI + mock logic)
- ✅ Protocol statistics tracking
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility (WCAG 2.1 Level AA)
- ✅ SEO optimized with Open Graph metadata
- ✅ Docker deployment
- ✅ Vercel-ready

### 🚧 In Progress (v2.0)

- 🚧 Solana smart contracts (Anchor programs)
- 🚧 $SKRN Token-2022 program deployment
- 🚧 Real USDC payment integration
- 🚧 Solana Blinks/Actions generation
- 🚧 On-chain execution receipts (PDA accounts)
- 🚧 Skill chaining (composable pipelines)
- 🚧 Builder analytics dashboard
- 🚧 Telegram bot integration

### 🔮 Roadmap (v3.0+)

- Additional LLM providers (OpenAI, Anthropic, Llama, local models)
- Skill versioning and upgrades
- Skill forking and remixing
- Reputation system for builders
- Governance (on-chain voting with $SKRN)
- Mobile app (React Native)
- Enterprise API with SLA guarantees

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
