import Link from "next/link";
import Logo from "./Logo";
import StatusTicker from "./StatusTicker";
import { GithubIcon, XIcon } from "./icons";

const columns: { heading: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    heading: "Protocol",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Browse Skills", href: "/skills" },
      { label: "Run a Skill", href: "/run" },
      { label: "Stake $SKRN", href: "/stake" },
      { label: "Submit a Skill", href: "/submit" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Quickstart", href: "/docs/quickstart" },
      { label: "API Reference", href: "/docs/api-overview" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "$SKRN Token", href: "/#token" },
      {
        label: "Buy on Pump.fun",
        href: "https://pump.fun/coin/9LnqE9nevGsDHqs7bhJSyMzXwxdQJ2x4ypJNreEZpump",
        external: true,
      },
    ],
  },
];

const socials = [
  { label: "GitHub", href: "https://github.com/SolKernalXYZ", Icon: GithubIcon },
  { label: "X / Twitter", href: "https://x.com/SolKernal_", Icon: XIcon },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-subtle">
      <StatusTicker />
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 text-text-primary" aria-label="SolKernal home">
              <Logo size={28} gradient />
              <span className="font-mono text-small font-semibold uppercase tracking-[0.18em]">SolKernal</span>
            </Link>
            <p className="mt-4 max-w-xs text-small text-text-secondary">
              The on-chain operating system for AI skills. Publish, execute, and compose autonomous skills on Solana — with real yield for stakers.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-border-focused hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-tiny font-semibold uppercase tracking-[0.14em] text-text-tertiary">{col.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-small text-text-secondary transition-colors hover:text-text-primary"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-small text-text-secondary transition-colors hover:text-text-primary">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-mono-sm text-text-tertiary">© {new Date().getFullYear()} SolKernal — Built on Solana</p>
          <p className="flex items-center gap-2 font-mono text-mono-sm text-text-tertiary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
            Web app live · on-chain settlement next
          </p>
        </div>
      </div>
    </footer>
  );
}
