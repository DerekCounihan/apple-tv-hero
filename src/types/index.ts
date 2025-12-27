/**
 * Centralized type exports for apple-tv-hero components.
 * Import types from here for better discoverability.
 */

// Re-export component prop types
export type { ImageColorResult } from "@/components/parallax-hero/use-image-color";
export type { ModalContextType } from "@/components/parallax-hero/modal-context";

// Sample data types
export type { SampleItem } from "@/data/sample-items";

/**
 * Type guard to check if a value is a valid SampleItem
 */
export function isSampleItem(value: unknown): value is import("@/data/sample-items").SampleItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "title" in value &&
    "subtitle" in value &&
    "image" in value &&
    typeof (value as Record<string, unknown>).id === "string" &&
    typeof (value as Record<string, unknown>).title === "string"
  );
}

/**
 * Aspect ratio options for the ParallaxHeroLayout component
 */
export type AspectRatio = "auto" | "1/1" | "4/3" | "16/9" | "3/4";

/**
 * Button variant options
 */
export type ButtonVariant = "primary" | "secondary";

/**
 * Animation phase for debugging/monitoring
 */
export interface AnimationPhase {
  name: "color" | "blur" | "image" | "content" | "title" | "description";
  startTime: number;
  duration: number;
  completed: boolean;
}
