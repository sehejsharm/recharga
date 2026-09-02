# Founder input required

Everything on the site today is either a verifiable fact or clearly-marked
design-intent wording. Nothing has been invented. This is the list of things
only you can supply, ordered by how much they matter.

Each item says exactly where it goes, so nothing needs hunting for.

---

## 1. Blocking — the site should not go live without these

### Domain
The whole SEO layer keys off one value.

- **What:** the real production domain.
- **Where:** `NEXT_PUBLIC_SITE_URL` in Vercel env vars.
- **Default in code:** `https://recharga.vercel.app`.
- **Why it matters:** every canonical URL, the sitemap, all Open Graph image
  URLs and every JSON-LD `@id` are built from it. If it is wrong, Google is
  told the canonical version of each page lives somewhere that does not exist.

### Contact form delivery
- **What:** a Resend account, a verified sending domain, and the destination inbox.
- **Where:** `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`.
- **Current behaviour without them:** the form does **not** pretend to succeed.
  In production it returns an error; in development it logs to the console.
  That is deliberate — silently dropping an OEM enquiry is the worst outcome.

### Approved copy
Written from the brief and from confirmed facts, but not yet founder-approved:

| Where | Current wording |
| --- | --- |
| Home H1 | "A new generator architecture for the machines of the next decade." |
| Home sub-line | "Hybrid axial–radial flux. Direct-drive. Built to be licensed by the industry — wind turbines first." |
| `/technology` H1 | "A generator architecture, not a product." |
| `/about` H1 | "The unglamorous part of the energy transition." |
| `/team` H1 | "Two founders, one very specific problem." |
| Founder bios | See §2 below |

Everything is in plain text in the page files (`app/*/page.tsx`) and
`lib/site.ts` — no CMS, no database, just edit and redeploy.

---

## 2. High value — these decide whether founder-name searches work

### Founder profile URLs (`sameAs`) — ✅ DONE
Both LinkedIn URLs are now wired into `Person.sameAs` and rendered as buttons
on each founder page:

- Sehej Sharma → `linkedin.com/in/sehejsharma`
- Ali Electricwala → `linkedin.com/in/ali-electricwala-190821261`

They live in `lib/site.ts` and can still be overridden or extended via
`NEXT_PUBLIC_SEHEJ_PROFILES` / `NEXT_PUBLIC_ALI_PROFILES` (comma-separated).

**Still worth adding:** a company LinkedIn page URL for
`NEXT_PUBLIC_ORG_PROFILES` — that feeds `Organization.sameAs` and does the
same entity-resolution job for the company name.

### Founder bios — expanded, still needs your background
- **Current state:** each founder now has a four-paragraph bio plus four
  "what they work on" cards. Everything is built *strictly* from confirmed
  facts — name, role, company, location, and the responsibilities implied by
  the role. **No education, employment history, credentials, awards or prior
  companies are claimed anywhere**, because none were supplied.
- **Where:** `lib/site.ts` → `founders[].bio` (paragraphs) and
  `founders[].focus` (the cards).
- **What to add:** background, prior experience, education, talks, publications.
  This is the cheapest remaining win for "Sehej Sharma" as a query — a common
  name needs more unique, specific text on the page to outrank namesakes.
  "Ali Electricwala" is distinctive enough that it should rank on indexing
  alone.

### Founder portraits — ✅ DONE
Both photos are pulled from the shared Drive folder and live in the repo:

- `public/team/sehej-sharma.png`
- `public/team/ali-electricwala.png`

They are wired to `founders[].portrait` in `lib/site.ts`, and flow through to
`next/image`, the `Person.image` schema and the share cards automatically.

**Treatment:** on `/team` the cards are graded — desaturated at rest, full
colour on hover. On each founder's own profile page the photo is shown in full
colour at full size, because that page is their identity page.

### Aditya Mishra — ⚠️ NEEDS A DECISION
The Drive folder also contained `Aditya Mishra Image.png`. It has been saved to
`public/team/aditya-mishra.png` but **is not on the site anywhere**, because no
role or bio was supplied for him and inventing a job title for a real person is
not something to guess at.

To add him, send his **role/title** and any bio you want public, and he can be
added to `founders` in `lib/site.ts` (rename it to `team` if he is not a
founder). Everything else — the card, the profile page at
`/team/aditya-mishra`, the Person schema, the share card, the sitemap entry —
generates from that one entry automatically.

### Registered address
- **What:** the full registered office address and postal code.
- **Where:** `NEXT_PUBLIC_STREET_ADDRESS`, `NEXT_PUBLIC_POSTAL_CODE`.
- **Current state:** schema and the rendered address show Jaipur, Rajasthan,
  India — verifiable today. Street-level detail appears automatically once set,
  and strengthens the LocalBusiness entity for local search.

### Public contact email
- **Where:** `NEXT_PUBLIC_CONTACT_EMAIL`.
- **Current state:** the email line is omitted from the footer and contact page
  rather than showing a placeholder address that might bounce.

---

## 3. Brand asset

### Logo source file
- **Current state:** the mark in `public/logo.svg`, `public/logo-white.svg`,
  `app/icon.svg` and `components/graphics/Logo.tsx` was **traced by hand** from
  the raster artwork supplied. It matches closely, but it is a reconstruction.
- **Brand green:** sampled as `#00FF5E`. **Please confirm the exact hex from
  your source file.** If it differs, change one line —
  `--color-brand` in `app/globals.css` — and the entire site follows.
- **What to supply:** the original vector (AI/SVG/EPS). Geometry lives in only
  those four places, and the PNG app icons regenerate from `app/icon.svg`.

---

## 4. How much technical detail is public?

`/technology` describes the architecture at the level the brief allows: hybrid
axial–radial flux, direct-drive, permanent-magnet, modular, licensed to
manufacturers. It states design *intent*, never validated results, and says so
explicitly on the page.

RADAX is framed throughout as **a generator architecture, not a single machine
rating** — wind is named as the first application rather than the limit of it.
No specific power class is quoted anywhere.

It contains **no** performance figures, **no** patent language, **no** ™, **no**
CIN and **no** named OEMs — all enforced mechanically by
`npm run audit:content` (see below).

If more can be published — approved renders, CAD imagery, a qualitative
comparison — that section can go considerably deeper. The conceptual diagrams
are custom SVG and easy to replace with real renders when they exist.

---

## 5. Analytics and search consoles

- Google Search Console + Bing Webmaster Tools verification tokens →
  `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
- GA4 and Vercel Analytics are **not** installed yet — say the word and they
  go in, but they add third-party script weight, so they were left out of the
  initial performance budget rather than added speculatively.

---

## 6. Old site redirects

If the domain or URL structure is changing, send the list of old URLs and
301 redirects go into `next.config.ts`. Without them, whatever authority the
old site accumulated is lost.

---

## The content rules are enforced in code

`scripts/audit-content.mjs` fetches every page and fails on:

- the ™ symbol anywhere
- any patent / patent-pending / patent-number language
- stated efficiency percentages, mass, torque or voltage figures
- named turbine OEMs
- the CIN, or any string matching the CIN format
- the company written as "Recharga" instead of "Recharga Chargine"
- missing canonical, missing meta description, or anything other than exactly one `<h1>`

```bash
npm run audit:content   # against a running server
npm run audit:rules     # proves the rules still catch what they should
```

Run it before every deploy. It is the safety net for the one category of
mistake that would actually cost you credibility.

---

## Winning founder-name searches — what is now in place

Everything code can do for "Sehej Sharma" and "Ali Electricwala" as queries:

- **A dedicated page each** at `/team/<name>`, statically prerendered.
- **`ProfilePage` schema** wrapping a `Person` — this is the type Google
  documents for "a page about one person", and it says *this page is the
  profile for that entity*, not just a page mentioning them.
- **`Person` schema** with `givenName`, `familyName`, `jobTitle`, `image`,
  `worksFor`, `knowsAbout`, `homeLocation` and `sameAs` → the real LinkedIn URL.
  `sameAs` is what ties the search query to this page as the same person.
- **Title leading with the bare name** — "Sehej Sharma — Founder & CEO".
- **`<h1>` is the name alone**, once per page.
- **A substantial, unique body** — four bio paragraphs plus four focus cards.
  Thin pages do not rank for personal names; this gives Google something real.
- **A share card carrying their photo**, so links posted to LinkedIn or
  WhatsApp render as a proper profile card.
- **Internal links** from the home page, `/about`, `/team`, the footer and each
  other's profile — all with the person's name as the anchor text.
- **Sitemap priority 0.9**, above every page except the homepage.
- **Breadcrumbs** (`Home / Team / Name`) in markup and schema.

### What code cannot do
Ranking still needs indexing and off-page signals:

1. Verify the domain in Google Search Console and submit `/sitemap.xml`.
   Nothing ranks before it is indexed — this is the step that matters most.
2. Each founder's LinkedIn profile should link back to the site, and ideally
   to their own `/team/<name>` page. Reciprocal links are what confirm the
   `sameAs` relationship.
3. Keep the name spelled identically everywhere — site, LinkedIn, Crunchbase,
   any press. Consistency is what teaches Google the canonical entity.

Realistically: "Ali Electricwala" is distinctive and near-uncontested, so it
should rank within weeks of indexing. "Sehej Sharma" is a more common name and
will take longer — more unique text on the page and more inbound links are what
move it.
