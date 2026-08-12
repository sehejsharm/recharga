"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Single IntersectionObserver driving every `[data-reveal]` /
 * `[data-reveal-words]` element on the page.
 *
 * One observer for the whole document rather than one per component, and the
 * elements themselves stay server-rendered. Marking an element visible is a
 * one-way door — we unobserve immediately so nothing re-animates on the way
 * back up.
 */
const SELECTOR = "[data-reveal]:not([data-visible]), [data-reveal-words]:not([data-visible])";

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!document.documentElement.classList.contains("motion-ok")) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        }
      },
      // Fire a little before the element is fully on screen.
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    const scan = () => {
      for (const el of document.querySelectorAll(SELECTOR)) observer.observe(el);
    };

    scan();

    // Catch anything that mounts after the first pass (route transitions,
    // late-hydrating client components).
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
