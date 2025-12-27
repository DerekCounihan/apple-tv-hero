"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface HeroDescriptionProps {
  children: React.ReactNode;
  /** Animation delay in seconds (default: 2.7s, slightly after title) */
  delay?: number;
  className?: string;
}

/**
 * HeroDescription - Subtle description text for Apple TV-style hero sections
 *
 * Features:
 * - Muted text for secondary information
 * - Fade-in animation following title
 * - Respects prefers-reduced-motion for accessibility
 * - Centered, small text
 */
export function HeroDescription({
  children,
  delay = 2.7,
  className,
}: HeroDescriptionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <p
      className={cn(
        "text-white/60 text-sm text-center leading-relaxed max-w-xs mx-auto",
        // Use simpler fade-only animation when reduced motion is preferred
        prefersReducedMotion
          ? "animate-in fade-in duration-300"
          : "animate-in fade-in slide-in-from-bottom-1 duration-500",
        className
      )}
      style={{
        animationDelay: prefersReducedMotion ? "0.15s" : `${delay}s`,
        animationFillMode: "backwards",
      }}
    >
      {children}
    </p>
  );
}
