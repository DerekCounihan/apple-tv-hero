/**
 * Animation timing constants for the Apple TV-style parallax hero effect.
 * Centralized here for easy customization and consistency.
 */
export const ANIMATION_TIMINGS = {
  /** Phase 1: Color extraction (instant) */
  COLOR_DELAY: 0,

  /** Phase 2: Blur overlay fades in after color established */
  BLUR_DELAY: 200,
  BLUR_DURATION: 300,

  /** Phase 3: Hero image fades in with Ken Burns effect */
  IMAGE_DELAY: 1000,
  IMAGE_DURATION: 2000,

  /** Ken Burns zoom animation duration (subtle slow zoom out) */
  KEN_BURNS_DURATION: 10000,

  /** Phase 4: Extended content slides up */
  CONTENT_DELAY: 400,
  CONTENT_DURATION: 500,

  /** Phase 5: Title animates in */
  TITLE_DELAY: 2.5,

  /** Phase 6: Description fades in slightly after title */
  DESCRIPTION_DELAY: 2.7,

  /** Action button animation delay */
  BUTTON_DELAY: 2.6,
} as const;

/**
 * Parallax effect constants
 */
export const PARALLAX = {
  /** Hero moves at this ratio of scroll speed (0.5 = 50%) */
  SCROLL_SPEED_RATIO: 0.5,

  /** Scale when pulling down past top (overscroll) */
  OVERSCROLL_SCALE_MAX: 1.15,

  /** Ken Burns initial scale (zooms out from this to 1) */
  KEN_BURNS_INITIAL_SCALE: 1.25,

  /** Threshold for sticky header (percentage of hero height) */
  STICKY_HEADER_THRESHOLD: 0.7,

  /** Hero opacity fade threshold */
  HERO_OPACITY_THRESHOLD: 0.8,

  /** Fixed buttons opacity threshold start */
  FIXED_BUTTONS_OPACITY_START: 0.5,

  /** Fixed buttons opacity threshold end */
  FIXED_BUTTONS_OPACITY_END: 0.8,
} as const;

/**
 * Layout constants
 */
export const LAYOUT = {
  /** Default hero height in pixels */
  DEFAULT_HERO_HEIGHT: 320,

  /** Color sample canvas size for extraction */
  COLOR_SAMPLE_SIZE: 50,

  /** Image cache size limit (LRU eviction) */
  IMAGE_COLOR_CACHE_SIZE: 100,

  /** Image load timeout in milliseconds */
  IMAGE_LOAD_TIMEOUT: 10000,
} as const;

/**
 * Reduced motion animation alternatives.
 * When user prefers reduced motion, use these simpler values.
 */
export const REDUCED_MOTION = {
  /** Fade duration for reduced motion (no transforms) */
  FADE_DURATION: 200,

  /** Skip Ken Burns effect entirely */
  SKIP_KEN_BURNS: true,

  /** Skip parallax scroll effect */
  SKIP_PARALLAX: true,

  /** Simple fade for content reveal */
  CONTENT_FADE_DURATION: 300,
} as const;
