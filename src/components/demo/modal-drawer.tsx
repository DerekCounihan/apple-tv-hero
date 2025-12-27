"use client";

import { useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ModalContext } from "@/components/parallax-hero/modal-context";

interface ModalDrawerProps {
  children: React.ReactNode;
  /** Whether the modal is open */
  isOpen?: boolean;
}

/**
 * ModalDrawer - Wrapper for modal content with scroll context
 *
 * Features:
 * - Provides ModalContext with scrollContainerRef
 * - Handles close navigation via router.back()
 * - Animated backdrop and drawer
 * - Full-screen mobile drawer pattern
 */
export function ModalDrawer({ children, isOpen = true }: ModalDrawerProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const requestClose = useCallback(() => {
    setIsClosing(true);
    router.back();
  }, [router]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={requestClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className="fixed inset-x-0 bottom-0 z-50 h-[95vh] overflow-hidden rounded-t-3xl bg-black"
          >
            <ModalContext.Provider
              value={{
                scrollContainerRef,
                requestClose,
                isClosing,
              }}
            >
              <div
                ref={scrollContainerRef}
                className="h-full overflow-y-auto overscroll-contain"
              >
                {children}
              </div>
            </ModalContext.Provider>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
