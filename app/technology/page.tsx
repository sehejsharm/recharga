import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureVisual } from "@/components/graphics/ArchitectureVisual";
import {
  DIAGRAM_COPY,
  FluxDiagram,
} from "@/components/graphics/FluxDiagram";
import {
  IconDirectDrive,
  IconHybridFlux,
  IconLicense,
  IconMagnet,
  IconModular,
  IconWind,
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

const TITLE = "RADAX Generator — Hybrid Axial-Radial Flux Wind Generator";
const DESCRIPTION =
  "The RADAX Generator is a hybrid axial-radial flux, direct-drive, permanent-magnet architecture for multi-megawatt wind turbines, licensed to OEMs by Recharga Chargine.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/technology",
  keywords: [
    "RADAX Generator",
    "axial radial flux generator",
    "hybrid flux generator",
    "direct drive wind generator",
    "permanent magnet direct drive",
    "wind turbine generator technology",
    "wind energy IP licensing",
  ],
});

const CHALLENGES = [
  {
    Icon: IconWind,
    title: "Torque, not speed",
    body: "A direct-drive wind generator turns slowly — a handful of revolutions per minute. Producing multi-megawatt output at that speed means producing enormous torque, and torque is what drives the size of the machine.",
  },
  {
    Icon: IconMagnet,
    title: "Active material is the cost floor",
    body: "Permanent-magnet machines depend on rare-earth material and copper. How much of it a topology needs, for a given torque, sits underneath every cost conversation in the sector.",
  },
  {
    Icon: IconDirectDrive,
    title: "Removing the gearbox moves the problem",
    body: "Gearboxes are a well-known maintenance burden, especially offshore. Taking one out improves reliability, but hands the generator a much harder job — and usually a much bigger, heavier body.",
  },
];

const PRINCIPLES = [
  {
    Icon: IconHybridFlux,
    term: "Hybrid axial–radial flux",
    body: "Rather than committing to one flux orientation, RADAX is designed to work both paths in a single machine, so that more of the volume inside the envelope is doing useful magnetic work.",
  },
  {
    Icon: IconDirectDrive,
    term: "Direct-drive",
    body: "No gearbox between the rotor and the generator. Fewer rotating parts in the drivetrain, and one less serviceable assembly at the top of the tower.",
  },
  {
    Icon: IconMagnet,
    term: "Permanent-magnet excitation",
    body: "No excitation losses, no slip rings, no separate field supply — the established route to high efficiency in low-speed machines.",
  },
  {
    Icon: IconModular,
    term: "Modular by construction",
    body: "Built from repeating segments rather than one monolithic body, with the intent that the architecture scales across a product range instead of being redesigned for each rating.",
  },
];

const LICENSING = [
  {
    step: "01",
    title: "Evaluate",
    body: "We work with an OEM's engineering team to assess how the architecture maps onto their platform, their supply chain and their production reality.",
  },
  {
    step: "02",
    title: "License",
    body: "The architecture is licensed — the manufacturer keeps their product, their brand and their customer relationships. What they skip is the years of core generator R&D.",
  },
  {
    step: "03",
    title: "Build",
    body: "We support integration into their design and manufacturing process, so the technology lands in real turbines rather than in a report.",
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
            The generator is where wind energy&rsquo;s next{" "}
            <span className="text-gradient-brand">cost reduction</span> is
            hiding.
          </>
        }
        lede="Blades got longer. Towers got taller. Control systems got smarter. The machine that actually converts rotation into electricity has changed far less — and it is now one of the binding constraints on the cost of wind power."
        trail={trail}
      />

      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="challenge-heading" className="section">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">The engineering problem</p>
          </Reveal>

          <RevealWords
            as="h2"
            text="Why multi-megawatt generators are hard"
            className="display-2 mt-6 max-w-2xl text-ink"
            delay={0.05}
          />

          <Reveal delay={0.1}>
            <p className="lede mt-7 max-w-2xl">
              Every megawatt added to a turbine makes the same three problems
              worse. None of them is a manufacturing failure — they are
              consequences of the topologies the industry standardised on
              decades ago.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
            {CHALLENGES.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.08} y={20}>
                <div className="h-full bg-surface-1 p-8">
                  <Icon className="h-6 w-6 text-brand" />
                  <h3 className="display-3 mt-6 text-ink">{title}</h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-2">
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section
        aria-labelledby="flux-heading"
        className="section border-t border-hairline bg-abyss"
      >
        <div className="shell">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow">Flux paths, explained</p>
            </Reveal>
            <RevealWords
              as="h2"
              id="flux-heading"
              text="Three ways to cross an air gap"
              className="display-2 mt-6 text-ink"
              delay={0.05}
            />
            <Reveal delay={0.1}>
              <p className="lede mt-7">
                A generator makes electricity by moving magnetic flux across the
                gap between rotor and stator. The direction that flux travels,
                relative to the shaft, defines the whole machine.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {(["radial", "axial", "hybrid"] as const).map((variant, i) => {
              const copy = DIAGRAM_COPY[variant];
              const isHybrid = variant === "hybrid";
              return (
                <Reveal key={variant} delay={i * 0.09} y={26}>
                  <article
                    className={`h-full rounded-2xl border p-7 transition-colors duration-500 ${
                      isHybrid
                        ? "border-brand/35 bg-surface-1"
                        : "border-hairline bg-surface-1/60"
                    }`}
                  >
                    <p
                      className={`font-mono text-[0.6875rem] uppercase tracking-[0.16em] ${
                        isHybrid ? "text-brand" : "text-ink-3"
                      }`}
                    >
                      {copy.label}
                    </p>

                    <div className="my-6 rounded-xl border border-hairline bg-abyss p-3">
                      <FluxDiagram variant={variant} className="w-full" />
                    </div>

                    <h3 className="display-3 text-ink">{copy.title}</h3>
                    <p className="mt-3.5 text-[0.9375rem] leading-relaxed text-ink-2">
                      {copy.body}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section
        aria-labelledby="architecture-heading"
        className="section border-t border-hairline"
      >
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
              <Reveal delay={0.1}>
                <p className="lede mt-7">
                  RADAX is a hybrid axial–radial flux, direct-drive,
                  permanent-magnet generator architecture engineered for
                  multi-megawatt wind turbines in the 3 MW class. It is designed
                  around four commitments.
                </p>
              </Reveal>

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
                  Conceptual representation of the RADAX flux paths, drawn to
                  explain the topology. It is not a render of a manufactured
                  machine and carries no dimensional information.
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <p className="mt-16 max-w-3xl border-l border-brand/40 pl-6 text-[0.9375rem] leading-relaxed text-ink-2">
              A note on what we publish: RADAX is in active development, and the
              detailed design work sits with our engineering team and the
              manufacturers we work with directly. This page describes the
              architecture and the intent behind it. It does not publish
              validated performance figures, and we would rather say nothing
              than say something we cannot yet stand behind.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section
        aria-labelledby="licensing-heading"
        className="section border-t border-hairline bg-abyss"
      >
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
            <div>
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
                  Recharga is an intellectual-property licensing business.
                  Turbine manufacturers already know how to build turbines at
                  scale; what takes years is the core generator development
                  underneath. That is the part we do.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <div className="mt-9 flex items-start gap-4 rounded-2xl border border-hairline bg-surface-1 p-6">
                  <IconLicense className="mt-0.5 h-5 w-5 flex-none text-brand" />
                  <p className="text-sm leading-relaxed text-ink-2">
                    The same generator platform is intended to extend beyond
                    wind over time — into hydro-electric generation and
                    hybrid-vehicle alternators, where the underlying problem of
                    low-speed, high-torque conversion is much the same.
                  </p>
                </div>
              </Reveal>
            </div>

            <ol className="space-y-px">
              {LICENSING.map((item, i) => (
                <Reveal key={item.step} delay={i * 0.08} y={18}>
                  <li className="flex gap-6 border-t border-hairline py-8 last:border-b">
                    <span className="font-mono text-sm text-brand">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="display-3 text-ink">{item.title}</h3>
                      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
                        {item.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal delay={0.1}>
            <p className="mt-14 text-[0.9375rem] text-ink-2">
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
        body="We work directly with OEM engineering teams. Tell us about your platform and we'll tell you honestly whether the architecture fits it."
      />
    </>
  );
}
