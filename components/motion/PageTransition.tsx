"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { EASE } from "@/lib/motion";
import { scrollTo } from "./SmoothScroll";

/**
 * Makes navigation feel like one continuous surface.
 *
 * The first paint deliberately skips the entrance: Framer Motion serialises
 * `initial` values into the SSR markup, so animating from `opacity: 0` on load
 * would ship an invisible page and hand the LCP to hydration. Only subsequent
 * route changes animate.
 *
 * The flag lives at module scope rather than in a ref because it must be read
 * during render, and it is only ever written from an effect — which never runs
 * on the server, so server output always takes the no-animation branch.
 */
let hasHydrated = false;

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const animate = hasHydrated;
  const isInitialPath = useRef(true);

  useEffect(() => {
    hasHydrated = true;
  }, []);

  // Lenis owns the scroll position, so reset it ourselves on navigation.
  useEffect(() => {
    if (isInitialPath.current) {
      isInitialPath.current = false;
      return;
    }
    scrollTo(0, true);
  }, [pathname]);

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={animate ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
