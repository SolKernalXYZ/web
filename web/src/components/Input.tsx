import {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
  useId,
} from "react";
import { cn } from "@/lib/cn";

const base =
  "w-full rounded-md border border-border bg-bg-primary px-3 py-2.5 text-body text-text-primary placeholder:text-text-tertiary " +
  "transition-colors duration-150 hover:border-border-strong " +
  "focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-0";

const labelCls = "mb-1.5 block text-small font-medium text-text-secondary";
const errorCls = "mt-1.5 text-small text-danger";

function Field({
  label,
  htmlFor,
  error,
  errorId,
  children,
  hint,
}: {
  label?: string;
  htmlFor: string;
  error?: string;
  errorId?: string;
  children: ReactNode;
  hint?: string;
}) {
  if (!label && !error && !hint) return <>{children}</>;
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className={labelCls}>
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1.5 text-small text-text-tertiary">{hint}</p>}
      {error && (
        <p id={errorId} className={errorCls} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({ label, error, hint, className = "", id, ...rest }: InputProps) {
  const gen = useId();
  const inputId = id || gen;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <Field label={label} htmlFor={inputId} error={error} errorId={errorId} hint={hint}>
      <input
        id={inputId}
        className={cn(base, error && "border-danger focus:border-danger focus-visible:ring-danger/40", className)}
        aria-invalid={!!error}
        aria-describedby={errorId}
        {...rest}
      />
    </Field>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className = "", id, ...rest }: TextareaProps) {
  const gen = useId();
  const taId = id || gen;
  const errorId = error ? `${taId}-error` : undefined;
  return (
    <Field label={label} htmlFor={taId} error={error} errorId={errorId} hint={hint}>
      <textarea
        id={taId}
        className={cn(base, "min-h-[120px] resize-y", error && "border-danger focus:border-danger focus-visible:ring-danger/40", className)}
        aria-invalid={!!error}
        aria-describedby={errorId}
        {...rest}
      />
    </Field>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function Select({ label, error, hint, className = "", children, id, ...rest }: SelectProps) {
  const gen = useId();
  const selectId = id || gen;
  const errorId = error ? `${selectId}-error` : undefined;
  return (
    <Field label={label} htmlFor={selectId} error={error} errorId={errorId} hint={hint}>
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            base,
            "appearance-none pr-9",
            error && "border-danger focus:border-danger focus-visible:ring-danger/40",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...rest}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </Field>
  );
}
