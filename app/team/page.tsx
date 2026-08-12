import type { Metadata } from "next";
import Link from "next/link";
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

const TITLE = "Team — Sehej Sharma and Ali Electricwala | Recharga founders";
const DESCRIPTION =
  "Meet the founders of Recharga Chargine Pvt. Ltd.: Sehej Sharma, Founder & CEO, and Ali Electricwala, Co-Founder & COO, building the RADAX generator architecture in Jaipur, India.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/team",
  keywords: [
    "Recharga team",
    "Recharga founders",
    "Sehej Sharma",
    "Sehej Sharma Recharga",
    "Ali Electricwala",
    "Ali Electricwala Recharga",
    "Recharga leadership",
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
        lede="Recharga was founded to rethink the generator at the heart of a wind turbine. That is a narrow brief, deliberately — and it is what the whole company is pointed at."
        trail={trail}
      />

      <section aria-label="Founders" className="section">
        <div className="shell">
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
            <div className="mt-20 max-w-3xl border-t border-hairline pt-10">
              <h2 className="display-3 text-ink">Working with us</h2>
              <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-2">
                We work directly with the engineering teams evaluating RADAX
                rather than through layers of business development. If you are
                assessing generator technology for a turbine platform, the
                fastest route is a conversation with the people who designed it.
              </p>
              <Link
                href="/contact"
                className="link-draw mt-7 inline-flex font-display text-lg text-ink"
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
