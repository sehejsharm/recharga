import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  portraitDataUri,
  renderOgImage,
} from "@/lib/og";
import { company, founders, getFounder } from "@/lib/site";

// Static export: these metadata routes are generated once at build time.
export const dynamic = "force-static";

export const alt = "Recharga Chargine leadership";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return founders.map((founder) => ({ slug: founder.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const founder = getFounder(slug);

  return renderOgImage({
    eyebrow: founder?.role ?? "Leadership",
    title: founder?.name ?? company.shortName,
    portrait: await portraitDataUri(founder?.portrait ?? null),
  });
}
