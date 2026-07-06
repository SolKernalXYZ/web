"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";
import { cn } from "@/lib/cn";
import { lottieAnimations, type LottieName } from "./animations";

interface LottiePlayerProps {
  /** Animation from the SolKernal motion registry. */
  name: LottieName;
  loop?: boolean;
  /** Play automatically once visible (still gated by reduced-motion). */
  autoplay?: boolean;
  speed?: number;
  className?: string;
  /**
   * When provided, the animation is announced to assistive tech as an image
   * with this label. Omit for purely decorative motion (it is then hidden
   * from screen readers).
   */
  ariaLabel?: string;
  /** Frame to freeze on for the reduced-motion poster (defaults to the end). */
  posterFrame?: number;
  onComplete?: () => void;
}

/**
 * LottiePlayer — the single entry point for the motion system.
 *
 * Production safeguards:
 * • The `lottie-web` light build is code-split and imported **only** once the
 *   element scrolls into view (IntersectionObserver) — zero cost otherwise.
 * • Playback pauses when scrolled out of view to save the main thread.
 * • `prefers-reduced-motion` renders a single static poster frame instead of
 *   animating, honouring the OS setting.
 * • SVG renderer (GPU-friendly, crisp at any size) with the instance fully
 *   destroyed on unmount to avoid leaks.
 */
export default function LottiePlayer({
  name,
  loop = true,
  autoplay = true,
  speed = 1,
  className,
  ariaLabel,
  posterFrame,
  onComplete,
}: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const inViewRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [reduced, setReduced] = useState(false);

  // Track the OS reduced-motion preference (and react to live changes).
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    const ensureLoaded = async () => {
      if (animRef.current || cancelled) return;
      const mod = await import("lottie-web/build/player/lottie_light");
      if (cancelled || !containerRef.current) return;

      const anim = mod.default.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: reduced ? false : loop,
        autoplay: false,
        // Clone so lottie's internal mutation never corrupts the shared registry.
        animationData: structuredClone(lottieAnimations[name]),
        rendererSettings: { progressiveLoad: false, hideOnTransparent: true },
      });
      anim.setSpeed(speed);
      animRef.current = anim;

      if (reduced) {
        const frame = posterFrame ?? Math.max(0, (anim.totalFrames || 1) - 1);
        anim.goToAndStop(frame, true);
        return;
      }
      if (onCompleteRef.current) {
        anim.addEventListener("complete", () => onCompleteRef.current?.());
      }
      if (autoplay && inViewRef.current) anim.play();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          void ensureLoaded().then(() => {
            if (!reduced && autoplay && animRef.current) animRef.current.play();
          });
        } else {
          animRef.current?.pause();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, [name, loop, autoplay, speed, reduced, posterFrame]);

  return (
    <div
      ref={containerRef}
      className={cn(className)}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
