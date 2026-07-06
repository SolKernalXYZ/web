"use client";

import { useEffect, useState } from "react";
import { XIcon, CopyIcon, CheckIcon } from "@/components/icons";

const CA = "9LnqE9nevGsDHqs7bhJSyMzXwxdQJ2x4ypJNreEZpump";
const STORAGE_KEY = "skrn_ca_dismissed";

export default function CaAnnouncement() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const dismissed = sessionStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch { }
  }, []);

  const handleClose = () => {
    setVisible(false);
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 animate-fade-up"
      role="alert"
    >
      <div className="rounded-xl border border-border bg-bg-elevated p-4 shadow-lg backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-mono-xs mb-1.5 uppercase tracking-wider text-text-tertiary">
              Official $SKRN Token
            </p>
            <button
              onClick={handleCopy}
              className="group flex w-full items-center gap-2 rounded-lg bg-bg-subtle px-3 py-2 text-left text-xs transition-colors hover:bg-bg-hover sm:text-sm"
            >
              <code className="min-w-0 flex-1 truncate font-mono text-text-primary">
                {CA}
              </code>
              <span className="shrink-0 text-text-tertiary transition-colors group-hover:text-accent">
                {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
              </span>
            </button>
            {copied && (
              <p className="mt-1 text-mono-xs text-accent">Copied!</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="shrink-0 rounded-lg p-1.5 text-text-tertiary transition-colors hover:bg-bg-hover hover:text-text-primary"
            aria-label="Close announcement"
          >
            <XIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
