import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowRight } from "@/components/graphics/Icons";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/shared/CtaBand";
import { PageHeader } from "@/components/shared/PageHeader";
import { GalleryFigure } from "@/components/shared/GalleryFigure";
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
                  {/* GalleryFigure hides its own card if the image fails to
                      load, so a missing source never shows as a broken box. */}
                  <GalleryFigure
                    src={image.src}
                    alt={image.alt}
                    caption={image.caption}
                    width={image.width}
                    height={image.height}
                  />
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
