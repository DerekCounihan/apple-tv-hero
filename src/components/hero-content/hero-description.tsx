"use client";

import { cn } from "@/lib/utils";

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
 * - Centered, small text
 */
export function HeroDescription({
  children,
  delay = 2.7,
  className,
}: HeroDescriptionProps) {
  return (
    <p
      className={cn(
        "text-white/60 text-sm text-center leading-relaxed max-w-xs mx-auto",
        "animate-in fade-in slide-in-from-bottom-1 duration-500",
        className
      )}
      style={{
        animationDelay: `${delay}s`,
        animationFillMode: "backwards",
      }}
    >
      {children}
    </p>
  );
}
