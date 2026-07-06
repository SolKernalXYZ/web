"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/cn";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: render a stable placeholder until mounted.
  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-secondary",
        "transition-colors hover:border-border-focused hover:text-text-primary",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        className,
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={cn(
          "absolute transition-all duration-300 ease-out-expo",
          mounted && isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      >
        {/* Sun */}
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={cn(
          "absolute transition-all duration-300 ease-out-expo",
          mounted && isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0",
        )}
      >
        {/* Moon */}
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
