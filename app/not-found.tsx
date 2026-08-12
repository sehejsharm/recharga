import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/graphics/Logo";
import { IconArrowRight } from "@/components/graphics/Icons";
import { nav } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page doesn't exist. Explore the RADAX generator architecture, the company, or get in touch with Recharga.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden pt-[var(--header-h)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_35%,rgba(0,255,94,0.07),transparent_65%)]" />
        <div className="grid-motif absolute inset-0 opacity-30" />
      </div>

      <div className="shell py-24 text-center">
        <LogoMark className="anim-pulse mx-auto h-12 w-12 text-brand" />

        <p className="eyebrow mt-10 justify-center">Error 404</p>

        <h1 className="display-2 mx-auto mt-6 max-w-2xl text-ink">
          This page went off the grid.
        </h1>

        <p className="lede mx-auto mt-7 max-w-lg">
          The link may be out of date, or the page may have moved. Everything
          else is still here.
        </p>

        <nav
          aria-label="Suggested pages"
          className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-3"
        >
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="btn-ghost !px-5 !py-2.5 !text-sm">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10">
          <Link href="/" className="btn-primary group">
            Back to home
            <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
