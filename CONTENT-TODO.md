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
- **Default in code:** `https://recharga.in`.
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
| Home H1 | "A new generator architecture for the wind turbines of the next decade." |
| Home sub-line | "Hybrid axial–radial flux. Direct-drive. Built to be licensed by the industry." |
| `/technology` | Full problem → solution → architecture → licensing narrative |
| `/about` | Mission, approach, platform vision (wind → hydro → hybrid-vehicle alternators) |
| Founder bios | See §2 below |

Everything is in plain text in the page files (`app/*/page.tsx`) and
`lib/site.ts` — no CMS, no database, just edit and redeploy.

---

## 2. High value — these decide whether founder-name searches work

### Founder profile URLs (`sameAs`)
This is the single highest-leverage SEO item on the whole list.

- **What:** each founder's real LinkedIn URL, plus any other authoritative
  profile (Crunchbase, an X account, a university or publication page).
- **Where:** `NEXT_PUBLIC_SEHEJ_PROFILES`, `NEXT_PUBLIC_ALI_PROFILES`,
  `NEXT_PUBLIC_ORG_PROFILES` — comma-separated absolute URLs.
- **Why it matters:** `Person.sameAs` is how Google connects
  "Ali Electricwala" the search query to this site as the same entity. Without
  it, the founder pages are just pages with a name on them. With it, they are
  the authoritative record.
- **Deliberately left empty:** guessed profile URLs actively harm entity
  resolution, so the schema omits the field rather than inventing one.

### Founder bios
- **Current state:** each founder has a real, publishable three-paragraph bio
  built *strictly* from confirmed facts — name, role, company, location, and
  what they work on. No education, no employment history, no credentials, no
  achievements are claimed anywhere, because none were supplied.
- **Where:** `lib/site.ts` → `founders[].bio`.
- **What to add:** background, prior experience, education, and anything else
  you want public. Longer, more specific bios rank better for name searches.
- **Optional:** `founders[].quote` renders a pull-quote on the founder page; it
  is `null` and hidden until you write one.

### Founder portraits
- **Current state:** a branded placeholder — charcoal frame, green rim-light,
  initials, and a "Portrait pending" label. It reads as intentional.
- **Never used:** a stock photo of a different person standing in for a real
  founder.
- **What to supply:** two high-resolution portraits, same treatment for both —
  dark/charcoal background, controlled lighting, subtle green rim-light, same
  crop and mood. Portrait orientation, 4:5, ideally 1600×2000 or larger.
- **Where:** drop into `public/team/`, then set `founders[].portrait` in
  `lib/site.ts` to e.g. `/team/sehej-sharma.jpg`. Alt text and `Person.image`
  schema wire up automatically.

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

`/technology` currently describes the architecture at the level the brief
allows: hybrid axial–radial flux, direct-drive, permanent-magnet, modular,
3 MW-class, licensed to OEMs. It states design *intent*, never validated
results, and it says so explicitly on the page.

It contains **no** performance figures, **no** patent language, **no** ™, and
**no** named OEMs — enforced mechanically by `npm run audit:content`, which
fails the check if any of those appear (see below).

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
- missing canonical, missing meta description, or anything other than exactly one `<h1>`

```bash
npm run audit:content          # against a running server
node scripts/audit-content.mjs --self-test   # proves the rules still catch what they should
```

Run it before every deploy. It is the safety net for the one category of
mistake that would actually cost you credibility.
