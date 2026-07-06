import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Lift + accent-border on hover (for interactive/linked cards). */
  hoverable?: boolean;
  /** Elevated surface with a drop shadow. */
  elevated?: boolean;
  as?: "div" | "article" | "li";
}

export default function Card({
  children,
  className = "",
  hoverable = true,
  elevated = false,
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={cn(
        "relative rounded-lg border border-border p-5",
        elevated ? "bg-bg-elevated shadow-md" : "bg-bg-subtle",
        hoverable && "lift hover:border-border-focused hover:shadow-md",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
