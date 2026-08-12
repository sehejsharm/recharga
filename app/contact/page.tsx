import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { IconLicense, IconMail, IconWind } from "@/components/graphics/Icons";
import { MagneticDots } from "@/components/graphics/MagneticDots";
import { Reveal } from "@/components/motion/Reveal";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  breadcrumbSchema,
  graph,
  localBusinessSchema,
  webPageSchema,
} from "@/lib/schema";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { company, company_address_line } from "@/lib/site";

const TITLE = "Contact Recharga Chargine — OEM and investor enquiries";
const DESCRIPTION =
  "Get in touch with Recharga Chargine Pvt. Ltd. in Jaipur, India about licensing the RADAX generator architecture, investment, or press enquiries.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/contact",
  keywords: [
    "contact Recharga Chargine",
    "Recharga Chargine contact",
    "RADAX Generator licensing",
    "wind turbine generator licensing enquiry",
  ],
});

const AUDIENCES = [
  {
    Icon: IconWind,
    title: "Turbine manufacturers",
    body: "If you're evaluating generator technology for a platform, we'll get you to an engineering conversation quickly.",
  },
  {
    Icon: IconLicense,
    title: "Investors",
    body: "We're happy to walk through the architecture, the licensing model and where the programme currently stands.",
  },
  {
    Icon: IconMail,
    title: "Press and everyone else",
    body: "Writing about wind technology, or just curious what a hybrid flux machine actually is? Ask away.",
  },
];

export default function ContactPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            graph([
              webPageSchema({
                path: "/contact",
                name: TITLE,
                description: DESCRIPTION,
              }),
              localBusinessSchema(),
              breadcrumbSchema(trail),
            ]),
          ),
        }}
      />

      <PageHeader
        eyebrow="Contact"
        title={
          <>
            For OEMs, investors and partners —{" "}
            <span className="text-gradient-brand">let&rsquo;s talk</span>.
          </>
        }
        lede="Tell us a little about who you are and what you're working on. Messages reach the founders directly, and we reply personally."
        trail={trail}
      />

      <section aria-labelledby="form-heading" className="relative section">
        <MagneticDots
          className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
          spacing={40}
        />
        <div className="shell relative">
          <div className="grid gap-14 lg:grid-cols-[1fr_0.72fr] lg:gap-20">
            <div>
              <h2 id="form-heading" className="sr-only">
                Contact form
              </h2>
              <Reveal>
                <div className="panel p-7 sm:p-9">
                  <ContactForm />
                </div>
              </Reveal>
            </div>

            <div className="space-y-12">
              <Reveal delay={0.08}>
                <div>
                  <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-3">
                    Who gets in touch
                  </h2>
                  <ul className="mt-6 space-y-px">
                    {AUDIENCES.map(({ Icon, title, body }) => (
                      <li
                        key={title}
                        className="flex gap-4 border-t border-hairline py-5 last:border-b"
                      >
                        <Icon className="mt-0.5 h-5 w-5 flex-none text-brand" />
                        <div>
                          <h3 className="font-display text-[0.9375rem] font-medium text-ink">
                            {title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                            {body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.14}>
                <div className="panel p-7">
                  <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-3">
                    Company
                  </h2>
                  <address className="mt-5 space-y-2.5 text-sm not-italic leading-relaxed text-ink-2">
                    <span className="block font-display text-base tracking-[-0.02em] text-ink">
                      {company.legalName}
                    </span>
                    <span className="block">{company_address_line}</span>
                    {company.email && (
                      <a
                        href={`mailto:${company.email}`}
                        className="link-draw inline-block !text-brand"
                      >
                        {company.email}
                      </a>
                    )}
                  </address>

                  <p className="mt-6 border-t border-hairline pt-5 text-xs leading-relaxed text-ink-3">
                    {company.recognition}.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
