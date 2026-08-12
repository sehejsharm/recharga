import Link from "next/link";
import { ArchitectureVisual } from "@/components/graphics/ArchitectureVisual";
import { IconArrowRight } from "@/components/graphics/Icons";
import { Reveal, RevealWords } from "@/components/motion/Reveal";

export function TechTeaser() {
  return (
    <section
      aria-labelledby="tech-teaser-heading"
      className="section relative border-t border-hairline"
    >
      <div className="shell">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow">The architecture</p>
            </Reveal>

            <RevealWords
              as="h2"
              text="Two flux paths. One direct-drive machine."
              className="display-2 mt-6 max-w-lg text-ink"
              delay={0.05}
            />

            <Reveal delay={0.1}>
              <p className="lede mt-7 max-w-xl">
                Conventional generators pick a side: flux crosses the air gap
                either radially or axially. RADAX is built to use both — a
                hybrid topology aimed at getting more torque out of the same
                envelope, in a direct-drive form with no gearbox in the way.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <ul className="mt-9 space-y-3.5">
                {[
                  "Hybrid axial–radial flux topology",
                  "Direct-drive, permanent-magnet excitation",
                  "Modular structure intended to scale across a range",
                  "Engineered for multi-megawatt, 3 MW-class turbines",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3.5 text-[0.9375rem] text-ink-2">
                    <span
                      aria-hidden="true"
                      className="mt-[0.5em] h-1 w-1 flex-none bg-brand"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.22}>
              <Link
                href="/technology"
                className="link-draw mt-10 inline-flex font-display text-lg text-ink"
              >
                Explore the technology
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.08} y={32}>
            <figure className="relative">
              <div
                aria-hidden="true"
                className="glow-brand absolute inset-8 -z-10 opacity-60"
              />
              <ArchitectureVisual className="w-full" />
              <figcaption className="mt-4 text-center text-xs leading-relaxed text-ink-3">
                Conceptual representation of the RADAX flux paths. Illustrative
                only — not a depiction of a manufactured machine.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
