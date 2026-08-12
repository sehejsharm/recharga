/**
 * Content-rule audit (§2 of the brand brief).
 *
 * Fetches every route and fails on anything the site is not allowed to say.
 * Run against a running server:  node scripts/audit-content.mjs http://localhost:3000
 *
 * This exists because these rules are legal/credibility constraints, not
 * style preferences — they need to be enforced mechanically, not remembered.
 */

const arg = process.argv[2] ?? "http://localhost:3000";
const SELF_TEST = arg === "--self-test";
const base = arg.replace(/\/+$/, "");

const ROUTES = [
  "/",
  "/about",
  "/technology",
  "/team",
  "/team/sehej-sharma",
  "/team/ali-electricwala",
  "/contact",
];

/** Named turbine OEMs that must never appear as customers or partners. */
const OEM_NAMES = [
  "vestas",
  "siemens gamesa",
  "goldwind",
  "envision",
  "mingyang",
  "nordex",
  "enercon",
  "suzlon",
  "ge vernova",
  "ge renewable",
];

const RULES = [
  {
    id: "trademark-symbol",
    why: "The ™ symbol must never appear on RADAX or anywhere else.",
    test: /™|&trade;|™/i,
  },
  {
    id: "patent-language",
    why: "No patent, patent-pending or patent-number language of any kind.",
    test: /\bpatent(ed|s|able)?\b|\bpatent[- ]pending\b|\bIPR\s*filed\b/i,
  },
  {
    id: "efficiency-claim",
    why: "No stated efficiency percentage — implies a validated machine.",
    test: /\b\d{1,3}(\.\d+)?\s*%\s*(efficien|effizien)/i,
  },
  {
    id: "mass-claim",
    why: "No stated machine mass or weight figure.",
    test: /\b\d[\d,.]*\s*(kg|kilograms?|tonnes?|tons?|t)\b(?![a-z])/i,
  },
  {
    id: "torque-density-claim",
    why: "No stated torque or torque-density figure.",
    test: /\b\d[\d,.]*\s*(nm|kn·?m|knm|newton[- ]met(re|er)s?)\b/i,
  },
  {
    id: "voltage-claim",
    why: "No stated voltage or back-EMF figure.",
    test: /\b\d[\d,.]*\s*(v|kv|volts?|kilovolts?)\b(?![a-z])|\bback[- ]?emf\s*(of|=|:)?\s*\d/i,
  },
  {
    id: "named-oem",
    why: "No named turbine OEM presented as a customer or partner.",
    test: new RegExp(`\\b(${OEM_NAMES.join("|")})\\b`, "i"),
  },
];

/**
 * Fixtures proving each rule fires on the thing it targets, and that the
 * wording we *are* allowed to use stays clean. A silent audit that matches
 * nothing is worse than no audit at all.
 */
const SELF_TEST_CASES = {
  banned: [
    ["RADAX™ Generator", "trademark-symbol"],
    ["our patented topology", "patent-language"],
    ["patent pending in India", "patent-language"],
    ["a patent application covering the rotor", "patent-language"],
    ["achieves 97.4% efficiency at rated power", "efficiency-claim"],
    ["the machine weighs 42,000 kg", "mass-claim"],
    ["a nacelle mass of 68 tonnes", "mass-claim"],
    ["delivers 2,400 kNm of torque", "torque-density-claim"],
    ["rated at 690 V", "voltage-claim"],
    ["back-EMF of 480 volts", "voltage-claim"],
    ["our partner Vestas", "named-oem"],
    ["in production with Siemens Gamesa", "named-oem"],
  ],
  allowed: [
    "engineered for multi-megawatt (3 MW-class) wind turbines",
    "hybrid axial-radial flux, direct-drive, permanent-magnet",
    "DPIIT-recognised startup under Startup India",
    "Recharga Chargine Pvt. Ltd., CIN U29304RJ2023PTC086778",
    "designed for higher power density",
    "targeting a better balance of weight, efficiency and cost",
    "Jaipur, Rajasthan, India",
    "Sehej Sharma, Founder & CEO",
  ],
};

function runSelfTest() {
  let bad = 0;
  const firstMatch = (text) => RULES.find((rule) => rule.test.test(text))?.id;

  for (const [text, expected] of SELF_TEST_CASES.banned) {
    const got = firstMatch(text) ?? "NONE";
    if (got === expected) {
      console.log(`✓ catches ${expected.padEnd(22)} "${text}"`);
    } else {
      console.error(`✗ expected ${expected}, got ${got} — "${text}"`);
      bad++;
    }
  }

  for (const text of SELF_TEST_CASES.allowed) {
    const got = firstMatch(text);
    if (got) {
      console.error(`✗ false positive (${got}) on allowed copy — "${text}"`);
      bad++;
    } else {
      console.log(`✓ allows  ${"".padEnd(22)} "${text}"`);
    }
  }

  if (bad > 0) {
    console.error(`\n${bad} rule(s) not behaving as intended.`);
    process.exit(1);
  }
  console.log("\nAll content rules verified against fixtures.");
  process.exit(0);
}

if (SELF_TEST) runSelfTest();

/** Strip scripts, styles and tags so we test rendered prose, not markup. */
function toText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
}

/** JSON-LD is user-visible to search engines, so it gets audited too. */
function jsonLdBlocks(html) {
  return [
    ...html.matchAll(
      /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((m) => m[1]);
}

function metaContent(html) {
  return [...html.matchAll(/<meta[^>]+content="([^"]*)"/gi)]
    .map((m) => m[1])
    .join(" ");
}

let failures = 0;
let checked = 0;

for (const route of ROUTES) {
  const res = await fetch(`${base}${route}`);
  if (!res.ok) {
    console.error(`✗ ${route} → HTTP ${res.status}`);
    failures++;
    continue;
  }

  const html = await res.text();
  const haystacks = [
    ["prose", toText(html)],
    ["meta", metaContent(html)],
    ["json-ld", jsonLdBlocks(html).join(" ")],
  ];

  let routeFailures = 0;
  for (const rule of RULES) {
    for (const [where, text] of haystacks) {
      const match = text.match(rule.test);
      if (!match) continue;
      const at = Math.max(0, match.index - 60);
      console.error(
        `✗ ${route} [${where}] ${rule.id}\n    ${rule.why}\n    …${text.slice(at, match.index + match[0].length + 60).trim()}…`,
      );
      routeFailures++;
      failures++;
    }
    checked++;
  }

  // Structural SEO invariants worth failing the build over.
  const h1s = [...html.matchAll(/<h1[\s>]/gi)].length;
  if (h1s !== 1) {
    console.error(`✗ ${route} has ${h1s} <h1> elements (expected exactly 1)`);
    failures++;
  }
  if (!/rel="canonical"/i.test(html)) {
    console.error(`✗ ${route} is missing a canonical link`);
    failures++;
  }
  if (!/<meta name="description"/i.test(html)) {
    console.error(`✗ ${route} is missing a meta description`);
    failures++;
  }

  if (routeFailures === 0) console.log(`✓ ${route}`);
}

console.log(`\n${checked} rule checks across ${ROUTES.length} routes.`);
if (failures > 0) {
  console.error(`\n${failures} violation(s) found.`);
  process.exit(1);
}
console.log("No content-rule violations.");
