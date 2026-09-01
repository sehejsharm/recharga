import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowRight } from "@/components/graphics/Icons";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/shared/CtaBand";
import { PageHeader } from "@/components/shared/PageHeader";
import { gallerySections, galleryImages } from "@/lib/gallery";
import {
  breadcrumbSchema,
  graph,
  imageGallerySchema,
  personSchema,
} from "@/lib/schema";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { company, getFounder } from "@/lib/site";

const PATH = "/about-sehej-sharma";

const TITLE = "Sehej Sharma — Photos";
const DESCRIPTION =
  "Photo gallery of Sehej Sharma — Founder & CEO, Recharga Chargine. Speaking, pitching, and equestrian sport (polo, show jumping, dressage).";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "Sehej Sharma",
    "Sehej Sharma photos",
    "Sehej Sharma Recharga Chargine",
    "Sehej Sharma Jaipur",
    "Sehej Sharma polo",
    "Sehej Sharma founder",
  ],
});

export default function SehejSharmaPhotosPage() {
  const founder = getFounder("sehej-sharma");
  if (!founder) notFound();

  const profilePath = `/team/${founder.slug}`;
  const trail = [
    { name: "Home", path: "/" },
    { name: "Team", path: "/team" },
    { name: founder.name, path: profilePath },
    { name: "Photos", path: PATH },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            graph([
              imageGallerySchema({
                founder,
                path: PATH,
                name: TITLE,
                description: DESCRIPTION,
                images: galleryImages,
              }),
              // The Person node itself, so this page resolves to the same
              // entity as the profile rather than standing on its own.
              personSchema(founder),
              breadcrumbSchema(trail),
            ]),
          ),
        }}
      />

      <PageHeader
        eyebrow="Photos"
        title={founder.name}
        lede={`${founder.role}, ${company.shortName} · ${company.locality}, ${company.country}`}
        trail={trail}
      >
        <Link href={profilePath} className="link-draw font-display text-lg">
          Read the full profile
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </PageHeader>

      {gallerySections.map((section, s) => (
        <section
          key={section.heading}
          aria-labelledby={`gallery-${s}`}
          className={
            s === 0 ? "section" : "section border-t border-hairline bg-abyss"
          }
        >
          <div className="shell">
            <Reveal>
              <h2
                id={`gallery-${s}`}
                className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-3"
              >
                {section.heading}
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.images.map((image, i) => (
                <Reveal key={image.src} delay={(i % 3) * 0.06} y={20}>
                  <figure className="overflow-hidden rounded-2xl border border-hairline bg-surface-1">
                    {/*
                      Plain <img>, not next/image: this is a static export with
                      the optimiser off, and these files live on Wikimedia
                      Commons rather than in /public. The markup is the set
                      supplied by the founder, alt text included.
                    */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                      width={image.width}
                      height={image.height}
                      className="block h-56 w-full object-cover"
                    />
                    <figcaption className="px-4 py-3 text-sm text-ink-2">
                      {image.caption}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
