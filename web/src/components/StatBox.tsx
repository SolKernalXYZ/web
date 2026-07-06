import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StatBoxProps {
  value: string;
  label: string;
  hint?: string;
  icon?: ReactNode;
  /** Tint the value with the positive/yield color. */
  positive?: boolean;
  className?: string;
}

export default function StatBox({ value, label, hint, icon, positive = false, className }: StatBoxProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-bg-subtle p-4 transition-colors hover:border-border-focused",
        className,
      )}
    >
      {/* hairline accent that animates in on hover */}
      <span className="absolute inset-x-0 top-0 h-px scale-x-0 bg-accent transition-transform duration-300 ease-out-expo group-hover:scale-x-100" />
      <div className="flex items-center justify-between">
        <span className="text-tiny font-medium uppercase tracking-[0.14em] text-text-tertiary">{label}</span>
        {icon && <span className="text-text-tertiary transition-colors group-hover:text-accent">{icon}</span>}
      </div>
      <div className={cn("mt-2 font-mono text-h2 tabular-nums", positive ? "text-success" : "text-text-primary")}>
        {value}
      </div>
      {hint && <div className="mt-1 text-small text-text-secondary">{hint}</div>}
    </div>
  );
}
