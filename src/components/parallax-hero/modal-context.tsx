"use client";

import type { RefObject } from "react";
import { createContext, useContext } from "react";

interface ModalContextValue {
  /** Request the modal to close. The modal will handle navigation. */
  requestClose: () => void;
  /** Whether a close operation is in progress */
  isClosing: boolean;
  /** Reference to the scroll container for parallax effects */
  scrollContainerRef: RefObject<HTMLDivElement | null> | null;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModalContext() {
  return useContext(ModalContext);
}
