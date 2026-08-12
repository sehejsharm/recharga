import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { founders, getFounder } from "@/lib/site";

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
    title: founder?.name ?? "Recharga Chargine",
  });
}
