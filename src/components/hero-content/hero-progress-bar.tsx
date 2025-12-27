"use client";

import { cn } from "@/lib/utils";

interface HeroProgressBarProps {
  /** Total number of segments */
  total: number;
  /** Number of completed segments */
  completed: number;
  /** Additional class names */
  className?: string;
}

/**
 * HeroProgressBar - Segmented progress bar for Apple TV-style hero sections
 *
 * Features:
 * - Segmented display for challenge/achievement progress
 * - White for completed, white/30 for incomplete
 * - Flexible width distribution
 */
export function HeroProgressBar({
  total,
  completed,
  className,
}: HeroProgressBarProps) {
  if (total <= 0) {
    return null;
  }

  return (
    <div className={cn("flex space-x-1", className)}>
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={`progress-segment-${index}`}
          className={cn("h-1 flex-1 rounded-full transition-colors", {
            "bg-white": index < completed,
            "bg-white/30": index >= completed,
          })}
        />
      ))}
    </div>
  );
}
