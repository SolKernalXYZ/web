"use client";

import { m } from "framer-motion";
import { ComponentType, ReactNode } from "react";

type Tag = "div" | "section" | "li" | "span" | "article" | "ul";

// Motion components per tag share a compatible-enough prop surface for our use;
// a permissive component type keeps the lookup ergonomic without `any` leaks.
const MOTION: Record<Tag, ComponentType<Record<string, unknown>>> = {
  div: m.div as ComponentType<Record<string, unknown>>,
  section: m.section as ComponentType<Record<string, unknown>>,
  li: m.li as ComponentType<Record<string, unknown>>,
  span: m.span as ComponentType<Record<string, unknown>>,
  article: m.article as ComponentType<Record<string, unknown>>,
  ul: m.ul as ComponentType<Record<string, unknown>>,
};

interface RevealProps {
  children: ReactNode;
  /** Stagger index — multiplies the base delay for sequential reveals. */
  index?: number;
  delay?: number;
  /** Travel distance in px. */
  y?: number;
  as?: Tag;
  className?: string;
  once?: boolean;
}

/**
 * Scroll-reveal wrapper. Fades + lifts content into view a single time.
 * Honors reduced-motion via the parent MotionConfig (animation collapses to
 * an instant opacity change).
 */
export default function Reveal({
  children,
  index = 0,
  delay = 0,
  y = 18,
  as = "div",
  className = "",
  once = true,
}: RevealProps) {
  const MotionTag = MOTION[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.6,
        delay: delay + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
