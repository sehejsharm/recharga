import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortraitFrame } from "@/components/graphics/PortraitFrame";
import { IconArrowRight } from "@/components/graphics/Icons";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs } from "@/components/shared/PageHeader";
import { CtaBand } from "@/components/shared/CtaBand";
import {
  breadcrumbSchema,
  graph,
  personSchema,
  webPageSchema,
} from "@/lib/schema";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { company, founders, getFounder } from "@/lib/site";

type Params = { slug: string };

/** Static params make every founder page a build-time HTML file. */
export function generateStaticParams(): Params[] {
  return founders.map((founder) => ({ slug: founder.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const founder = getFounder(slug);
  if (!founder) return {};

  return pageMetadata({
    title: `${founder.name} — ${founder.role}, Recharga Chargine`,
    description: `${founder.name} is ${founder.role} of Recharga Chargine Pvt. Ltd., the DPIIT-recognised deep-tech company in Jaipur, India developing the RADAX generator architecture.`,
    path: `/team/${founder.slug}`,
    keywords: [
      founder.name,
      `${founder.name} Recharga Chargine`,
      `${founder.name} ${founder.role}`,
      "Recharga Chargine",
      "RADAX Generator",
    ],
  });
}

export default async function FounderPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const founder = getFounder(slug);
  if (!founder) notFound();

  const other = founders.find((f) => f.slug !== founder.slug);

  const trail = [
    { name: "Home", path: "/" },
    { name: "Team", path: "/team" },
    { name: founder.name, path: `/team/${founder.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            graph([
              webPageSchema({
                path: `/team/${founder.slug}`,
                name: `${founder.name} — ${founder.role}, ${company.legalName}`,
                description: founder.summary,
              }),
              personSchema(founder),
              breadcrumbSchema(trail),
            ]),
          ),
        }}
      />

      <article>
        <header className="relative overflow-hidden border-b border-hairline pt-[var(--header-h)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_75%_10%,rgba(0,255,94,0.08),transparent_60%)]" />
            <div className="grid-motif absolute inset-0 opacity-25" />
          </div>

          <div className="shell py-16 lg:py-24">
            <Breadcrumbs trail={trail} />

            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-20">
              <div>
                <p
                  className="eyebrow rise-in"
                  style={{ animationDelay: "60ms" }}
                >
                  {founder.role}
                </p>
                <h1
                  className="display-1 rise-in mt-6 text-ink"
                  style={{ animationDelay: "130ms" }}
                >
                  {founder.name}
                </h1>
                <p
                  className="lede rise-in mt-8 max-w-xl"
                  style={{ animationDelay: "230ms" }}
                >
                  {founder.summary}
                </p>

                {founder.sameAs.length > 0 && (
                  <ul
                    className="rise-in mt-9 flex flex-wrap gap-3"
                    style={{ animationDelay: "320ms" }}
                  >
                    {founder.sameAs.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer me"
                          className="btn-ghost !px-5 !py-2.5 !text-sm"
                        >
                          {profileLabel(url)}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div
                className="rise-in mx-auto w-full max-w-sm lg:max-w-none"
                style={{ animationDelay: "180ms" }}
              >
                <PortraitFrame
                  founder={founder}
                  priority
                  sizes="(min-width: 1024px) 28rem, 24rem"
                />
              </div>
            </div>
          </div>
        </header>

        <section aria-label="Biography" className="section">
          <div className="shell">
            <div className="grid gap-12 lg:grid-cols-[0.4fr_1fr] lg:gap-20">
              <Reveal>
                <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-3">
                  Biography
                </h2>
              </Reveal>

              <div className="prose-body max-w-2xl">
                {founder.bio.map((paragraph, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <p>{paragraph}</p>
                  </Reveal>
                ))}

                <Reveal delay={0.24}>
                  <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-hairline pt-8 text-[0.9375rem]">
                    <Link href="/technology" className="link-draw text-ink">
                      The RADAX architecture
                      <IconArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/about" className="link-draw text-ink">
                      About Recharga Chargine
                      <IconArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {other && (
          <section
            aria-label="Other founder"
            className="border-t border-hairline bg-abyss"
          >
            <div className="shell section-tight">
              <Link
                href={`/team/${other.slug}`}
                className="group flex flex-wrap items-center justify-between gap-6 rounded-2xl"
              >
                <div>
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-3">
                    Also at Recharga Chargine
                  </p>
                  <p className="display-3 mt-3 text-ink">{other.name}</p>
                  <p className="mt-1.5 text-sm text-ink-2">{other.role}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline text-ink-2 transition-all duration-500 group-hover:border-brand/60 group-hover:text-brand"
                  style={{ transitionTimingFunction: "var(--ease-signature)" }}
                >
                  <IconArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </section>
        )}
      </article>

      <CtaBand />
    </>
  );
}

/** Human label for a profile URL, used on the founder's outbound links. */
function profileLabel(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("linkedin")) return "LinkedIn";
    if (host.includes("x.com") || host.includes("twitter")) return "X";
    if (host.includes("crunchbase")) return "Crunchbase";
    if (host.includes("github")) return "GitHub";
    return host;
  } catch {
    return "Profile";
  }
}
