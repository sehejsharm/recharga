"use client";

import { useSyncExternalStore } from "react";

/**
 * Browser-state hooks built on useSyncExternalStore.
 *
 * These read genuinely external state (scroll position, media queries), so
 * subscribing is the correct primitive — an effect that calls setState would
 * cause a cascading render on every mount and fight concurrent rendering.
 * Each returns a stable server snapshot so SSR and hydration agree.
 */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolled(threshold = 24) {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

function subscribeEnvironment(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION);
  media.addEventListener("change", onChange);
  window.addEventListener("resize", onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("resize", onChange);
  };
}

/**
 * Whether to run the pinned, scroll-scrubbed treatment of a section.
 *
 * False when the visitor asked for reduced motion, and false on viewports too
 * short to pin a full-height scene without trapping the reader. Also false on
 * the server, so the plain stacked layout is what ships in the HTML.
 */
export function useCinematic(minViewportHeight = 620) {
  return useSyncExternalStore(
    subscribeEnvironment,
    () =>
      !window.matchMedia(REDUCED_MOTION).matches &&
      window.innerHeight >= minViewportHeight,
    () => false,
  );
}
