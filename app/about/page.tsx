import type { Metadata } from "next";
import Link from "next/link";
import { MagneticDots } from "@/components/graphics/MagneticDots";
import { PlatformOrbit } from "@/components/graphics/PlatformOrbit";
import { IconLicense, IconWind } from "@/components/graphics/Icons";
import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/shared/CtaBand";
import { PageHeader } from "@/components/shared/PageHeader";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { company, founders } from "@/lib/site";

const TITLE = "About Recharga Chargine — deep-tech clean energy, Jaipur";
const DESCRIPTION =
  "Recharga Chargine Pvt. Ltd. is a DPIIT-recognised deep-tech clean-energy company in Jaipur, India, developing the RADAX generator architecture and licensing it to manufacturers.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/about",
  keywords: [
    "Recharga Chargine",
    "Recharga Chargine Pvt Ltd",
    "about Recharga Chargine",
    "deep tech clean energy startup India",
    "DPIIT recognised startup",
    "generator technology licensing",
  ],
});

const FACTS = [
  { term: "Recognition", detail: "DPIIT-recognised, Startup India" },
  { term: "Based in", detail: "Jaipur, Rajasthan, India" },
  { term: "Sector", detail: "Deep-tech clean energy" },
  { term: "Model", detail: "Technology licensing" },
];

export default function AboutPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            graph([
              webPageSchema({
                path: "/about",
                name: TITLE,
                description: DESCRIPTION,
              }),
              breadcrumbSchema(trail),
            ]),
          ),
        }}
      />

      <PageHeader
        eyebrow="About Recharga Chargine"
        title={
          <>
            The{" "}
            <span className="text-gradient-brand">unglamorous part</span> of the
            energy transition.
          </>
        }
        lede="Everything on a wind turbine got better except the machine that actually makes the electricity. That's the part we work on."
        trail={trail}
      />

      {/* ---------------- Mission ---------------- */}
      <section aria-labelledby="mission-heading" className="section">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
            <div>
              <Reveal>
                <p className="eyebrow">Mission</p>
              </Reveal>
              <RevealWords
                as="h2"
                id="mission-heading"
                text="Make the machine at the centre better."
                className="display-2 mt-6 text-ink"
                delay={0.05}
              />
            </div>

            <div className="prose-body max-w-xl">
              <Reveal delay={0.08}>
                <p>
                  Wind became one of the cheapest sources of electricity ever
                  built through relentless engineering on almost every part of
                  the turbine. The generator was the exception — still, in most
                  machines, a variation on topologies settled decades ago.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p>
                  As turbines grow, that inheritance bites:{" "}
                  <strong>
                    the generator gets heavier, costlier and more complex with
                    every megawatt added.
                  </strong>
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <p>
                  Recharga Chargine exists to change that one thing — and then
                  put the work into the hands of the people who manufacture at
                  scale.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Platform orbit ---------------- */}
      <section
        aria-labelledby="platform-heading"
        className="relative section border-y border-hairline bg-abyss"
      >
        <MagneticDots
          className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
          spacing={42}
        />
        <div className="shell relative">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1fr] lg:items-center lg:gap-20">
            <div>
              <Reveal>
                <p className="eyebrow">The platform</p>
              </Reveal>
              <RevealWords
                as="h2"
                id="platform-heading"
                text="Wind first. The physics goes further."
                className="display-2 mt-6 text-ink"
                delay={0.05}
              />
              <Reveal delay={0.1}>
                <p className="lede mt-7">
                  RADAX is a generator architecture, not a single machine. The
                  problem it addresses — turning slow, powerful rotation into
                  electricity — shows up in more than one industry.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-3">
                  Explore the orbits →
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.08} y={30}>
              <PlatformOrbit />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Licensing rationale ---------------- */}
      <section aria-labelledby="approach-heading" className="section">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
            <div>
              <Reveal>
                <p className="eyebrow">Our approach</p>
              </Reveal>
              <RevealWords
                as="h2"
                id="approach-heading"
                text="Licensed, not locked in a lab."
                className="display-2 mt-6 text-ink"
                delay={0.05}
              />
              <Reveal delay={0.12}>
                <div className="mt-9 flex items-start gap-4 rounded-2xl border border-hairline bg-surface-1 p-6">
                  <IconLicense className="mt-0.5 h-5 w-5 flex-none text-brand" />
                  <p className="text-sm leading-relaxed text-ink-2">
                    Licensing means a good idea can reach many turbines from
                    many manufacturers — instead of one product line from one
                    new entrant.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="prose-body max-w-xl">
              <Reveal delay={0.08}>
                <p>
                  There are two ways to get new generator technology into the
                  world. Spend a decade becoming a turbine manufacturer and
                  compete with companies forty years ahead of you — or do the
                  hard core-engineering exceptionally well and license it to
                  them.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p>
                  We chose the second. It reaches real wind farms faster, and it
                  sets a high bar: an architecture only gets licensed if it is
                  genuinely better for the engineer evaluating it.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Company facts ---------------- */}
      <section
        aria-labelledby="company-heading"
        className="section border-t border-hairline bg-abyss"
      >
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <Reveal>
                <p className="eyebrow">The company</p>
              </Reveal>
              <RevealWords
                as="h2"
                id="company-heading"
                text="Recognised, registered, and building."
                className="display-2 mt-6 max-w-xl text-ink"
                delay={0.05}
              />
            </div>
            <Reveal delay={0.1}>
              <IconWind className="h-10 w-10 text-brand/60" />
            </Reveal>
          </div>

          <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((fact, i) => (
              <Reveal key={fact.term} delay={i * 0.06} y={18}>
                <div className="h-full bg-surface-1 p-6">
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-3">
                    {fact.term}
                  </dt>
                  <dd className="mt-2.5 text-[0.9375rem] leading-snug text-ink">
                    {fact.detail}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={0.14}>
            <p className="mt-10 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-2">
              {company.legalName} was founded by{" "}
              <Link href={`/team/${founders[0].slug}`} className="link-draw text-brand">
                {founders[0].name}
              </Link>{" "}
              and{" "}
              <Link href={`/team/${founders[1].slug}`} className="link-draw text-brand">
                {founders[1].name}
              </Link>
              . We&rsquo;re early, and we say so plainly — what we publish
              describes the architecture we&rsquo;re building, not validated
              results for a finished machine.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
