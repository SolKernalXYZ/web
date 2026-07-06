import LottiePlayer from "@/components/lottie/LottiePlayer";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <LottiePlayer name="kernel-boot" className="h-20 w-20" ariaLabel="Booting kernel" />
        <p className="font-mono text-mono-sm uppercase tracking-[0.18em] text-text-tertiary">
          Booting kernel<span className="animate-blink">_</span>
        </p>
      </div>
    </div>
  );
}
