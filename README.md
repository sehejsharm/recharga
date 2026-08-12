# Recharga

Marketing site for **Recharga Chargine Pvt. Ltd.** — a DPIIT-recognised
deep-tech clean-energy company in Jaipur, India, developing the **RADAX
Generator**, a hybrid axial–radial flux, direct-drive generator architecture
licensed to manufacturers. Wind turbines first.

> **Before launch, read [`CONTENT-TODO.md`](./CONTENT-TODO.md).** It lists
> everything only the founders can supply — the production domain, founder
> profile URLs, portraits and contact-form credentials.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript, Turbopack |
| Styling | Tailwind CSS v4, CSS-variable design tokens |
| Smooth scroll | Lenis, wired into GSAP's ticker |
| Scroll storytelling | GSAP + ScrollTrigger (pinned Problem → Solution scene) |
| Scroll reveals | CSS transitions driven by one IntersectionObserver |
| Route transitions | Framer Motion |
| Email | Resend, via a Server Action |
| Deploy | Vercel |

Every page is prerendered to static HTML at build time. There is no
client-only rendering anywhere — that was the root cause of the previous site
being invisible to search.

## Commands

```bash
npm run dev              # development server
npm run build            # production build (also type-checks)
npm start                # serve the production build
npm run lint             # ESLint
npm run audit:content    # content-rule + SEO audit against a running server
npm run audit:rules      # prove the audit rules still catch what they should
```

## Environment

Copy `.env.example` to `.env.local`. Nothing is required to run locally — the
site builds and renders with every value blank, and the contact form logs
submissions to the console instead of emailing.

`NEXT_PUBLIC_SITE_URL` is the one value that genuinely matters in production:
canonicals, the sitemap, OG image URLs and JSON-LD `@id`s are all derived from
it.

Secrets (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`) are read
only inside the Server Action and never reach the browser bundle.

---

## Architecture notes

### Content is in the HTML, always

Scroll reveals hide their elements **only** under `html.motion-ok`, a class an
inline script adds before the body paints and only when the visitor has not
asked for reduced motion.

- no JS, or JS that fails → everything renders visible
- reduced motion → everything renders visible
- otherwise → hidden, then revealed on enter

This is the inverse of the usual `initial={{ opacity: 0 }}` approach, which
serialises invisible content into the server HTML and makes the page depend on
hydration to be readable. `Reveal` and `RevealWords` are **server** components
as a result — no per-component client JavaScript.

The same reasoning applies above the fold: hero and page-header entrances are
CSS animations, and `PageTransition` deliberately skips its entrance on first
paint so no `opacity: 0` is ever serialised into the initial HTML.

### Reduced motion is honoured at the source

Not a blanket `animation: none` override. Lenis never initialises, ScrollTrigger
never pins, the hero canvas never starts, and the magnetic buttons return plain
elements. Decorative keyframes are declared inside
`@media (prefers-reduced-motion: no-preference)` so they cannot run at all.

### The hero is canvas, not WebGL

An R3F scene would have cost ~150 KB of JavaScript for the same first
impression and put the LCP budget at risk. `HeroField` is a 2D canvas particle
field advected along a vector field — a few KB, pauses when off-screen or when
the tab is hidden, scales its particle count to viewport area and CPU cores,
and sits on top of a server-rendered gradient poster that paints instantly.

### Nothing is claimed that cannot be stood behind

`scripts/audit-content.mjs` fetches every route and fails on the ™ symbol,
any patent language, stated efficiency/mass/torque/voltage figures, named
turbine OEMs, the CIN (or anything matching its format), the company written as
"Recharga" instead of "Recharga Chargine", missing canonicals or descriptions,
and any page without exactly one `<h1>`. It checks rendered prose, meta tags
and JSON-LD.

`npm run audit:rules` verifies the rules themselves against fixtures — a
silent audit that matches nothing would be worse than no audit.

### Honest schema

JSON-LD builders omit any field they cannot fill truthfully — the postal
address carries city and region until a street address is configured, and no
role is ever invented for a real person.

### Founder pages are built to win their own names

`/team/<name>` is a `ProfilePage` wrapping a `Person` — the type Google
documents for "a page about one person", which asserts that the page *is* that
entity's profile rather than a page mentioning them. Each carries
`givenName`/`familyName`, `jobTitle`, `image`, `worksFor`, `knowsAbout`,
`homeLocation` and a real LinkedIn `sameAs`; a name-first `<title>`; the name
alone as the `<h1>`; a substantial unique body; sitemap priority 0.9; and a
share card carrying the person's photo. See CONTENT-TODO.md for what is left,
which is indexing and off-page signals rather than code.

---

## Project layout

```
app/
  layout.tsx              root shell, fonts, Organization + WebSite schema
  page.tsx                home
  about|technology|team|contact/
  team/[slug]/            founder pages (statically generated)
  opengraph-image.tsx     per-route 1200×630 share cards (next/og)
  sitemap.ts robots.ts manifest.ts
components/
  graphics/               logo, hero canvas, interactive diagrams, icons
    HeroField             2D canvas flux field, pointer + scroll reactive
    MagneticDots          cursor-reactive dot grid used across sections
    FluxExplorer          tabbed diagram morphing radial → axial → hybrid
    PlatformOrbit         interactive orbit: wind / hydro / alternators
    ScaleWall             conceptual "mass climbs with rating" chart
    LicensingFlow         animated three-step circuit
    ArchitectureVisual    conceptual RADAX flux-path render
  home/                   hero, pinned problem→solution, teasers
  motion/                 Lenis+GSAP wiring, reveals, transitions, magnetic
  layout/ shared/ contact/
lib/
  site.ts                 single source of truth for company + founder facts
  schema.ts seo.ts og.tsx contact.ts rate-limit.ts motion.ts
scripts/
  audit-content.mjs       content-rule + SEO audit
```

To change a company fact, edit `lib/site.ts` — pages, footer, schema and
metadata all read from it.

## Design tokens

Defined once in `app/globals.css` under `@theme`, with the brief's own token
names aliased in `:root`. The brand green is sampled from the logo mark:

```
--color-brand: #00FF5E   /* confirm against the source vector */
```

Change that one line and the entire site follows.

One deliberate deviation: the brief specifies `#6B6B73` for muted text, which
measures 3.65:1 on the page background — below the AA 4.5:1 floor the same
brief sets. It is lightened to `#7C7C85` (≈4.6:1), the nearest value that
clears it while still reading as muted.

## Before going live

The code-side work is done. The remaining items are account-level and cannot
be done from the repository:

1. Set `NEXT_PUBLIC_SITE_URL` to the real domain (defaults to
   `https://recharga.vercel.app`).
2. Verify the domain in Google Search Console and Bing Webmaster Tools, and
   submit `/sitemap.xml`.
3. Add the founder portraits (see `CONTENT-TODO.md` §2) and a company
   LinkedIn URL for `NEXT_PUBLIC_ORG_PROFILES`. Both founder LinkedIn
   profiles are already wired in.
4. Configure Resend and confirm a test enquiry arrives.
5. Add 301 redirects from the old site's URLs if paths changed.
6. Claim the Google Business Profile and keep the company name spelled
   identically everywhere — that consistency is what teaches Google the
   canonical form.
