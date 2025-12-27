"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface HeroTitleProps {
  children: React.ReactNode;
  /** Animation delay in seconds (default: 2.5s after image loads) */
  delay?: number;
  className?: string;
}

/**
 * HeroTitle - Animated title for Apple TV-style hero sections
 *
 * Features:
 * - Negative margin to ride the blur edge
 * - Fade-in + slide-up animation with configurable delay
 * - Respects prefers-reduced-motion for accessibility
 * - Designed for use within HeroExtendedContent
 */
export function HeroTitle({ children, delay = 2.5, className }: HeroTitleProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <h1
      className={cn(
        "-mt-8 font-bold text-white text-2xl leading-snug line-clamp-2 text-center font-[family-name:var(--font-space-grotesk)] tracking-tight",
        // Use simpler fade-only animation when reduced motion is preferred
        prefersReducedMotion
          ? "animate-in fade-in duration-300"
          : "animate-in fade-in slide-in-from-bottom-2 duration-700",
        className
      )}
      style={{
        animationDelay: prefersReducedMotion ? "0.1s" : `${delay}s`,
        animationFillMode: "backwards",
      }}
    >
      {children}
    </h1>
  );
}
