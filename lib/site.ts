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
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rechargachargine.com"
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

  /**
   * Public contact address. Every enquiry from the site — the contact form
   * included — is delivered here. Kept in sync with MAIL_TO in
   * public/api/contact.php.
   */
  email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? "admin@rechargachargine.com",

  /**
   * Official company profiles for Organization.sameAs — the property Google
   * uses to tie this site to the same entity elsewhere. Founder-confirmed, so
   * they ship as the fallback rather than waiting on an env var to be set.
   *
   * Wikidata Q141209007 is deliberately absent: a Q-item identifies exactly
   * one entity, and that one is Sehej Sharma the person (it is cited as his
   * on Focus Realm too). It belongs on Person.sameAs only — claiming it here
   * as well would tell Google the company and the person are one entity.
   */
  profiles: profileList(process.env.NEXT_PUBLIC_ORG_PROFILES, [
    "https://www.crunchbase.com/organization/recharga-chargine",
    "https://www.linkedin.com/company/rechargachargine",
  ]),
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
  /** Short, factual responsibility areas shown as a list on the profile. */
  focus: { title: string; body: string }[];
  /** Real, authoritative profile URLs, rendered as links on the profile page. */
  sameAs: string[];
  /**
   * Entity-resolution profiles for Person.sameAs, when they differ from the
   * links shown on the page. Deliberately separate: adding a Wikidata item or a
   * sister-company profile should strengthen the structured data without
   * changing what the page renders. Replaces `sameAs` in JSON-LD when set.
   */
  schemaSameAs?: string[];
  /**
   * Person.description, when the schema should say more than the one-line
   * `summary` shown on cards. Structured data only — never rendered.
   */
  schemaDescription?: string;
  /**
   * Additional portrait URLs for Person.image, beyond the local `portrait`.
   * A canonical, freely-licensed image helps a knowledge panel resolve.
   */
  schemaImages?: string[];
  /** Founder-supplied education, emitted as Person.alumniOf. */
  alumniOf?: string;
  /** A photo page for this person, linked from the profile. */
  photosPath?: string;
  /** Topics the person works on — feeds Person.knowsAbout for topical relevance. */
  knowsAbout: string[];
};

export const founders: Founder[] = [
  {
    slug: "sehej-sharma",
    name: "Sehej Sharma",
    role: "Founder & CEO",
    summary:
      "Leads Recharga Chargine's direction and the engineering programme behind the RADAX generator architecture.",
    bio: [
      "Sehej Sharma is the Founder and Chief Executive Officer of Recharga Chargine Pvt. Ltd., a DPIIT-recognised deep-tech clean-energy company based in Jaipur, Rajasthan, India.",
      "He founded the company around a narrow conviction: that the generator — the machine that actually converts rotation into electricity — is the part of the renewable-energy drivetrain with the most room left to improve, and the part the industry has changed least.",
      "He leads Recharga Chargine's overall direction and the engineering programme behind RADAX, the company's hybrid axial\u2013radial flux, direct-drive generator architecture. That covers the technical direction of the architecture itself and the commercial model around it — licensing the design to the manufacturers who build machines at scale, rather than becoming a manufacturer and competing with them.",
      "He works directly with the engineering and commercial teams evaluating RADAX, and represents Recharga Chargine to manufacturers, investors and the wider clean-energy community.",
    ],
    portrait: "/team/sehej-sharma.webp",
    focus: [
      {
        title: "Company direction",
        body: "Setting what Recharga Chargine builds, in what order, and for whom.",
      },
      {
        title: "The RADAX programme",
        body: "Technical direction of the hybrid axial\u2013radial flux architecture.",
      },
      {
        title: "Licensing strategy",
        body: "The model that puts the architecture into manufacturers' hands.",
      },
      {
        title: "Partners and investors",
        body: "First point of contact for manufacturers, investors and press.",
      },
    ],
    // Rendered as the profile's visible link buttons. LinkedIn only: Instagram
    // and X read as too informal for the page, so they are kept out of the UI
    // but retained in schemaSameAs below for entity association.
    sameAs: profileList(process.env.NEXT_PUBLIC_SEHEJ_PROFILES, [
      "https://www.linkedin.com/in/sehejsharma",
    ]),
    // The full entity set for Person.sameAs — this is what ties the accounts to
    // his name for search. Instagram and X stay here (not shown as buttons).
    schemaSameAs: [
      "https://www.wikidata.org/wiki/Q141209007",
      "https://www.instagram.com/sehejsharma03",
      "https://x.com/thisissehej",
      "https://www.linkedin.com/in/sehejsharma",
      "https://www.crunchbase.com/person/sehej-sharma",
      "https://focusrealm.org/team/sehej-sharma",
    ],
    schemaDescription:
      "Founder & CEO of Recharga Chargine (RADAX wind-turbine generator) and Co-Founder & CEO of Focus Realm. Based in Jaipur, India.",
    schemaImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sehej%20Sharma.png",
    ],
    alumniOf: "Neerja Modi School",
    photosPath: "/about-sehej-sharma",
    knowsAbout: [
      "Wind turbine generator technology",
      "Axial flux and radial flux generator topologies",
      "Permanent magnet direct drive generators",
      "Deep-tech technology licensing",
      "Clean energy startups in India",
    ],
  },
  {
    slug: "ali-electricwala",
    name: "Ali Electricwala",
    role: "Co-Founder & COO",
    summary:
      "Responsible for how the RADAX programme is built, delivered and taken to manufacturers.",
    bio: [
      "Ali Electricwala is the Co-Founder and Chief Operating Officer of Recharga Chargine Pvt. Ltd., a DPIIT-recognised deep-tech clean-energy company based in Jaipur, Rajasthan, India.",
      "He co-founded the company to work on the same problem from the other side: not only whether a better generator architecture can be designed, but whether it can be built, evaluated and adopted by manufacturers who already produce at scale.",
      "He runs execution across the RADAX programme — turning the architecture into something a manufacturer's engineering team can assess against a real platform, and building the operational groundwork a technology-licensing business depends on.",
      "His work sits where the engineering programme meets the commercial one: how the architecture is delivered, how partnerships are structured, and how the company runs day to day.",
    ],
    portrait: "/team/ali-electricwala.webp",
    focus: [
      {
        title: "Programme execution",
        body: "How RADAX moves from architecture to something a partner can adopt.",
      },
      {
        title: "Manufacturer readiness",
        body: "Making the design assessable against a real production platform.",
      },
      {
        title: "Operations",
        body: "The groundwork a licensing business runs on, day to day.",
      },
      {
        title: "Partnerships",
        body: "How agreements with manufacturers are structured and supported.",
      },
    ],
    sameAs: profileList(process.env.NEXT_PUBLIC_ALI_PROFILES, [
      "https://www.linkedin.com/in/ali-electricwala-190821261/",
    ]),
    knowsAbout: [
      "Wind turbine generator technology",
      "Direct drive generator manufacturing",
      "Technology licensing operations",
      "Deep-tech programme delivery",
      "Clean energy startups in India",
    ],
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
  // Founder pages carry a high priority deliberately: winning
  // "Sehej Sharma" and "Ali Electricwala" as queries is an explicit goal.
  ...founders.map((f) => ({
    path: `/team/${f.slug}`,
    priority: 0.9,
    changeFrequency: "monthly" as const,
  })),
  // Photo pages sit just under their profile: supporting evidence for the
  // same entity, not a competing landing page for the name.
  ...founders
    .filter((f) => f.photosPath)
    .map((f) => ({
      path: f.photosPath as string,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
];
