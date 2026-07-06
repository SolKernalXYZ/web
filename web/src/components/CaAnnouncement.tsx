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
      className="fixed bottom-0 left-0 right-0 z-[100] animate-fade-up sm:bottom-6 sm:left-1/2 sm:w-[calc(100%-2rem)] sm:max-w-lg sm:-translate-x-1/2"
      role="alert"
    >
      <div className="rounded-none border-t border-border bg-bg-elevated p-3 shadow-lg backdrop-blur-xl sm:rounded-xl sm:border sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="mb-1.5 text-mono-xs uppercase tracking-wider text-text-tertiary">
              Official $SKRN Token
            </p>
            <button
              onClick={handleCopy}
              className="flex w-full items-center gap-2 rounded-lg bg-bg-subtle px-2 py-2.5 text-xs transition-colors active:bg-bg-hover sm:px-3 sm:text-sm"
            >
              <code className="min-w-0 flex-1 break-all font-mono leading-tight text-text-primary">
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
            className="flex shrink-0 items-center justify-center rounded-lg p-2 text-text-tertiary transition-colors active:text-text-primary sm:hover:bg-bg-hover sm:hover:text-text-primary"
            aria-label="Close announcement"
          >
            <XIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
