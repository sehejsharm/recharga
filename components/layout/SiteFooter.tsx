import Link from "next/link";
import { LogoMark } from "@/components/graphics/Logo";
import { company, company_address_line, founders, nav } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-hairline bg-abyss">
      <div className="shell py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" aria-label="Recharga Chargine — home" className="inline-flex">
              <LogoMark className="h-9 w-9 text-brand" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-2">
              A new generator architecture — built to be licensed by the
              industry. Wind turbines first.
            </p>
            <p className="eyebrow mt-6">DPIIT-recognised</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-3">
              Explore
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw text-ink-2 hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Leadership">
            <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-3">
              Leadership
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {founders.map((founder) => (
                <li key={founder.slug}>
                  <Link
                    href={`/team/${founder.slug}`}
                    className="link-draw text-ink-2 hover:text-brand"
                  >
                    {founder.name}
                  </Link>
                  <span className="mt-0.5 block text-xs text-ink-3">
                    {founder.role}
                  </span>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-3">
              Company
            </h2>
            <address className="mt-5 space-y-2 text-sm not-italic leading-relaxed text-ink-2">
              <span className="block text-ink">{company.legalName}</span>
              <span className="block">{company_address_line}</span>
              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="link-draw inline-block !text-ink-2 hover:!text-brand"
                >
                  {company.email}
                </a>
              )}
            </address>
          </div>
        </div>

        <hr className="rule my-12" />

        <div className="flex flex-col gap-4 text-xs text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. All rights reserved.
          </p>
          <p>
            {company.locality}, {company.region}, {company.country}
          </p>
        </div>
      </div>
    </footer>
  );
}
