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
      "DPIIT-recognised deep-tech clean-energy startup developing the RADAX Generator, a hybrid axial-radial flux, direct-drive generator architecture for wind turbines, licensed to OEMs.",
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
    jobTitle: founder.role,
    description: founder.summary,
    url: absoluteUrl(`/team/${founder.slug}`),
    image: founder.portrait ? absoluteUrl(founder.portrait) : undefined,
    worksFor: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: company.legalName,
    },
    homeLocation: compact({
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: company.locality,
        addressRegion: company.region,
        addressCountry: company.countryCode,
      },
    }),
    sameAs: founder.sameAs,
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

/** Wraps nodes in a single @graph so relationships resolve cleanly. */
export const graph = (nodes: Json[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});
