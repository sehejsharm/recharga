/**
 * Single source of truth for company facts, navigation and configurable values.
 *
 * CONTENT RULES (see CONTENT-TODO.md):
 *  - Never write "RADAX™". The product is "RADAX" or "RADAX Generator".
 *  - Never reference patents, patent applications, or patent numbers.
 *  - Never state achieved performance figures (efficiency %, torque density,
 *    mass, voltage). Use design-intent wording only.
 *  - Never present a named OEM as a customer or partner.
 */

/** Absolute origin used for canonicals, sitemap, OG images and JSON-LD. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://recharga.in"
).replace(/\/+$/, "");

export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Nullable env read: treats empty strings as "not provided". */
const env = (value: string | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export const company = {
  legalName: "Recharga Chargine Pvt. Ltd.",
  shortName: "Recharga",
  product: "RADAX Generator",
  productShort: "RADAX",
  cin: "U29304RJ2023PTC086778",
  recognition: "DPIIT-recognised startup under Startup India",
  founded: "2023",

  // Verifiable location. Street address is founder-supplied; the city/region
  // are safe to publish today, so schema stays valid either way.
  locality: "Jaipur",
  region: "Rajasthan",
  country: "India",
  countryCode: "IN",
  streetAddress: env(process.env.NEXT_PUBLIC_STREET_ADDRESS),
  postalCode: env(process.env.NEXT_PUBLIC_POSTAL_CODE),

  /** Public contact address. Null until confirmed — the UI falls back to the form. */
  email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),

  /**
   * Official profiles for Organization.sameAs. Deliberately empty:
   * fabricated profile URLs are worse than none for entity resolution.
   * Populate NEXT_PUBLIC_ORG_PROFILES as a comma-separated list.
   */
  profiles: (process.env.NEXT_PUBLIC_ORG_PROFILES ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
} as const;

export const company_address_line = [
  company.streetAddress,
  company.locality,
  company.region,
  company.country,
]
  .filter(Boolean)
  .join(", ");

export type Founder = {
  slug: string;
  name: string;
  role: string;
  /** Short line used on cards and in metadata. */
  summary: string;
  /**
   * Bio paragraphs. These are written strictly from confirmed facts
   * (role, company, location, product). No credentials, education or
   * employment history is asserted — that is founder-supplied.
   */
  bio: string[];
  /** Founder-supplied portrait in /public/team. Null renders the brand placeholder. */
  portrait: string | null;
  /** Real, authoritative profile URLs for Person.sameAs. Empty until supplied. */
  sameAs: string[];
  /** Pull-quote shown on the founder page. Null until founder-approved. */
  quote: string | null;
};

// Note: env vars are read as static `process.env.NEXT_PUBLIC_*` expressions so
// Next.js can inline them at build time. Dynamic `process.env[key]` lookups are
// not inlined and would be undefined in any client bundle importing this module.
const profileList = (raw: string | undefined) =>
  (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export const founders: Founder[] = [
  {
    slug: "sehej-sharma",
    name: "Sehej Sharma",
    role: "Founder & CEO",
    summary:
      "Founder and Chief Executive Officer of Recharga, leading the company's direction and the development of the RADAX generator architecture.",
    bio: [
      "Sehej Sharma is the Founder and Chief Executive Officer of Recharga Chargine Pvt. Ltd., a DPIIT-recognised deep-tech clean-energy company based in Jaipur, Rajasthan.",
      "He leads Recharga's overall direction — the engineering programme behind the RADAX Generator, the company's hybrid axial–radial flux, direct-drive generator architecture, and the licensing model that puts that architecture in the hands of wind-turbine manufacturers rather than keeping it inside a single product line.",
      "His focus is the part of the wind industry that rarely makes headlines: the generator itself, and what has to change in it before the cost of wind energy can move again.",
    ],
    portrait: null,
    sameAs: profileList(process.env.NEXT_PUBLIC_SEHEJ_PROFILES),
    quote: null,
  },
  {
    slug: "ali-electricwala",
    name: "Ali Electricwala",
    role: "Co-Founder & COO",
    summary:
      "Co-Founder and Chief Operating Officer of Recharga, responsible for how the RADAX programme is executed and delivered.",
    bio: [
      "Ali Electricwala is the Co-Founder and Chief Operating Officer of Recharga Chargine Pvt. Ltd., a DPIIT-recognised deep-tech clean-energy company based in Jaipur, Rajasthan.",
      "He is responsible for how the RADAX programme actually gets built and delivered — turning the generator architecture into something a manufacturer can evaluate, adopt and produce, and building the operational groundwork a licensing business runs on.",
      "He works across the engineering programme and the commercial side of Recharga's relationships with wind-turbine manufacturers.",
    ],
    portrait: null,
    sameAs: profileList(process.env.NEXT_PUBLIC_ALI_PROFILES),
    quote: null,
  },
];

export const getFounder = (slug: string) =>
  founders.find((f) => f.slug === slug);

export const nav = [
  { href: "/technology", label: "Technology" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
] as const;

/** Pages included in the sitemap, with crawl priorities. */
export const routes = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" as const },
  { path: "/technology", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/team", priority: 0.8, changeFrequency: "monthly" as const },
  ...founders.map((f) => ({
    path: `/team/${f.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
];
