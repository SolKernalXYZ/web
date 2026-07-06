"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import WalletButton from "./WalletButton";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { cn } from "@/lib/cn";
import {
  SkillsIcon, RunIcon, StakeIcon, SubmitIcon, ReceiptIcon,
  CheckIcon, SparkIcon,
} from "./icons";

const links = [
  { href: "/docs", label: "Docs", ext: "md", Icon: ReceiptIcon },
  { href: "/skills", label: "Skills", ext: "db", Icon: SkillsIcon },
  { href: "/run", label: "Run", ext: "exe", Icon: RunIcon },
  { href: "/stake", label: "Stake", ext: "db", Icon: StakeIcon },
  { href: "/submit", label: "Submit", ext: "md", Icon: SubmitIcon },
];

const roadmapPhases = [
  {
    title: "Implemented",
    subtitle: "v1.0",
    status: "done" as const,
    items: [
      "Skill marketplace with search, filter, sort",
      "Skill detail pages with execution history",
      "Real LLM execution (Cloudflare Workers AI)",
      "Mock fallback for zero-cost development",
      "Phantom wallet integration",
      "Skill submission form",
      "Staking dashboard (UI + mock logic)",
      "Protocol statistics tracking",
      "Responsive design (mobile, tablet, desktop)",
      "Accessibility (WCAG 2.1 Level AA)",
      "SEO optimized with Open Graph metadata",
      "Docker deployment",
      "Vercel-ready",
    ],
  },
  {
    title: "In Progress",
    subtitle: "v2.0",
    status: "progress" as const,
    items: [
      "Solana smart contracts (Anchor programs)",
      "$SKRN Token-2022 deployment",
      "Real $SKRN payment integration",
      "Solana Blinks/Actions generation",
      "On-chain execution receipts (PDA accounts)",
      "Skill chaining (composable pipelines)",
      "Builder analytics dashboard",
      "Telegram bot integration",
    ],
  },
  {
    title: "Roadmap",
    subtitle: "v3.0+",
    status: "later" as const,
    items: [
      "Multi-LLM support (OpenAI, Anthropic, Llama, local models)",
      "Skill versioning and upgrades",
      "Skill forking and remixing",
      "Reputation system for builders",
      "Governance (on-chain voting with $SKRN)",
      "Mobile app (React Native)",
      "Enterprise API with SLA guarantees",
    ],
  },
];

function RoadmapIcon(p: { size?: number; className?: string }) {
  return (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={p.className} aria-hidden="true">
      <path d="M3 12h2l4-8 4 16 4-8h4" />
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const roadmapRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setRoadmapOpen(false); }, [pathname]);

  useEffect(() => {
    if (!roadmapOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setRoadmapOpen(false); };
    const onClick = (e: MouseEvent) => {
      if (roadmapRef.current && !roadmapRef.current.contains(e.target as Node)) setRoadmapOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [roadmapOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-bg-inverse focus:px-4 focus:py-2 focus:text-text-inverse"
      >
        Skip to main content
      </a>

      <nav
        aria-label="Main navigation"
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-14 transition-colors duration-300",
          "border-b backdrop-blur-xl",
          scrolled
            ? "border-border bg-bg-primary/80 supports-[backdrop-filter]:bg-bg-primary/65"
            : "border-transparent bg-bg-primary/40",
        )}
      >
        <div className="mx-auto flex h-full max-w-content items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            aria-label="SolKernal home"
          >
            <span className="text-text-primary transition-transform duration-300 ease-out-expo group-hover:rotate-[8deg]">
              <Logo size={26} />
            </span>
            <span className="font-mono text-small font-semibold uppercase tracking-[0.18em] text-text-primary">
              SolKernal
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label, ext, Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-2 rounded-md px-3 py-2 text-small font-medium transition-colors",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
                      active
                        ? "bg-bg-hover text-text-primary"
                        : "text-text-secondary hover:bg-bg-hover hover:text-text-primary",
                    )}
                  >
                    <Icon size={16} className={cn(active ? "text-accent" : "text-text-tertiary group-hover:text-text-secondary")} />
                    <span>
                      {label}
                      <span className="text-text-tertiary">.{ext}</span>
                    </span>
                  </Link>
                </li>
              );
            })}

            {/* Roadmap dropdown */}
            <li ref={roadmapRef} className="relative">
              <button
                onClick={() => setRoadmapOpen((o) => !o)}
                aria-expanded={roadmapOpen}
                aria-haspopup="true"
                className={cn(
                  "group flex items-center gap-2 rounded-md px-3 py-2 text-small font-medium transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
                  roadmapOpen
                    ? "bg-bg-hover text-text-primary"
                    : "text-text-secondary hover:bg-bg-hover hover:text-text-primary",
                )}
              >
                <RoadmapIcon size={16} className={cn(roadmapOpen ? "text-accent" : "text-text-tertiary group-hover:text-text-secondary")} />
                <span>Roadmap</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={cn("transition-transform duration-200", roadmapOpen && "rotate-180")} aria-hidden="true">
                  <path d="M2 4l3 3 3-3" />
                </svg>
              </button>

              {roadmapOpen && (
                <div className="absolute right-0 top-full mt-2 w-[640px] origin-top-right rounded-xl border border-border bg-bg-primary shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200" role="menu">
                  <div className="grid grid-cols-3 gap-px bg-border">
                    {roadmapPhases.map((phase) => (
                      <div key={phase.title} className="flex flex-col bg-bg-subtle p-4">
                        <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
                          {phase.status === "done" && <CheckIcon size={14} className="text-success" />}
                          {phase.status === "progress" && <SparkIcon size={14} className="text-accent" />}
                          {phase.status === "later" && <RoadmapIcon size={14} className="text-text-tertiary" />}
                          <span className="font-mono text-tiny font-semibold uppercase tracking-[0.12em] text-text-primary">{phase.title}</span>
                          <span className="font-mono text-mono-sm text-text-tertiary">{phase.subtitle}</span>
                        </div>
                        <ul className="flex-1 space-y-1.5">
                          {phase.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-mono-sm text-text-secondary leading-snug">
                              {phase.status === "done" && <CheckIcon size={10} className="mt-0.5 shrink-0 text-success" />}
                              {phase.status === "progress" && <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                              {phase.status === "later" && <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-text-tertiary/40" />}
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <WalletButton className="hidden sm:inline-flex" />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-border-focused hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                {mobileOpen ? <path d="M4 4l10 10M14 4L4 14" /> : <path d="M2 5h14M2 9h14M2 13h14" />}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-x-0 top-14 z-40 origin-top border-b border-border bg-bg-primary/95 backdrop-blur-xl transition-all duration-300 ease-out-expo md:hidden",
          mobileOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        )}
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        <div className="flex flex-col gap-1 p-4">
          {links.map(({ href, label, ext, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 text-body font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  active ? "bg-bg-hover text-text-primary" : "text-text-secondary hover:bg-bg-hover",
                )}
              >
                <Icon size={18} className={active ? "text-accent" : "text-text-tertiary"} />
                {label}
                <span className="text-text-tertiary">.{ext}</span>
              </Link>
            );
          })}

          {/* Mobile roadmap */}
          <details className="group mt-1" open={false}>
            <summary className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-3 text-body font-medium text-text-secondary hover:bg-bg-hover">
              <RoadmapIcon size={18} className="text-text-tertiary" />
              <span>Roadmap</span>
              <svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="ml-auto transition-transform group-open:rotate-180" aria-hidden="true">
                <path d="M2 4l3 3 3-3" />
              </svg>
            </summary>
            <div className="mt-1 space-y-3 pl-9">
              {roadmapPhases.map((phase) => (
                <div key={phase.title}>
                  <div className="mb-1 flex items-center gap-1.5 text-tiny font-semibold uppercase tracking-[0.12em] text-text-primary">
                    {phase.status === "done" && <CheckIcon size={12} className="text-success" />}
                    {phase.status === "progress" && <SparkIcon size={12} className="text-accent" />}
                    {phase.status === "later" && <RoadmapIcon size={12} className="text-text-tertiary" />}
                    {phase.title}
                    <span className="font-mono font-normal text-text-tertiary">{phase.subtitle}</span>
                  </div>
                  <ul className="space-y-1">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-mono-sm text-text-secondary">
                        {phase.status === "done" && <CheckIcon size={8} className="mt-0.5 shrink-0 text-success" />}
                        {phase.status === "progress" && <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-accent" />}
                        {phase.status === "later" && <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-text-tertiary/40" />}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>

          <div className="mt-2">
            <WalletButton className="w-full justify-center" />
          </div>
        </div>
      </div>
    </>
  );
}
