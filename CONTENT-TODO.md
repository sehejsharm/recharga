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

- Sehej Sharma → `linkedin.com/in/sehej-sharma-5b2151234`
- Ali Electricwala → `linkedin.com/in/ali-electricwala-190821261`

They live in `lib/site.ts` and can still be overridden or extended via
`NEXT_PUBLIC_SEHEJ_PROFILES` / `NEXT_PUBLIC_ALI_PROFILES` (comma-separated).

**Still worth adding:** a company LinkedIn page URL for
`NEXT_PUBLIC_ORG_PROFILES` — that feeds `Organization.sameAs` and does the
same entity-resolution job for the company name.

### Founder bios
- **Current state:** each founder has a short, publishable bio built *strictly*
  from confirmed facts — name, role, company, location, and what they work on.
  No education, employment history, credentials or achievements are claimed
  anywhere, because none were supplied.
- **Where:** `lib/site.ts` → `founders[].bio` (an array of paragraphs).
- **What to add:** background, prior experience, education, anything you want
  public. Longer, more specific bios rank better for name searches — this is
  the cheapest remaining win for "Sehej Sharma" as a query.

### Founder portraits — ⚠️ ACTION NEEDED
The two photos shared in chat arrived as inline images, not files, so they
could not be committed. Everything downstream of them is ready.

**To finish it, two steps:**

1. Save the photos into `public/team/` as:
   - `public/team/sehej-sharma.jpg`
   - `public/team/ali-electricwala.jpg`
2. In `lib/site.ts`, set each founder's `portrait` field:
   ```ts
   portrait: "/team/sehej-sharma.jpg",      // on the Sehej Sharma entry
   portrait: "/team/ali-electricwala.jpg",  // on the Ali Electricwala entry
   ```

Alt text, `next/image` sizing and the `Person.image` schema all wire up
automatically from there. The portrait treatment is already built: photos
render desaturated and cool at rest, then come to full colour with a green
rim-light on hover.

Ideally portrait orientation around 4:5 and at least 1200px on the short edge —
but any reasonable crop works, the frame handles it.

**Current state without them:** a branded placeholder — charcoal frame, green
rim-light, initials, "Portrait pending" label. Never a stock photo of a
different person standing in for a real founder.

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
