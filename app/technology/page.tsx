import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureVisual } from "@/components/graphics/ArchitectureVisual";
import { FluxExplorer } from "@/components/graphics/FluxExplorer";
import { LicensingFlow } from "@/components/graphics/LicensingFlow";
import { MagneticDots } from "@/components/graphics/MagneticDots";
import { ScaleWall } from "@/components/graphics/ScaleWall";
import {
  IconDirectDrive,
  IconHybridFlux,
  IconMagnet,
  IconModular,
} from "@/components/graphics/Icons";
import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/shared/CtaBand";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  breadcrumbSchema,
  graph,
  productSchema,
  webPageSchema,
} from "@/lib/schema";
import { jsonLd, pageMetadata } from "@/lib/seo";

const TITLE = "RADAX Generator — hybrid axial-radial flux architecture";
const DESCRIPTION =
  "RADAX is a hybrid axial-radial flux, direct-drive, permanent-magnet generator architecture from Recharga Chargine, licensed to manufacturers. Wind turbines first.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/technology",
  keywords: [
    "RADAX Generator",
    "axial radial flux generator",
    "hybrid flux generator",
    "direct drive generator",
    "permanent magnet direct drive",
    "wind turbine generator technology",
    "generator technology licensing",
  ],
});

const PRINCIPLES = [
  {
    Icon: IconHybridFlux,
    term: "Hybrid axial–radial flux",
    body: "Both flux paths in one machine, so more of the volume inside the envelope does useful magnetic work.",
  },
  {
    Icon: IconDirectDrive,
    term: "Direct-drive",
    body: "No gearbox between rotor and generator. One less serviceable assembly at the top of the tower.",
  },
  {
    Icon: IconMagnet,
    term: "Permanent-magnet",
    body: "No excitation losses, no slip rings — the established route to efficiency in low-speed machines.",
  },
  {
    Icon: IconModular,
    term: "Modular",
    body: "Built from repeating segments, so the architecture scales across ratings instead of being redesigned each time.",
  },
];

export default function TechnologyPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Technology", path: "/technology" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            graph([
              webPageSchema({
                path: "/technology",
                name: TITLE,
                description: DESCRIPTION,
              }),
              productSchema(),
              breadcrumbSchema(trail),
            ]),
          ),
        }}
      />

      <PageHeader
        eyebrow="The RADAX Generator"
        title={
          <>
            A generator architecture,{" "}
            <span className="text-gradient-brand">not a product</span>.
          </>
        }
        lede="Hybrid axial–radial flux. Direct-drive. Permanent-magnet. Modular. Licensed to the manufacturers who build the machines — wind turbines first."
        trail={trail}
      />

      {/* ---------------- The scaling problem ---------------- */}
      <section aria-labelledby="problem-heading" className="section">
        <div className="shell">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal>
                <p className="eyebrow">The problem</p>
              </Reveal>
              <RevealWords
                as="h2"
                id="problem-heading"
                text="Bigger machines, worse maths."
                className="display-2 mt-6 text-ink"
                delay={0.05}
              />
              <Reveal delay={0.1}>
                <p className="lede mt-7 max-w-lg">
                  Blades got longer. Towers got taller. The generator underneath
                  them barely moved — and it now gets heavier and costlier with
                  every megawatt.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.08} y={30}>
              <ScaleWall />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Interactive flux explorer ---------------- */}
      <section
        aria-labelledby="flux-heading"
        className="relative section border-y border-hairline bg-abyss"
      >
        <MagneticDots
          className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
          spacing={40}
        />
        <div className="shell relative">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1fr] lg:gap-20">
            <div>
              <Reveal>
                <p className="eyebrow">Flux paths</p>
              </Reveal>
              <RevealWords
                as="h2"
                id="flux-heading"
                text="Three ways to cross an air gap."
                className="display-2 mt-6 text-ink"
                delay={0.05}
              />
              <Reveal delay={0.1}>
                <p className="lede mt-7">
                  A generator makes electricity by moving flux across the gap
                  between rotor and stator. Which direction it travels, relative
                  to the shaft, defines the whole machine.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-3">
                  Pick a topology →
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.08} y={30}>
              <FluxExplorer />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- The architecture ---------------- */}
      <section aria-labelledby="architecture-heading" className="section">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
            <div>
              <Reveal>
                <p className="eyebrow">The architecture</p>
              </Reveal>
              <RevealWords
                as="h2"
                id="architecture-heading"
                text="What RADAX is"
                className="display-2 mt-6 text-ink"
                delay={0.05}
              />

              <dl className="mt-10 space-y-px">
                {PRINCIPLES.map(({ Icon, term, body }, i) => (
                  <Reveal key={term} delay={0.06 + i * 0.05} y={16}>
                    <div className="flex gap-5 border-t border-hairline py-6 last:border-b">
                      <Icon className="mt-0.5 h-5 w-5 flex-none text-brand" />
                      <div>
                        <dt className="font-display text-base font-medium text-ink">
                          {term}
                        </dt>
                        <dd className="mt-1.5 text-sm leading-relaxed text-ink-2">
                          {body}
                        </dd>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>

            <Reveal delay={0.08} y={32}>
              <figure className="relative">
                <div
                  aria-hidden="true"
                  className="glow-brand absolute inset-10 -z-10 opacity-70"
                />
                <ArchitectureVisual className="w-full" />
                <figcaption className="mt-4 text-center text-xs leading-relaxed text-ink-3">
                  Conceptual representation of the RADAX flux paths. Not a
                  render of a manufactured machine.
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <p className="mt-16 max-w-2xl border-l border-brand/40 pl-6 text-[0.9375rem] leading-relaxed text-ink-2">
              RADAX is in active development. This page describes the
              architecture and the intent behind it — not validated results.
              We&rsquo;d rather say nothing than say something we can&rsquo;t
              yet stand behind.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Licensing ---------------- */}
      <section
        aria-labelledby="licensing-heading"
        className="section border-t border-hairline bg-abyss"
      >
        <div className="shell">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow">The model</p>
            </Reveal>
            <RevealWords
              as="h2"
              id="licensing-heading"
              text="We don't build turbines. We build what goes inside them."
              className="display-2 mt-6 text-ink"
              delay={0.05}
            />
            <Reveal delay={0.1}>
              <p className="lede mt-7">
                Manufacturers already know how to build at scale. What takes
                years is the core generator development underneath. That&rsquo;s
                the part we do.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.08} y={26}>
            <LicensingFlow className="mt-14" />
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-12 text-[0.9375rem] text-ink-2">
              Want the engineering conversation rather than the summary?{" "}
              <Link href="/contact" className="link-draw text-brand">
                Talk to our team
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        heading="Licensing RADAX starts with a technical conversation."
        body="We work directly with engineering teams. Tell us about your platform and we'll tell you honestly whether the architecture fits it."
      />
    </>
  );
}
