import type { Metadata } from "next";
import { absoluteUrl, company } from "./site";

type PageMetaInput = {
  /** ~50–60 characters, without the brand suffix. */
  title: string;
  /** ~150–160 characters. */
  description: string;
  path: string;
  keywords?: string[];
};

/**
 * Builds per-page metadata with a canonical, OG and Twitter card.
 *
 * Share images are deliberately *not* set here: each route ships an
 * `opengraph-image.tsx`, and Next injects those URLs (content-hashed) itself.
 * Declaring `openGraph.images` as well would override the generated ones.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: company.shortName,
      locale: "en_IN",
      title: `${title} | ${company.shortName}`,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${company.shortName}`,
      description,
    },
  };
}

/** Serialises JSON-LD safely for embedding in a <script> tag. */
export const jsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
