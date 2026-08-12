import Link from "next/link";
import { HeroField } from "@/components/graphics/HeroField";
import { IconArrowRight } from "@/components/graphics/Icons";

/**
 * Hero (§5.1). The heading, sub-line and CTAs are plain server-rendered
 * markup with CSS-only entrance animation, so the first paint is complete
 * and readable before any JavaScript arrives. The canvas layers on top.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden pt-[var(--header-h)]">
      {/* Static poster — this is what paints first and what remains under
          reduced motion or if the canvas never starts. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-abyss">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_38%_45%,rgba(0,255,94,0.10),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_72%_62%,rgba(14,158,110,0.14),transparent_65%)]" />
        <div className="grid-motif absolute inset-0 opacity-[0.35]" />
      </div>

      <HeroField className="absolute inset-0 -z-10 h-full w-full opacity-0 mix-blend-screen" />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-b from-transparent to-canvas"
      />

      <div className="shell relative w-full py-20">
        <div className="max-w-[52rem]">
          <p className="eyebrow rise-in" style={{ animationDelay: "40ms" }}>
            Recharga Chargine · Jaipur, India
          </p>

          <h1
            className="display-1 rise-in mt-7 text-ink"
            style={{ animationDelay: "120ms" }}
          >
            A new{" "}
            <span className="text-gradient-brand">generator architecture</span>{" "}
            for the machines of the next decade.
          </h1>

          <p
            className="lede rise-in mt-8 max-w-2xl"
            style={{ animationDelay: "240ms" }}
          >
            Hybrid axial–radial flux. Direct-drive. Built to be licensed by the
            industry — wind turbines first.
          </p>

          <div
            className="rise-in mt-11 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "340ms" }}
          >
            <Link href="/technology" className="btn-primary group">
              Explore the technology
              <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/contact" className="btn-ghost">
              Start a conversation
            </Link>
          </div>

          <dl
            className="rise-in mt-16 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 border-t border-hairline pt-8 sm:grid-cols-3"
            style={{ animationDelay: "440ms" }}
          >
            {[
              { term: "Architecture", detail: "Hybrid axial–radial flux" },
              { term: "Drivetrain", detail: "Direct-drive, permanent magnet" },
              { term: "Model", detail: "Licensed to manufacturers" },
            ].map((item) => (
              <div key={item.term}>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-3">
                  {item.term}
                </dt>
                <dd className="mt-2 text-sm leading-snug text-ink">
                  {item.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <span className="anim-pulse block h-12 w-px bg-gradient-to-b from-transparent via-brand to-transparent" />
      </div>
    </section>
  );
}
