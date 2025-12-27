"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useModalContext } from "./modal-context";
import { useImageColor } from "./use-image-color";

// Extended content reveal - slides up with significant delay after hero
const extendedContentRevealVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.4, // Wait for hero to fully reveal before content appears
      ease: "easeOut" as const,
    },
  },
};

interface ParallaxHeroLayoutProps {
  /** Hero image source URL */
  heroImage: string;
  /** Alt text for the hero image */
  heroAlt: string;
  /** Height of the hero section in pixels (default: 320). Ignored if aspectRatio is set. */
  heroHeight?: number;
  /** Aspect ratio for responsive height based on width.
   * - "auto": Calculates height from the actual image's natural dimensions
   * - "1/1", "4/3", etc.: Uses the specified aspect ratio
   * When set, heroHeight is ignored and the height is calculated from the container width. */
  aspectRatio?: "auto" | "1/1" | "4/3" | "16/9" | "3/4";
  /** Title shown in the sticky header when scrolled */
  title: string;
  /** Optional subtitle for the sticky header */
  subtitle?: string;
  /** Content to render below the hero */
  children: React.ReactNode;
  /** Custom left action button (defaults to close/back button) */
  leftAction?: React.ReactNode;
  /** Custom right action button */
  rightAction?: React.ReactNode;
  /** Custom center action element for the fixed header (shown between left/right) */
  centerAction?: React.ReactNode;
  /** Fallback href for the back button when not in modal context */
  fallbackHref?: string;
  /** Additional class names for the container */
  className?: string;
  /** Optional gradient overlay on hero (default: true) */
  showGradient?: boolean;
  /** Optional blur effect on hero background */
  heroBlur?: boolean;
  /** Content to overlay on top of the hero image (title, stats, etc.) */
  heroOverlay?: React.ReactNode;
  /** Content to show in the extended color area below the hero (Apple TV style) */
  heroExtendedContent?: React.ReactNode;
  /** Enable Apple TV style color extraction for extended area */
  useColorExtraction?: boolean;
}

/**
 * ParallaxHeroLayout - Apple TV style parallax header layout
 *
 * Features:
 * - Hero image with parallax effect (moves at 50% scroll speed)
 * - Scale effect when pulling down past the top (overscroll)
 * - Fixed action buttons (close/back) that stay visible
 * - Fixed header that fades in when hero scrolls out of view
 * - Apple TV style color extraction for extended content area
 * - Three-phase loading: color → blur → image with Ken Burns effect
 * - Smooth animations powered by Framer Motion
 */
export function ParallaxHeroLayout({
  heroImage,
  heroAlt,
  heroHeight = 320,
  aspectRatio,
  title,
  subtitle,
  children,
  leftAction,
  rightAction,
  centerAction,
  fallbackHref,
  className,
  showGradient = true,
  heroBlur = false,
  heroOverlay,
  heroExtendedContent,
  useColorExtraction = false,
}: ParallaxHeroLayoutProps) {
  const router = useRouter();
  const modalContext = useModalContext();
  const scrollContainerRef = modalContext?.scrollContainerRef;
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [computedHeight, setComputedHeight] = useState(heroHeight);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [isHeroImageLoaded, setIsHeroImageLoaded] = useState(false);
  const heroContainerRef = useRef<HTMLDivElement>(null);

  // Load image to get its natural dimensions when autoHeight is enabled
  useEffect(() => {
    if (!aspectRatio || aspectRatio !== "auto") {
      setImageAspectRatio(null);
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      // Store aspect ratio as height/width for calculation
      setImageAspectRatio(img.naturalHeight / img.naturalWidth);
    };
    img.src = heroImage;
  }, [heroImage, aspectRatio]);

  // Calculate height based on aspect ratio and container width
  useEffect(() => {
    if (!heroContainerRef.current) {
      setComputedHeight(heroHeight);
      return;
    }

    // If no aspectRatio or aspectRatio is not set, use fixed height
    if (!aspectRatio) {
      setComputedHeight(heroHeight);
      return;
    }

    const calculateHeight = () => {
      if (!heroContainerRef.current) return;
      const width = heroContainerRef.current.offsetWidth;

      // Skip calculation if width is 0 (container not yet laid out)
      if (width === 0) return;

      if (aspectRatio === "auto" && imageAspectRatio) {
        // Use the actual image's aspect ratio
        setComputedHeight(Math.round(width * imageAspectRatio));
      } else if (aspectRatio !== "auto") {
        // Use the specified aspect ratio
        const [w, h] = aspectRatio.split("/").map(Number);
        setComputedHeight(Math.round(width * (h / w)));
      } else {
        setComputedHeight(heroHeight);
      }
    };

    // Calculate on mount
    calculateHeight();

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(calculateHeight);
    resizeObserver.observe(heroContainerRef.current);

    return () => resizeObserver.disconnect();
  }, [aspectRatio, heroHeight, imageAspectRatio]);

  // Extract dominant color from hero image for Apple TV effect
  const { color: extractedColor } = useImageColor(
    useColorExtraction ? heroImage : null
  );

  // Three-phase loading:
  // 1. hasColor - color extracted successfully, solid color background established
  // 2. isBlurReady - 200ms after color, blur effect fades in
  // 3. isImageReady - image loaded, hero image fades in on top
  const hasColor = Boolean(extractedColor);
  const isImageReady = isHeroImageLoaded;
  const [isBlurReady, setIsBlurReady] = useState(false);

  // Delay blur appearance by 200ms after color is ready
  // This lets the solid color establish before blur animates in
  useEffect(() => {
    if (hasColor && useColorExtraction) {
      const timer = setTimeout(() => setIsBlurReady(true), 200);
      return () => clearTimeout(timer);
    }
    setIsBlurReady(false);
  }, [hasColor, useColorExtraction]);

  // Track scroll position of the modal's scroll container
  const { scrollY } = useScroll({
    container: scrollContainerRef ?? undefined,
  });

  // Listen to scroll changes and update state
  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show sticky header when scrolled past 70% of hero height
    const threshold = computedHeight * 0.7;
    setShowStickyHeader(latest > threshold);
  });

  // Parallax effect - hero moves at 50% of scroll speed
  const heroY = useTransform(
    scrollY,
    [0, computedHeight],
    [0, computedHeight * 0.5]
  );

  // Scale effect when pulling down (overscroll) - subtle scale up
  const heroScale = useTransform(
    scrollY,
    [-100, 0, computedHeight],
    [1.15, 1, 1]
  );

  // Hero opacity - subtle fade as scrolling past
  const heroOpacity = useTransform(
    scrollY,
    [0, computedHeight * 0.8],
    [1, 0.3]
  );

  // Fixed buttons opacity - fade as header appears
  const fixedButtonsOpacity = useTransform(
    scrollY,
    [computedHeight * 0.5, computedHeight * 0.8],
    [1, 0]
  );

  // Header animation values
  const headerOpacity = useTransform(
    scrollY,
    [computedHeight * 0.6, computedHeight * 0.8],
    [0, 1]
  );

  // Navigation button handler
  const handleClose = useCallback(() => {
    const isInModal = modalContext !== null;
    if (isInModal && modalContext) {
      modalContext.requestClose();
    } else if (fallbackHref) {
      router.push(fallbackHref);
    } else if (window.history.length > 1) {
      router.back();
    }
  }, [modalContext, router, fallbackHref]);

  const isInModal = modalContext !== null;
  const isDisabled = modalContext?.isClosing ?? false;

  // Default navigation button
  const defaultLeftAction = (
    <button
      onClick={handleClose}
      disabled={isDisabled}
      className="rounded-full bg-black/30 p-2 backdrop-blur-sm transition-colors hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent text-white"
    >
      {isInModal ? (
        <X className="h-5 w-5 text-white" />
      ) : (
        <ArrowLeft className="h-5 w-5 text-white" />
      )}
      <span className="sr-only">{isInModal ? "Close" : "Back"}</span>
    </button>
  );

  return (
    <div className={cn("relative min-h-full", className)}>
      {/* Hero section with parallax effect */}
      {/* Background color is always visible when extracted, only image/blur animate in */}
      <div
        ref={heroContainerRef}
        className="relative overflow-hidden"
        style={{
          height: computedHeight,
          backgroundColor: extractedColor ?? undefined,
        }}
      >
        {/* Parallax background image - fades in with Ken Burns effect */}
        {/* 1s delay after blur ready, 2s fade in with subtle zoom */}
        <motion.div
          className="absolute inset-0 w-full overflow-hidden"
          style={{
            y: heroY,
            opacity: heroOpacity,
            visibility: isBlurReady && isImageReady ? "visible" : "hidden",
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isBlurReady && isImageReady ? 1 : 0,
          }}
          transition={{
            duration: 2,
            delay: 1,
            ease: [0.22, 1, 0.36, 1], // Apple ease-out
          }}
        >
          {/* Ken Burns effect - dramatic slow zoom out from 1.25x to 1x */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.25 }}
            animate={{
              scale: isBlurReady && isImageReady ? 1 : 1.25,
            }}
            transition={{
              duration: 10,
              delay: 1,
              ease: "easeOut",
            }}
          >
            <Image
              src={heroImage}
              alt={heroAlt}
              fill
              priority
              onLoad={() => setIsHeroImageLoaded(true)}
              className={cn(
                "object-cover object-top",
                heroBlur && "blur-[4px] scale-110"
              )}
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </motion.div>
          {/* Bottom gradient for text readability - minimal gradient, blur does the heavy lifting */}
          {showGradient && !useColorExtraction && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, transparent 60%)",
              }}
            />
          )}
        </motion.div>

        {/* Hero overlay content - positioned over the hero image */}
        {heroOverlay && (
          <div className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none">
            <div className="pointer-events-auto">{heroOverlay}</div>
          </div>
        )}
      </div>

      {/* Progressive blur - extends from hero through entire solid color area */}
      {/* Always in DOM to prevent layout shift, opacity controlled by isBlurReady */}
      {heroExtendedContent && useColorExtraction && (
        <motion.div
          className="relative -mt-[200px] h-[400px] overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isBlurReady ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/*
            Simplified Gradient Blur (SwiftUI Style):
            Single strong blur layer with a gradient mask that keeps the top sharp
            and transitions to full blur at the bottom.
          */}
          {/* Blur mask: stays transparent longer at top (25%) to show more image */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              mask: "linear-gradient(to bottom, transparent 25%, black 60%, black 100%)",
              WebkitMask:
                "linear-gradient(to bottom, transparent 25%, black 60%, black 100%)",
            }}
          />

          {/* Color overlay that blends into the extracted color */}
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{
              background: extractedColor
                ? `linear-gradient(to bottom, transparent 10%, ${extractedColor} 50%)`
                : undefined,
            }}
          />
        </motion.div>
      )}

      {/* Extended color area below hero - Apple TV style */}
      {heroExtendedContent && (
        <div
          className={cn(
            "relative",
            useColorExtraction && "-mt-[200px]"
          )}
          style={{
            backgroundColor: extractedColor ?? undefined,
          }}
        >
          {/* Soft dark overlay for text contrast on bright colors */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 100px, rgba(0,0,0,0.4) 200px, rgba(0,0,0,0.6) 100%)",
            }}
          />
          {/* Content with staggered reveal animation - waits for blur */}
          <motion.div
            className="relative z-20 text-white"
            variants={extendedContentRevealVariants}
            initial={useColorExtraction ? "hidden" : "visible"}
            animate={isBlurReady || !useColorExtraction ? "visible" : "hidden"}
          >
            {heroExtendedContent}
          </motion.div>
        </div>
      )}

      {/* Fixed action buttons - always visible over hero, fade out when header appears */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center pointer-events-none xl:absolute"
        style={{ opacity: fixedButtonsOpacity }}
        aria-hidden={showStickyHeader}
      >
        <div className="w-10 shrink-0 flex items-center justify-center pointer-events-auto">
          {leftAction ?? defaultLeftAction}
        </div>
        <div className="flex-1 min-w-0 flex justify-center pointer-events-auto">
          {centerAction}
        </div>
        <div className="w-10 shrink-0 flex items-center justify-center pointer-events-auto">
          {rightAction}
        </div>
      </motion.div>

      {/* Fixed header - appears when scrolled past hero */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800",
          "xl:absolute xl:max-w-3xl xl:mx-auto xl:left-0 xl:right-[70px]"
        )}
        style={{
          opacity: headerOpacity,
          pointerEvents: showStickyHeader ? "auto" : "none",
        }}
        aria-hidden={!showStickyHeader}
      >
        <div className="flex items-center px-4 py-3">
          <div className="w-10 shrink-0 flex items-center justify-center">
            {leftAction ?? (
              <button
                onClick={handleClose}
                disabled={isDisabled}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isInModal ? (
                  <X className="h-5 w-5" />
                ) : (
                  <ArrowLeft className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
          <div className="flex-1 min-w-0 text-center">
            <h2 className="font-semibold text-sm truncate">{title}</h2>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
          <div className="w-10 shrink-0 flex items-center justify-center">
            {rightAction}
          </div>
        </div>
      </motion.header>

      {/* Content area */}
      <div className="relative z-10 bg-white dark:bg-black">{children}</div>
    </div>
  );
}

/**
 * ParallaxHeroContent - Helper component for content within ParallaxHeroLayout
 * Provides consistent padding and spacing
 */
export function ParallaxHeroContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-4 py-3 md:px-6 md:py-4", className)}>{children}</div>
  );
}
