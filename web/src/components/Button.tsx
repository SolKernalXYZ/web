import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  // Inverts per theme: black-on-white (light) / white-on-black (dark).
  primary:
    "bg-bg-inverse text-text-inverse border border-bg-inverse hover:opacity-90 active:opacity-100",
  secondary:
    "bg-transparent text-text-primary border border-border-strong hover:bg-bg-hover hover:border-border-focused",
  accent:
    "bg-accent text-accent-text border border-accent hover:bg-accent-hover shadow-sm",
  ghost:
    "bg-transparent text-text-secondary border border-transparent hover:bg-bg-hover hover:text-text-primary",
  danger:
    "bg-danger text-white border border-danger hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-small gap-1.5",
  md: "h-10 px-4 text-[13px] gap-2",
  lg: "h-12 px-6 text-body gap-2.5",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center rounded-md font-sans font-semibold tracking-wide",
        "transition-[opacity,background-color,border-color,transform] duration-200 ease-out-expo",
        "active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span
          className="absolute h-4 w-4 animate-spin-slow rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      <span className={cn("inline-flex items-center", sizes[size].includes("gap") ? "" : "", loading && "opacity-0")}>
        {leadingIcon && <span className="mr-2 inline-flex shrink-0">{leadingIcon}</span>}
        {children}
        {trailingIcon && (
          <span className="ml-2 inline-flex shrink-0 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5">
            {trailingIcon}
          </span>
        )}
      </span>
    </button>
  );
}
