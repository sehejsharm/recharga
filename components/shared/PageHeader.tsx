import Link from "next/link";
import type { ReactNode } from "react";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="rise-in">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-3">
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="text-ink-2">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.path}
                    className="transition-colors duration-300 hover:text-brand"
                  >
                    {crumb.name}
                  </Link>
                  <span aria-hidden="true" className="text-hairline">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Shared inner-page masthead. Entrances are CSS-only so above-the-fold
 * content never waits on hydration.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  trail,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  trail?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-hairline pt-[var(--header-h)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_20%_0%,rgba(0,255,94,0.07),transparent_60%)]" />
        <div className="grid-motif absolute inset-0 opacity-25" />
      </div>

      <div className="shell py-20 lg:py-28">
        {trail && <Breadcrumbs trail={trail} />}

        <p
          className="eyebrow rise-in mt-8"
          style={{ animationDelay: "60ms" }}
        >
          {eyebrow}
        </p>

        <h1
          className="display-1 rise-in mt-6 max-w-4xl text-ink"
          style={{ animationDelay: "130ms" }}
        >
          {title}
        </h1>

        {lede && (
          <p
            className="lede rise-in mt-8 max-w-2xl"
            style={{ animationDelay: "230ms" }}
          >
            {lede}
          </p>
        )}

        {children && (
          <div className="rise-in mt-10" style={{ animationDelay: "320ms" }}>
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
