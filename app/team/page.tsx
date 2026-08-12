import type { Metadata } from "next";
import Link from "next/link";
import { MagneticDots } from "@/components/graphics/MagneticDots";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/shared/CtaBand";
import { FounderCard } from "@/components/shared/FounderCard";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  breadcrumbSchema,
  graph,
  personSchema,
  webPageSchema,
} from "@/lib/schema";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { founders } from "@/lib/site";

const TITLE = "Team — Sehej Sharma and Ali Electricwala, founders";
const DESCRIPTION =
  "The founders of Recharga Chargine Pvt. Ltd.: Sehej Sharma, Founder & CEO, and Ali Electricwala, Co-Founder & COO, building the RADAX generator architecture in Jaipur, India.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/team",
  keywords: [
    "Recharga Chargine team",
    "Recharga Chargine founders",
    "Sehej Sharma",
    "Sehej Sharma Recharga Chargine",
    "Ali Electricwala",
    "Ali Electricwala Recharga Chargine",
  ],
});

export default function TeamPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Team", path: "/team" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            graph([
              webPageSchema({
                path: "/team",
                name: TITLE,
                description: DESCRIPTION,
              }),
              ...founders.map(personSchema),
              breadcrumbSchema(trail),
            ]),
          ),
        }}
      />

      <PageHeader
        eyebrow="Leadership"
        title={
          <>
            Two founders, one{" "}
            <span className="text-gradient-brand">very specific</span> problem.
          </>
        }
        lede="Rethink the generator at the heart of a machine. Narrow brief, deliberately — and it's what the whole company points at."
        trail={trail}
      />

      <section aria-label="Founders" className="relative section">
        <MagneticDots
          className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
          spacing={44}
        />
        <div className="shell relative">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            {founders.map((founder, i) => (
              <Reveal key={founder.slug} delay={i * 0.1} y={30}>
                <FounderCard
                  founder={founder}
                  priority={i === 0}
                  sizes="(min-width: 1024px) 36rem, (min-width: 640px) 90vw, 100vw"
                />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-20 flex flex-wrap items-end justify-between gap-8 border-t border-hairline pt-10">
              <div>
                <h2 className="display-3 text-ink">Working with us</h2>
                <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ink-2">
                  We work directly with the engineering teams evaluating RADAX —
                  not through layers of business development.
                </p>
              </div>
              <Link
                href="/contact"
                className="link-draw font-display text-lg text-ink"
              >
                Get in touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
