import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Grain } from "@/components/graphics/Grain";
import SmoothScroll from "@/components/motion/SmoothScroll";
import { PageTransition } from "@/components/motion/PageTransition";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { graph, organizationSchema, websiteSchema } from "@/lib/schema";
import { jsonLd } from "@/lib/seo";
import { SITE_URL, company } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Recharga Chargine — the RADAX generator architecture",
    template: `%s | ${company.shortName}`,
  },
  description:
    "Recharga Chargine is a DPIIT-recognised deep-tech clean-energy company in Jaipur, India, developing the RADAX Generator — a hybrid axial-radial flux, direct-drive architecture licensed to wind turbine OEMs.",
  applicationName: company.shortName,
  authors: [{ name: company.legalName, url: SITE_URL }],
  creator: company.legalName,
  publisher: company.legalName,
  category: "technology",
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/" },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : {},
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0E10",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const siteGraph = graph([organizationSchema(), websiteSchema()]);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas text-ink antialiased">
        {/* Gates every scroll reveal. Runs synchronously before the rest of
            the body is parsed, so there is no flash of pre-animation state —
            and if it never runs, all content simply renders visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion-ok')}}catch(e){}",
          }}
        />

        <script
          type="application/ld+json"
          // Site-wide entity graph. Values are built from a typed source of
          // truth, never from user input.
          dangerouslySetInnerHTML={{ __html: jsonLd(siteGraph) }}
        />

        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-[#04140a]"
        >
          Skip to content
        </a>

        <SmoothScroll />
        <RevealObserver />
        <Grain />
        <SiteHeader />

        <main id="main" className="relative">
          <PageTransition>{children}</PageTransition>
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
