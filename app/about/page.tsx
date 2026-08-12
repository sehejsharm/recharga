import type { Metadata } from "next";
import Link from "next/link";
import {
  IconEnergy,
  IconLicense,
  IconScale,
  IconWind,
} from "@/components/graphics/Icons";
import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/shared/CtaBand";
import { PageHeader } from "@/components/shared/PageHeader";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { company, founders } from "@/lib/site";

const TITLE = "About Recharga — deep-tech clean energy from Jaipur, India";
const DESCRIPTION =
  "Recharga Chargine Pvt. Ltd. is a DPIIT-recognised deep-tech clean-energy company in Jaipur, India, developing the RADAX generator architecture and licensing it to wind turbine manufacturers.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/about",
  keywords: [
    "Recharga Chargine Pvt Ltd",
    "about Recharga",
    "deep tech clean energy startup India",
    "DPIIT recognised startup",
    "wind energy IP licensing",
    "Jaipur clean energy company",
  ],
});

const HORIZONS = [
  {
    Icon: IconWind,
    horizon: "Now",
    title: "Wind",
    body: "Multi-megawatt wind turbines are where the need is sharpest and the architecture is aimed first. RADAX is being developed for the 3 MW class and the direct-drive machines that sit at the top of those towers.",
  },
  {
    Icon: IconEnergy,
    horizon: "Next",
    title: "Hydro",
    body: "Hydro-electric generation poses a closely related problem: low speed, high torque, decades of service life. The same generator platform is intended to extend into it.",
  },
  {
    Icon: IconScale,
    horizon: "Beyond",
    title: "Hybrid-vehicle alternators",
    body: "At the other end of the size range, the same principles apply to compact, high-power-density machines — the long-term horizon for the platform.",
  },
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
        eyebrow="About Recharga"
        title={
          <>
            A deep-tech company working on the{" "}
            <span className="text-gradient-brand">unglamorous part</span> of the
            energy transition.
          </>
        }
        lede="Recharga Chargine Pvt. Ltd. is a DPIIT-recognised deep-tech clean-energy company based in Jaipur, Rajasthan. We develop generator architecture for renewable power — and license it to the manufacturers who build the machines."
        trail={trail}
      />

      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="mission-heading" className="section">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
            <div>
              <Reveal>
                <p className="eyebrow">Mission</p>
              </Reveal>
              <RevealWords
                as="h2"
                id="mission-heading"
                text="Make the machine at the centre of wind power better."
                className="display-2 mt-6 text-ink"
                delay={0.05}
              />
            </div>

            <div className="prose-body max-w-xl">
              <Reveal delay={0.08}>
                <p>
                  Wind energy has become one of the cheapest sources of
                  electricity ever built, and it got there through relentless
                  engineering on almost every part of the turbine. Blades grew
                  longer and lighter. Towers grew taller. Control systems learned
                  to squeeze more out of the same wind.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p>
                  The generator — the component that actually turns rotation
                  into electricity — has moved far less. It is still, in most
                  turbines, a variation on topologies that were settled decades
                  ago. And as turbines get larger, that inheritance is starting
                  to bite: <strong>the generator gets heavier, costlier and
                  more complex with every megawatt added.</strong>
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <p>
                  Recharga exists to change that specific thing. Not to build
                  turbines — the industry is already very good at that — but to
                  rethink the electrical machine inside them, and then put that
                  work into the hands of the people who manufacture at scale.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section
        aria-labelledby="approach-heading"
        className="section border-y border-hairline bg-abyss"
      >
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
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
              <Reveal delay={0.1}>
                <div className="mt-9 flex items-start gap-4 rounded-2xl border border-hairline bg-surface-1 p-6">
                  <IconLicense className="mt-0.5 h-5 w-5 flex-none text-brand" />
                  <p className="text-sm leading-relaxed text-ink-2">
                    A licensing model means a good idea can reach many turbines
                    from many manufacturers, instead of one product line from
                    one new entrant.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="prose-body max-w-xl">
              <Reveal delay={0.08}>
                <p>
                  There are two ways to get new generator technology into the
                  world. You can spend a decade becoming a turbine manufacturer
                  and compete with companies that have been doing it for forty
                  years. Or you can do the hard core-engineering work
                  exceptionally well and license it to them.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p>
                  We chose the second. It is the faster route to real turbines in
                  real wind farms, and it lines up incentives properly: our
                  partners keep their platforms, their brands and their customer
                  relationships, and skip years of core generator R&amp;D.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <p>
                  It also sets a high bar for us. An architecture only gets
                  licensed if it is genuinely better for the engineer evaluating
                  it — which is exactly the pressure a deep-tech company should
                  be under.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="platform-heading" className="section">
        <div className="shell">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow">The platform vision</p>
            </Reveal>
            <RevealWords
              as="h2"
              id="platform-heading"
              text="Wind first. The same physics goes further."
              className="display-2 mt-6 text-ink"
              delay={0.05}
            />
            <Reveal delay={0.1}>
              <p className="lede mt-7">
                RADAX is being developed for wind, but the problem it addresses —
                converting slow, powerful rotation into electricity efficiently —
                shows up in more than one industry.
              </p>
            </Reveal>
          </div>

          <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
            {HORIZONS.map(({ Icon, horizon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.08} y={20}>
                <li className="h-full bg-surface-1 p-8">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-brand" />
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-3">
                      {horizon}
                    </span>
                  </div>
                  <h3 className="display-3 mt-5 text-ink">{title}</h3>
                  <p className="mt-3.5 text-[0.9375rem] leading-relaxed text-ink-2">
                    {body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section
        aria-labelledby="company-heading"
        className="section border-t border-hairline bg-abyss"
      >
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
            <div>
              <Reveal>
                <p className="eyebrow">The company</p>
              </Reveal>
              <RevealWords
                as="h2"
                id="company-heading"
                text="Recognised, registered, and building."
                className="display-2 mt-6 text-ink"
                delay={0.05}
              />
            </div>

            <div>
              <div className="prose-body max-w-xl">
                <Reveal delay={0.08}>
                  <p>
                    Recharga Chargine Pvt. Ltd. is incorporated in India and
                    recognised by the Department for Promotion of Industry and
                    Internal Trade (DPIIT) under the Startup India programme. The
                    company is based in {company.locality}, {company.region}, and
                    was founded by {founders[0].name} and {founders[1].name}.
                  </p>
                </Reveal>
                <Reveal delay={0.12}>
                  <p>
                    We are early, and we say so plainly. RADAX is in active
                    development. What we publish describes the architecture we
                    are building and the reasoning behind it — not validated
                    performance results for a finished machine. When there are
                    numbers we can stand behind, they will appear here with the
                    work that produced them.
                  </p>
                </Reveal>
              </div>

              <Reveal delay={0.16}>
                <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2">
                  {[
                    { term: "Legal entity", detail: company.legalName },
                    { term: "CIN", detail: company.cin },
                    {
                      term: "Registered in",
                      detail: `${company.locality}, ${company.region}, ${company.country}`,
                    },
                    { term: "Recognition", detail: company.recognition },
                  ].map((item) => (
                    <div key={item.term} className="bg-surface-1 p-6">
                      <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-3">
                        {item.term}
                      </dt>
                      <dd className="mt-2.5 text-[0.9375rem] leading-snug text-ink">
                        {item.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mt-8 text-[0.9375rem] text-ink-2">
                  Read more about{" "}
                  <Link href="/technology" className="link-draw text-brand">
                    the RADAX architecture
                  </Link>{" "}
                  or{" "}
                  <Link href="/team" className="link-draw text-brand">
                    the people building it
                  </Link>
                  .
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
