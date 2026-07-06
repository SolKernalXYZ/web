import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-bg-hover text-text-secondary border-transparent",
  accent: "bg-accent-subtle text-accent border-transparent",
  success: "bg-success-subtle text-success border-transparent",
  warning: "bg-warning-subtle text-warning border-transparent",
  danger: "bg-danger-subtle text-danger border-transparent",
  outline: "bg-transparent text-text-secondary border-border",
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  mono?: boolean;
  className?: string;
}

export default function Badge({ children, tone = "neutral", mono = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-tag border px-2 py-0.5 text-tiny font-medium",
        mono && "font-mono uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
