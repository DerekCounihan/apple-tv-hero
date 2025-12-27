"use client";

import { cn } from "@/lib/utils";

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
}

/**
 * HeroActionButton - Primary action button for Apple TV-style hero sections
 *
 * Features:
 * - Primary: White background, black text
 * - Secondary: Outline with white border
 * - Full width, large size
 * - Loading and disabled states
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
}: HeroActionButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      className={cn(
        "w-full font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors",
        isPrimary
          ? "bg-white text-black hover:bg-white/90"
          : "border border-white/30 text-white hover:bg-white/10 bg-transparent",
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
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
