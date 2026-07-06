"use client";

import Button from "@/components/Button";
import LottiePlayer from "@/components/lottie/LottiePlayer";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <LottiePlayer name="error-recovery" className="h-32 w-32" ariaLabel="An error occurred" />
        <h1 className="mt-6 text-h2">Something went wrong</h1>
        <p className="mt-2 text-body text-text-secondary">
          {error.message || "An unexpected error occurred while processing your request. Please try again."}
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-mono-sm text-text-tertiary">ref: {error.digest}</p>
        )}
        <div className="mt-7">
          <Button onClick={reset} variant="accent">Try again</Button>
        </div>
      </div>
    </div>
  );
}
