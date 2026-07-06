"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import WalletButton from "./WalletButton";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { cn } from "@/lib/cn";
import { SkillsIcon, RunIcon, StakeIcon, SubmitIcon, ReceiptIcon } from "./icons";

const links = [
  { href: "/docs", label: "Docs", ext: "md", Icon: ReceiptIcon },
  { href: "/skills", label: "Skills", ext: "db", Icon: SkillsIcon },
  { href: "/run", label: "Run", ext: "exe", Icon: RunIcon },
  { href: "/stake", label: "Stake", ext: "db", Icon: StakeIcon },
  { href: "/submit", label: "Submit", ext: "md", Icon: SubmitIcon },
];

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change.
  useEffect(() => setMobileOpen(false), [pathname]);

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
          <div className="mt-2">
            <WalletButton className="w-full justify-center" />
          </div>
        </div>
      </div>
    </>
  );
}
