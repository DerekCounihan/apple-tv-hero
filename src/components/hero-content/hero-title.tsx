"use client";

import { cn } from "@/lib/utils";

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
 * - Designed for use within HeroExtendedContent
 */
export function HeroTitle({ children, delay = 2.5, className }: HeroTitleProps) {
  return (
    <h1
      className={cn(
        "-mt-8 font-bold text-white text-2xl leading-snug line-clamp-2 text-center font-[family-name:var(--font-space-grotesk)] tracking-tight",
        "animate-in fade-in slide-in-from-bottom-2 duration-700",
        className
      )}
      style={{
        animationDelay: `${delay}s`,
        animationFillMode: "backwards",
      }}
    >
      {children}
    </h1>
  );
}
