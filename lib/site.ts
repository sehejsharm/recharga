/**
 * Single source of truth for company facts, navigation and configurable values.
 *
 * CONTENT RULES (see CONTENT-TODO.md):
 *  - Never write "RADAX™". The product is "RADAX" or "RADAX Generator".
 *  - Never reference patents, patent applications, or patent numbers.
 *  - Never publish the CIN or other registration numbers.
 *  - Never state achieved performance figures (efficiency %, torque density,
 *    mass, voltage). Use design-intent wording only.
 *  - Never present a named OEM as a customer or partner.
 *  - RADAX is a generator architecture, not a single machine rating. Wind is
 *    the first application, not the limit of it.
 */

/** Absolute origin used for canonicals, sitemap, OG images and JSON-LD. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://recharga.vercel.app"
).replace(/\/+$/, "");

export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Nullable env read: treats empty strings as "not provided". */
const env = (value: string | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

// Note: env vars are read as static `process.env.NEXT_PUBLIC_*` expressions so
// Next.js can inline them at build time. Dynamic `process.env[key]` lookups are
// not inlined and would be undefined in any client bundle importing this module.
const profileList = (raw: string | undefined, fallback: string[] = []) => {
  const parsed = (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parsed.length > 0 ? parsed : fallback;
};

export const company = {
  legalName: "Recharga Chargine Pvt. Ltd.",
  /** Short form used in nav, titles and prose. Never shortened to "Recharga". */
  shortName: "Recharga Chargine",
  product: "RADAX Generator",
  productShort: "RADAX",
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

  /** Official company profiles for Organization.sameAs. */
  profiles: profileList(process.env.NEXT_PUBLIC_ORG_PROFILES),
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
   * Bio paragraphs, written strictly from confirmed facts (role, company,
   * location, product). No credentials, education or employment history is
   * asserted — that is founder-supplied.
   */
  bio: string[];
  /**
   * Founder-supplied portrait in /public/team. Null renders the brand
   * placeholder rather than a stock face.
   */
  portrait: string | null;
  /** Real, authoritative profile URLs for Person.sameAs. */
  sameAs: string[];
};

export const founders: Founder[] = [
  {
    slug: "sehej-sharma",
    name: "Sehej Sharma",
    role: "Founder & CEO",
    summary:
      "Leads Recharga Chargine's direction and the engineering programme behind the RADAX generator architecture.",
    bio: [
      "Sehej Sharma is the Founder and Chief Executive Officer of Recharga Chargine Pvt. Ltd., a DPIIT-recognised deep-tech clean-energy company based in Jaipur, Rajasthan.",
      "He leads the company's direction — the engineering programme behind RADAX, and the licensing model that puts the architecture in manufacturers' hands rather than locking it inside a single product line.",
    ],
    portrait: null,
    sameAs: profileList(process.env.NEXT_PUBLIC_SEHEJ_PROFILES, [
      "https://www.linkedin.com/in/sehej-sharma-5b2151234/",
    ]),
  },
  {
    slug: "ali-electricwala",
    name: "Ali Electricwala",
    role: "Co-Founder & COO",
    summary:
      "Responsible for how the RADAX programme is built, delivered and taken to manufacturers.",
    bio: [
      "Ali Electricwala is the Co-Founder and Chief Operating Officer of Recharga Chargine Pvt. Ltd., a DPIIT-recognised deep-tech clean-energy company based in Jaipur, Rajasthan.",
      "He runs execution — turning the architecture into something a manufacturer can evaluate, adopt and produce, and building the operational groundwork a licensing business runs on.",
    ],
    portrait: null,
    sameAs: profileList(process.env.NEXT_PUBLIC_ALI_PROFILES, [
      "https://www.linkedin.com/in/ali-electricwala-190821261/",
    ]),
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
