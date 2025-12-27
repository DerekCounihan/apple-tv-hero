"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface HeroActionButtonProps {
  children: React.ReactNode;
  /** Icon to show before the text */
  icon?: React.ReactNode;
  /** Click handler */
  onClick: () => void;
  /** Show loading state */
  loading?: boolean;
  /** Disable the button */
  disabled?: boolean;
  /** Button variant (default: primary) */
  variant?: "primary" | "secondary";
  /** Additional class names */
  className?: string;
  /** Aria label for accessibility */
  ariaLabel?: string;
  /** Animation delay in seconds (default: 2.6s) */
  delay?: number;
}

/**
 * HeroActionButton - Primary action button for Apple TV-style hero sections
 *
 * Features:
 * - Primary: White background, black text
 * - Secondary: Outline with white border
 * - Full width, large size
 * - Loading and disabled states
 * - Respects prefers-reduced-motion for accessibility
 */
export function HeroActionButton({
  children,
  icon,
  onClick,
  loading = false,
  disabled = false,
  variant = "primary",
  className,
  ariaLabel,
  delay = 2.6,
}: HeroActionButtonProps) {
  const isPrimary = variant === "primary";
  const prefersReducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      className={cn(
        "w-full font-semibold py-3 px-6 rounded-full flex items-center justify-center transition-colors",
        isPrimary
          ? "bg-white text-black hover:bg-white/90"
          : "border border-white/30 text-white hover:bg-white/10 bg-transparent",
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        // Use simpler fade-only animation when reduced motion is preferred
        prefersReducedMotion
          ? "animate-in fade-in duration-300"
          : "animate-in fade-in slide-in-from-bottom-1 duration-500",
        className
      )}
      style={{
        animationDelay: prefersReducedMotion ? "0.1s" : `${delay}s`,
        animationFillMode: "backwards",
      }}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabel}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {loading ? "Loading..." : children}
    </button>
  );
}
