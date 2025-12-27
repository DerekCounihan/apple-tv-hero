"use client";

import { useEffect, useState } from "react";

interface ImageColorResult {
  color: string | null;
  isDark: boolean;
  isLoading: boolean;
  error: Error | null;
}

interface CachedColor {
  color: string;
  isDark: boolean;
}

// Module-level cache for extracted colors
// Key: image URL (normalized), Value: extracted color data
// This persists across component mounts, so colors extracted from thumbnails
// are instantly available when the detail page loads
const colorCache = new Map<string, CachedColor>();

/**
 * Normalizes an image URL for consistent cache keys.
 * Strips query params that don't affect the image content (like Next.js sizing).
 */
function normalizeImageUrl(url: string): string {
  try {
    const parsed = new URL(url, window.location.origin);
    // Keep the base path - Next.js image URLs have the original path
    // Remove sizing params like w=, q=, etc. that don't affect color
    parsed.searchParams.delete("w");
    parsed.searchParams.delete("q");
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Core color extraction logic - shared between hook and pre-warm function.
 * Returns the extracted color data or throws an error.
 */
function extractColorFromImage(img: HTMLImageElement): CachedColor {
  // Create a small canvas for sampling (performance optimization)
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Sample at a small size for better performance
  // Focus on the bottom portion of the image for the gradient effect
  const sampleWidth = 50;
  const sampleHeight = 50;
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;

  // Draw only the bottom third of the image (most relevant for gradient)
  const sourceY = img.height * 0.66;
  const sourceHeight = img.height * 0.34;

  ctx.drawImage(
    img,
    0,
    sourceY,
    img.width,
    sourceHeight,
    0,
    0,
    sampleWidth,
    sampleHeight
  );

  // Get pixel data
  const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
  const data = imageData.data;

  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  // Sample every 4th pixel for performance
  for (let i = 0; i < data.length; i += 16) {
    // Skip very dark or very light pixels (likely to be text/overlays)
    const pixelR = data[i];
    const pixelG = data[i + 1];
    const pixelB = data[i + 2];
    const brightness = (pixelR + pixelG + pixelB) / 3;

    if (brightness > 20 && brightness < 235) {
      r += pixelR;
      g += pixelG;
      b += pixelB;
      count++;
    }
  }

  if (count > 0) {
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
  } else {
    // Fallback to simple average if filtering excluded all pixels
    count = 0;
    for (let i = 0; i < data.length; i += 16) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
  }

  // Calculate relative luminance to determine if color is dark
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return {
    color: `rgb(${r}, ${g}, ${b})`,
    isDark: luminance < 0.5,
  };
}

/**
 * Pre-warms the color cache for an image URL.
 * Call this when a thumbnail loads to ensure instant color on detail page.
 *
 * This is a fire-and-forget function - it extracts the color in the background
 * and populates the cache. No need to await or handle the result.
 *
 * @param imageUrl - The image URL to extract color from
 */
export function preWarmImageColor(imageUrl: string): void {
  if (!imageUrl) return;

  const cacheKey = normalizeImageUrl(imageUrl);

  // Already cached, nothing to do
  if (colorCache.has(cacheKey)) return;

  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = () => {
    try {
      const result = extractColorFromImage(img);
      colorCache.set(cacheKey, result);
    } catch {
      // Silently fail - this is just a pre-warm optimization
    }
  };

  img.src = imageUrl;
}

/**
 * Extracts the dominant/average color from an image URL
 * Uses canvas to sample pixels and calculate the average color
 *
 * This creates the Apple TV / Spotify style effect where the UI
 * adapts to the colors of the displayed artwork
 *
 * Features:
 * - Module-level cache: Colors extracted from thumbnails are instantly
 *   available when the detail page loads (same image URL)
 * - Pre-warm support: Call preWarmImageColor() when thumbnails load
 *   to eliminate color extraction delay on navigation
 */
export function useImageColor(imageUrl: string | null): ImageColorResult {
  // Initialize from cache if available - this makes the FIRST render already have the color
  // No flash of loading state when navigating from a page where we pre-warmed
  const cacheKey = imageUrl ? normalizeImageUrl(imageUrl) : null;
  const initialCached = cacheKey ? colorCache.get(cacheKey) : null;

  const [color, setColor] = useState<string | null>(initialCached?.color ?? null);
  const [isDark, setIsDark] = useState(initialCached?.isDark ?? true);
  const [isLoading, setIsLoading] = useState(!initialCached);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!imageUrl || !cacheKey) {
      setColor(null);
      setIsLoading(false);
      return;
    }

    // Check cache first - instant return if pre-warmed
    // IMPORTANT: If we already have the color from initial cache, don't re-extract
    // This prevents color shifting when the same image is loaded at different sizes
    const cached = colorCache.get(cacheKey);
    if (cached) {
      // Only update if different from current state (avoids unnecessary re-renders)
      setColor((prev) => prev !== cached.color ? cached.color : prev);
      setIsDark(cached.isDark);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        // Double-check cache before extracting (in case another component cached it)
        const nowCached = colorCache.get(cacheKey);
        if (nowCached) {
          setColor(nowCached.color);
          setIsDark(nowCached.isDark);
          setIsLoading(false);
          return;
        }

        const result = extractColorFromImage(img);

        // Cache for future use
        colorCache.set(cacheKey, result);

        setColor(result.color);
        setIsDark(result.isDark);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to extract color")
        );
        setIsLoading(false);
      }
    };

    img.onerror = () => {
      setError(new Error("Failed to load image"));
      setIsLoading(false);
    };

    img.src = imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, cacheKey]);

  return { color, isDark, isLoading, error };
}
