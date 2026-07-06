"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import { ReactNode } from "react";

/**
 * Loads only the DOM animation feature set of framer-motion (tree-shaken,
 * ~5kb) and enforces `m.*` usage via `strict`. MotionConfig honors the user's
 * reduced-motion OS preference for every descendant animation.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
