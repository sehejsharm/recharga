/**
 * JSON-LD builders.
 *
 * Every builder omits fields it cannot fill honestly — an absent `sameAs` is
 * better for entity resolution than a guessed URL, and an incomplete address
 * is better than an invented street. Nothing here may contain performance
 * claims, patent language, or the ™ symbol (see §2 of the brief).
 */
import { absoluteUrl, company, founders, type Founder } from "./site";

type Json = Record<string, unknown>;

/** Drops null/undefined/empty-array values so we never emit hollow properties. */
const compact = (obj: Json): Json =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      if (v === null || v === undefined) return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    }),
  );

/** Emits a bare value for a single entry, an array for several, nothing for none. */
const singleOrList = <T,>(items: T[]): T | T[] | undefined =>
  items.length === 0 ? undefined : items.length === 1 ? items[0] : items;

export const ORG_ID = absoluteUrl("/#organization");
export const SITE_ID = absoluteUrl("/#website");

const postalAddress = () =>
  compact({
    "@type": "PostalAddress",
    streetAddress: company.streetAddress,
    addressLocality: company.locality,
    addressRegion: company.region,
    postalCode: company.postalCode,
    addressCountry: company.countryCode,
  });

export const organizationSchema = (): Json =>
  compact({
    "@type": "Organization",
    "@id": ORG_ID,
    name: company.legalName,
    alternateName: company.shortName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo.svg"),
    image: absoluteUrl("/icon-512.png"),
    description:
      "DPIIT-recognised deep-tech startup developing the RADAX Generator, a hybrid axial-radial flux, direct-drive generator architecture for wind turbines, licensed to manufacturers.",
    foundingDate: company.founded,
    foundingLocation: compact({
      "@type": "Place",
      address: postalAddress(),
    }),
    address: postalAddress(),
    email: company.email,
    knowsAbout: [
      "Wind turbine generator technology",
      "Axial flux generators",
      "Radial flux generators",
      "Permanent magnet direct drive generators",
      "Wind energy technology licensing",
    ],
    founder: founders.map((f) =>
      compact({
        "@type": "Person",
        "@id": absoluteUrl(`/team/${f.slug}#person`),
        name: f.name,
        jobTitle: f.role,
        url: absoluteUrl(`/team/${f.slug}`),
      }),
    ),
    sameAs: company.profiles,
  });

export const websiteSchema = (): Json => ({
  "@type": "WebSite",
  "@id": SITE_ID,
  name: company.shortName,
  alternateName: company.legalName,
  url: absoluteUrl("/"),
  publisher: { "@id": ORG_ID },
  inLanguage: "en",
});

/**
 * LocalBusiness for the Jaipur presence. Only emitted with the address we can
 * actually stand behind; street-level detail appears once configured.
 */
export const localBusinessSchema = (): Json =>
  compact({
    "@type": "Organization",
    "@id": absoluteUrl("/contact#localbusiness"),
    name: company.legalName,
    url: absoluteUrl("/contact"),
    logo: absoluteUrl("/logo.svg"),
    address: postalAddress(),
    email: company.email,
    parentOrganization: { "@id": ORG_ID },
  });

export const personSchema = (founder: Founder): Json =>
  compact({
    "@type": "Person",
    "@id": absoluteUrl(`/team/${founder.slug}#person`),
    name: founder.name,
    givenName: founder.name.split(" ")[0],
    familyName: founder.name.split(" ").slice(1).join(" ") || undefined,
    jobTitle: founder.role,
    description: founder.schemaDescription ?? founder.summary,
    // The full bio, so the entity carries real substance rather than a label.
    disambiguatingDescription: founder.bio[0],
    url: absoluteUrl(`/team/${founder.slug}`),
    mainEntityOfPage: absoluteUrl(`/team/${founder.slug}`),
    // Local portrait first, then any canonical off-site image. A single URL
    // stays a string so the shape does not change for founders without one.
    image: singleOrList([
      ...(founder.portrait ? [absoluteUrl(founder.portrait)] : []),
      ...(founder.schemaImages ?? []),
    ]),
    alumniOf: founder.alumniOf
      ? { "@type": "EducationalOrganization", name: founder.alumniOf }
      : undefined,
    worksFor: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: company.legalName,
    },
    affiliation: { "@id": ORG_ID },
    knowsAbout: founder.knowsAbout,
    nationality: { "@type": "Country", name: company.country },
    homeLocation: compact({
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: company.locality,
        addressRegion: company.region,
        addressCountry: company.countryCode,
      },
    }),
    sameAs: founder.schemaSameAs ?? founder.sameAs,
  });

/**
 * ProfilePage wrapper for a founder page.
 *
 * This is the schema type Google documents for "a page about one person", and
 * it is the single most useful signal for winning a founder's own name as a
 * query: it tells the crawler this page *is* the profile for that entity,
 * rather than a page that merely mentions them.
 */
export const profilePageSchema = (founder: Founder): Json => ({
  "@type": "ProfilePage",
  "@id": absoluteUrl(`/team/${founder.slug}#profilepage`),
  url: absoluteUrl(`/team/${founder.slug}`),
  name: `${founder.name} — ${founder.role}, ${company.legalName}`,
  description: founder.summary,
  isPartOf: { "@id": SITE_ID },
  inLanguage: "en",
  mainEntity: { "@id": absoluteUrl(`/team/${founder.slug}#person`) },
  about: { "@id": absoluteUrl(`/team/${founder.slug}#person`) },
  ...(founder.portrait
    ? {
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: absoluteUrl(founder.portrait),
          caption: `${founder.name}, ${founder.role} of ${company.legalName}`,
        },
      }
    : {}),
});

/**
 * Product entry for RADAX. Name and description only — no specifications,
 * no ratings, no availability, no patent language.
 */
export const productSchema = (): Json => ({
  "@type": "Product",
  "@id": absoluteUrl("/technology#radax"),
  name: "RADAX Generator",
  brand: { "@type": "Brand", name: company.shortName },
  manufacturer: { "@id": ORG_ID },
  category: "Wind turbine generator architecture",
  url: absoluteUrl("/technology"),
  description:
    "A hybrid axial-radial flux, direct-drive, permanent-magnet generator architecture designed for multi-megawatt wind turbines and offered to OEMs via technology licensing.",
});

export const breadcrumbSchema = (
  trail: { name: string; path: string }[],
): Json => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map((crumb, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path),
  })),
});

export const webPageSchema = (opts: {
  path: string;
  name: string;
  description: string;
}): Json => ({
  "@type": "WebPage",
  "@id": absoluteUrl(`${opts.path}#webpage`),
  url: absoluteUrl(opts.path),
  name: opts.name,
  description: opts.description,
  isPartOf: { "@id": SITE_ID },
  about: { "@id": ORG_ID },
  inLanguage: "en",
});

/**
 * ImageGallery for a founder's photo page.
 *
 * The images hang off the same Person `@id` as the profile page, so the two
 * pages describe one entity rather than two. `alt` is emitted as
 * ImageObject.name and the visible figcaption as ImageObject.caption, matching
 * how the supplied source paired them.
 */
export const imageGallerySchema = (opts: {
  founder: Founder;
  path: string;
  name: string;
  description: string;
  images: { src: string; alt: string; caption: string }[];
}): Json => ({
  "@type": "ImageGallery",
  "@id": absoluteUrl(`${opts.path}#gallery`),
  url: absoluteUrl(opts.path),
  name: opts.name,
  description: opts.description,
  isPartOf: { "@id": SITE_ID },
  inLanguage: "en",
  about: { "@id": absoluteUrl(`/team/${opts.founder.slug}#person`) },
  mainEntity: { "@id": absoluteUrl(`/team/${opts.founder.slug}#person`) },
  image: opts.images.map((img) => ({
    "@type": "ImageObject",
    contentUrl: img.src,
    name: img.alt,
    caption: img.caption,
  })),
});

/** Wraps nodes in a single @graph so relationships resolve cleanly. */
export const graph = (nodes: Json[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});
