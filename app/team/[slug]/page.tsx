import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortraitFrame } from "@/components/graphics/PortraitFrame";
import { IconArrowRight } from "@/components/graphics/Icons";
import { MagneticDots } from "@/components/graphics/MagneticDots";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs } from "@/components/shared/PageHeader";
import { CtaBand } from "@/components/shared/CtaBand";
import {
  breadcrumbSchema,
  graph,
  personSchema,
  profilePageSchema,
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

  // Title leads with the bare name: it is the query we want this page to win.
  // The brand suffix comes from the root layout's title template, so it is
  // deliberately not repeated here.
  return pageMetadata({
    title: `${founder.name} — ${founder.role}`,
    description: `${founder.name} is ${founder.role} of Recharga Chargine Pvt. Ltd., the DPIIT-recognised deep-tech company in Jaipur, India developing the RADAX generator architecture. Profile, role and background.`,
    path: `/team/${founder.slug}`,
    keywords: [
      founder.name,
      `${founder.name} Recharga Chargine`,
      `${founder.name} ${founder.role}`,
      `${founder.name} Jaipur`,
      `${founder.name} RADAX`,
      "Recharga Chargine founders",
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
              profilePageSchema(founder),
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
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_78%_15%,rgba(0,255,94,0.10),transparent_62%)]" />
            <div className="grid-motif absolute inset-0 opacity-25" />
          </div>

          <div className="shell py-14 lg:py-20">
            <Breadcrumbs trail={trail} />

            <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1fr_0.92fr] lg:gap-16">
              <div className="order-2 lg:order-1">
                <p className="eyebrow rise-in" style={{ animationDelay: "60ms" }}>
                  {founder.role}
                </p>
                <h1
                  className="display-1 rise-in mt-6 text-ink"
                  style={{ animationDelay: "130ms" }}
                >
                  {founder.name}
                </h1>
                <p
                  className="lede rise-in mt-7 max-w-xl"
                  style={{ animationDelay: "230ms" }}
                >
                  {founder.summary}
                </p>

                <div
                  className="rise-in mt-9 flex flex-wrap items-center gap-3"
                  style={{ animationDelay: "320ms" }}
                >
                  {founder.sameAs.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="btn-ghost !px-5 !py-2.5 !text-sm"
                    >
                      {/* Full name in the accessible/crawlable text ("Sehej
                          Sharma on Instagram") without changing the visible
                          label — helps Google associate the profile with him. */}
                      <span className="sr-only">{founder.name} on </span>
                      {profileLabel(url)}
                      <IconArrowRight className="h-3.5 w-3.5" />
                    </a>
                  ))}
                  <Link href="/contact" className="btn-primary !px-5 !py-2.5 !text-sm">
                    Get in touch
                  </Link>
                </div>
              </div>

              {/* Portrait leads on mobile and holds real weight on desktop. */}
              <div className="order-1 lg:order-2">
                <div
                  className="rise-in relative mx-auto w-full max-w-md lg:max-w-none"
                  style={{ animationDelay: "180ms" }}
                >
                  <div
                    aria-hidden="true"
                    className="glow-brand absolute -inset-6 -z-10 opacity-50"
                  />
                  <PortraitFrame
                    founder={founder}
                    priority
                    graded={false}
                    sizes="(min-width: 1024px) 34rem, (min-width: 640px) 28rem, 90vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ---------------- Biography ---------------- */}
        <section aria-labelledby="bio-heading" className="section">
          <div className="shell">
            <div className="grid gap-12 lg:grid-cols-[0.34fr_1fr] lg:gap-20">
              <Reveal>
                <h2
                  id="bio-heading"
                  className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-3"
                >
                  Biography
                </h2>
              </Reveal>

              <div className="prose-body max-w-2xl">
                {founder.bio.map((paragraph, i) => (
                  <Reveal key={i} delay={i * 0.05}>
                    <p>{paragraph}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Focus areas ---------------- */}
        <section
          aria-labelledby="focus-heading"
          className="relative section border-y border-hairline bg-abyss"
        >
          <MagneticDots
            className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
            spacing={40}
          />
          <div className="shell relative">
            <div className="grid gap-12 lg:grid-cols-[0.34fr_1fr] lg:gap-20">
              <Reveal>
                <h2
                  id="focus-heading"
                  className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-3"
                >
                  What {founder.name.split(" ")[0]} works on
                </h2>
              </Reveal>

              <dl className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2">
                {founder.focus.map((item, i) => (
                  <Reveal key={item.title} delay={i * 0.06} y={18}>
                    <div className="h-full bg-surface-1 p-6">
                      <dt className="font-display text-[0.9375rem] font-medium text-ink">
                        {item.title}
                      </dt>
                      <dd className="mt-2 text-sm leading-relaxed text-ink-2">
                        {item.body}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ---------------- Context ---------------- */}
        <section aria-labelledby="context-heading" className="section">
          <div className="shell">
            <div className="grid gap-12 lg:grid-cols-[0.34fr_1fr] lg:gap-20">
              <Reveal>
                <h2
                  id="context-heading"
                  className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-3"
                >
                  At Recharga Chargine
                </h2>
              </Reveal>

              <div className="max-w-2xl">
                <Reveal>
                  <p className="lede">
                    {founder.name} is one of two founders of{" "}
                    {company.legalName}, a DPIIT-recognised deep-tech
                    clean-energy company in {company.locality},{" "}
                    {company.region}, developing the RADAX Generator — a hybrid
                    axial–radial flux, direct-drive generator architecture
                    licensed to the manufacturers who build the machines.
                  </p>
                </Reveal>

                <Reveal delay={0.08}>
                  <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4 border-t border-hairline pt-8 text-[0.9375rem]">
                    <Link href="/technology" className="link-draw text-ink">
                      The RADAX architecture
                      <IconArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/about" className="link-draw text-ink">
                      About Recharga Chargine
                      <IconArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/team" className="link-draw text-ink">
                      The whole team
                      <IconArrowRight className="h-4 w-4" />
                    </Link>
                    {founder.photosPath && (
                      <Link
                        href={founder.photosPath}
                        className="link-draw text-ink"
                      >
                        Photos of {founder.name.split(" ")[0]}
                        <IconArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- The other founder ---------------- */}
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
                <div className="flex items-center gap-6">
                  <span className="hidden h-20 w-16 flex-none sm:block">
                    <PortraitFrame
                      founder={other}
                      aspectClass="h-full w-full"
                      className="!rounded-lg"
                      sizes="64px"
                    />
                  </span>
                  <span>
                    <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-3">
                      Also at Recharga Chargine
                    </span>
                    <span className="display-3 mt-3 block text-ink">
                      {other.name}
                    </span>
                    <span className="mt-1.5 block text-sm text-ink-2">
                      {other.role}
                    </span>
                  </span>
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
    if (host.includes("instagram")) return "Instagram";
    if (host.includes("github")) return "GitHub";
    return host;
  } catch {
    return "Profile";
  }
}
