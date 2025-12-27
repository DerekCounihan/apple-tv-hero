"use client";

import { cn } from "@/lib/utils";

interface HeroExtendedContentProps {
  children: React.ReactNode;
  className?: string;
  /** Show on desktop as well (default: false, mobile-only) */
  showOnDesktop?: boolean;
}

/**
 * HeroExtendedContent - Container for Apple TV-style extended content area
 *
 * Features:
 * - Consistent padding (px-5 pb-6)
 * - Flex column layout with gap-4
 * - Mobile-only by default (md:hidden)
 */
export function HeroExtendedContent({
  children,
  className,
  showOnDesktop = false,
}: HeroExtendedContentProps) {
  return (
    <div className={cn("px-5 pb-6", !showOnDesktop && "md:hidden", className)}>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
