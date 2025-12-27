"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { ModalContext } from "@/components/parallax-hero/modal-context";

// Animation duration for Vaul drawer (matches Vaul's default)
const DRAWER_ANIMATION_DURATION = 300;

/**
 * Helper to find the main scrollable element in the app layout.
 * Returns null if not found (e.g., during direct navigation to this route).
 */
function findMainScrollable(): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    'main.overflow-y-auto, main[class*="overflow-y-auto"]'
  );
}

/**
 * Helper to clear any stale scroll locks that may have been left behind
 * by a previous drawer instance that didn't clean up properly.
 * This can happen during direct navigation (URL paste, refresh, external link).
 */
function clearStaleScrollLocks(): void {
  const mainScrollable = findMainScrollable();
  if (mainScrollable && mainScrollable.style.overflow === "hidden") {
    // Clear the inline overflow style - let CSS classes take over
    mainScrollable.style.overflow = "";
  }
}

interface ModalDrawerProps {
  children: React.ReactNode;
}

/**
 * ModalDrawer - A full-height drawer component for intercepted routes.
 *
 * Features:
 * - Opens at 100% viewport height for immersive content viewing
 * - On user close (swipe/X): Waits for animation, then navigates back
 * - On forward navigation (router.push): Closes immediately without back navigation
 * - Consistent design on mobile and desktop with max-width constraint on desktop
 * - Preserves background scroll position when opening/closing
 * - Handles edge cases: direct navigation, stale scroll locks from previous sessions
 */
export function ModalDrawer({ children }: ModalDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  // Track initial pathname to detect forward navigation
  const initialPathnameRef = useRef(pathname);
  // Track if we're closing due to user action (should call router.back)
  const isUserClosingRef = useRef(false);
  // Scroll container ref for parallax effects
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Store scroll position and scrollable element reference before drawer opens
  const savedScrollPositionRef = useRef(0);
  const mainScrollableRef = useRef<HTMLElement | null>(null);
  // Track the original overflow value to restore
  const originalOverflowRef = useRef<string>("");

  // Exposed via context for child components (like CloseButton) to request close
  const requestClose = useCallback(() => {
    if (!isUserClosingRef.current) {
      isUserClosingRef.current = true;
      setOpen(false);
    }
  }, []);

  // On mount: Clear any stale scroll locks from previous sessions
  // This handles the case where someone navigates directly to a URL and
  // a previous drawer instance didn't clean up properly
  useEffect(() => {
    clearStaleScrollLocks();
  }, []);

  // Keyboard support: ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !isUserClosingRef.current) {
        e.preventDefault();
        requestClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, requestClose]);

  // Preserve scroll position when drawer opens
  useLayoutEffect(() => {
    const mainScrollable = findMainScrollable();

    if (mainScrollable) {
      // Save the scrollable element and its current scroll position
      mainScrollableRef.current = mainScrollable;
      savedScrollPositionRef.current = mainScrollable.scrollTop;

      // Store original overflow style (could be "" or a CSS value)
      originalOverflowRef.current = mainScrollable.style.overflow;

      // Lock the main element's scroll to prevent any scroll jumping
      mainScrollable.style.overflow = "hidden";

      return () => {
        // Restore overflow and scroll position on unmount
        // Use empty string to clear inline style and let CSS classes take over
        mainScrollable.style.overflow = originalOverflowRef.current || "";
        mainScrollable.scrollTop = savedScrollPositionRef.current;
      };
    } else {
      // Fallback to window scroll (e.g., if main element doesn't exist)
      savedScrollPositionRef.current = window.scrollY;
      return () => {
        window.scrollTo(0, savedScrollPositionRef.current);
      };
    }
  }, []);

  // Detect forward navigation (pathname changed) and close drawer
  // Also explicitly clear scroll lock since useLayoutEffect cleanup may not fire reliably
  useEffect(() => {
    if (pathname !== initialPathnameRef.current && open) {
      // Forward navigation detected - close drawer without router.back()
      setOpen(false);

      // Explicitly clear the scroll lock on forward navigation
      // The useLayoutEffect cleanup may not fire reliably during Next.js soft navigation
      // so we need to manually restore the overflow style here
      if (mainScrollableRef.current) {
        mainScrollableRef.current.style.overflow = "";
      }
    }
  }, [pathname, open]);

  // Navigate back after drawer closes (with animation delay) and restore scroll
  useEffect(() => {
    if (!open && isUserClosingRef.current) {
      const timeoutId = setTimeout(() => {
        isUserClosingRef.current = false;
        // Restore scroll position before navigating back
        if (mainScrollableRef.current) {
          mainScrollableRef.current.scrollTop = savedScrollPositionRef.current;
        } else {
          window.scrollTo(0, savedScrollPositionRef.current);
        }
        router.back();
      }, DRAWER_ANIMATION_DURATION);

      return () => clearTimeout(timeoutId);
    }
  }, [open, router]);

  // Handle user-initiated close (swipe, clicking outside, or X button via context)
  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen && !isUserClosingRef.current) {
      isUserClosingRef.current = true;
      setOpen(false);
    }
  }, []);

  // Context value - memoized to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      requestClose,
      isClosing: !open && isUserClosingRef.current,
      scrollContainerRef,
    }),
    [requestClose, open]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      <Drawer
        open={open}
        onOpenChange={handleOpenChange}
        shouldScaleBackground={false}
        noBodyStyles
      >
        <DrawerContent
          className={cn(
            "mt-0 border-none bg-black",
            "h-[100dvh]",
            // Desktop: centered over main content area (between sidebars) with max-w-3xl (768px)
            // Left sidebar: 280px, Right sidebar: 350px, Container max: 1440px (90rem)
            // Main content center is 35px left of viewport center, use margin to offset without affecting transforms
            "xl:!left-0 xl:!right-[70px] xl:!mx-auto xl:!max-w-3xl",
            // Desktop: fixed position
            "xl:!fixed xl:!top-0 xl:!bottom-0 xl:rounded-none"
          )}
          showHandle={false}
          showCloseButton={false}
          // Prevent scroll jump when drawer closes by preventing autofocus on trigger
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DrawerTitle className="sr-only">Content Details</DrawerTitle>
          <DrawerDescription className="sr-only">
            View detailed content information
          </DrawerDescription>
          {/* Content container - scroll container for parallax effects */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto scrollbar-none"
          >
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    </ModalContext.Provider>
  );
}
