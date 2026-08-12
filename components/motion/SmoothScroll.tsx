"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenisInstance: Lenis | null = null;

/** Scroll helper that routes through Lenis when it is running. */
export function scrollTo(target: number | string, immediate = false) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { immediate });
    return;
  }
  if (typeof window === "undefined") return;
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
  } else {
    document
      .querySelector(target)
      ?.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  }
}

/**
 * Wires Lenis into GSAP's ticker so smooth scroll and ScrollTrigger share a
 * single clock. This is the detail that makes the whole page feel weighted.
 *
 * Under `prefers-reduced-motion` Lenis never starts and the browser's native
 * scrolling is left completely alone.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.25,
      // expo-out: fast pickup, long glide
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.7,
      wheelMultiplier: 1,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
