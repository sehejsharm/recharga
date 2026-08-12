"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IconEnergy, IconMass, IconScale } from "@/components/graphics/Icons";
import { useCinematic } from "@/components/motion/hooks";

/**
 * The pinned Problem → Solution scene (§5.1, §6).
 *
 * Progressive enhancement is the whole design here: both panels are ordinary
 * server-rendered markup stacked in normal flow. Only once JS confirms motion
 * is welcome do we switch to the overlaid, pinned layout and hand the section
 * to ScrollTrigger. Without JS — or with reduced motion — a reader gets both
 * panels in full, just without the cinema.
 */

const PROBLEM_POINTS = [
  {
    Icon: IconMass,
    title: "Mass climbs with every megawatt",
    body: "Scaling a conventional generator means more structure, more active material, and a machine that fights its own weight.",
  },
  {
    Icon: IconScale,
    title: "Complexity compounds",
    body: "Gearboxes add failure modes. Removing them shifts the burden onto a larger, heavier direct-drive machine instead.",
  },
  {
    Icon: IconEnergy,
    title: "The cost curve has stalled",
    body: "Blades and towers kept improving. The generator architecture underneath them largely did not.",
  },
];

export function ProblemSolution() {
  const rootRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  // Pinning a full-height scene costs more than it gives on short viewports,
  // and is simply wrong when the visitor asked for reduced motion.
  const cinematic = useCinematic();

  useEffect(() => {
    if (!cinematic) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=190%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      timeline
        .to(problemRef.current, { opacity: 0, y: -48, ease: "none" }, 0)
        .fromTo(
          solutionRef.current,
          { opacity: 0, y: 56 },
          { opacity: 1, y: 0, ease: "none" },
          0.15,
        )
        .fromTo(
          progressRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: "none" },
          0,
        );
    }, root);

    return () => ctx.revert();
  }, [cinematic]);

  const panelClass = cinematic
    ? "absolute inset-0 flex items-center"
    : "relative flex items-center";

  return (
    <section
      ref={rootRef}
      aria-labelledby="problem-heading"
      className={
        cinematic
          ? "relative h-[100svh] overflow-hidden"
          : "relative overflow-hidden"
      }
    >
      <div
        aria-hidden="true"
        className="glow-teal pointer-events-none absolute -left-40 top-1/4 h-[36rem] w-[36rem] opacity-50"
      />

      {cinematic && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-[var(--header-h)] z-10 h-px origin-left bg-brand"
          ref={progressRef}
          style={{ transform: "scaleX(0)" }}
        />
      )}

      {/* Panel 1 — the problem */}
      <div ref={problemRef} className={`${panelClass} section`}>
        <div className="shell w-full">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1fr] lg:gap-20">
            <div>
              <p className="eyebrow">The problem</p>
              <h2
                id="problem-heading"
                className="display-2 mt-6 max-w-xl text-ink"
              >
                Wind turbines got bigger. Their generators hit a wall.
              </h2>
            </div>

            <div>
              <p className="lede max-w-xl">
                The world is building bigger wind turbines than ever — but their
                generators are heavier, costlier and more complex with every
                megawatt. The cost of wind energy is stuck on a technology that
                hasn&rsquo;t fundamentally changed in decades.
              </p>

              <ul className="mt-10 space-y-px">
                {PROBLEM_POINTS.map(({ Icon, title, body }) => (
                  <li
                    key={title}
                    className="flex gap-5 border-t border-hairline py-6 last:border-b"
                  >
                    <Icon className="mt-0.5 h-5 w-5 flex-none text-ink-3" />
                    <div>
                      <h3 className="font-display text-base font-medium text-ink">
                        {title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Panel 2 — the solution */}
      <div
        ref={solutionRef}
        className={`${panelClass} section`}
        style={cinematic ? { opacity: 0 } : undefined}
      >
        <div className="shell w-full">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1fr] lg:gap-20">
            <div>
              <p className="eyebrow">The solution</p>
              <h2 className="display-2 mt-6 max-w-xl text-ink">
                RADAX rethinks the machine at its core.
              </h2>
            </div>

            <div>
              <p className="lede max-w-xl">
                By combining axial and radial magnetic flux in a single
                direct-drive generator, RADAX is engineered to do more with
                less — targeting higher power density and a better balance of
                weight, efficiency and cost. And it&rsquo;s modular, so it
                scales with the industry.
              </p>

              <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2">
                {[
                  {
                    term: "Two flux paths, one machine",
                    detail:
                      "Axial and radial working together, so more of the available volume does useful magnetic work.",
                  },
                  {
                    term: "Direct-drive by design",
                    detail:
                      "No gearbox in the path between rotor and grid — fewer moving parts to service offshore.",
                  },
                  {
                    term: "Modular structure",
                    detail:
                      "Built from repeatable segments, so the architecture scales across a product range.",
                  },
                  {
                    term: "Made to be licensed",
                    detail:
                      "Delivered as an architecture a manufacturer can adopt, not a black box they must buy.",
                  },
                ].map((item) => (
                  <div key={item.term} className="bg-surface-1 p-6">
                    <h3 className="font-display text-[0.9375rem] font-medium text-ink">
                      {item.term}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-2">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
