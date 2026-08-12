import Image from "next/image";
import type { Founder } from "@/lib/site";

/**
 * Founder portrait.
 *
 * Real photography goes in /public/team and is set on the founder record.
 * Until it exists we render a branded placeholder — a charcoal frame with a
 * green rim-light and the founder's initials. Deliberately *not* a stock
 * face: no photograph of another person may ever stand in for a real founder.
 */
export function PortraitFrame({
  founder,
  priority = false,
  className,
  sizes = "(min-width: 1024px) 34rem, 100vw",
}: {
  founder: Founder;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const initials = founder.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div
      className={`portrait-frame group/portrait relative aspect-[4/5] overflow-hidden rounded-2xl border border-hairline bg-surface-1 ${className ?? ""}`}
    >
      {founder.portrait ? (
        <Image
          src={founder.portrait}
          alt={`${founder.name}, ${founder.role} of Recharga Chargine Pvt. Ltd.`}
          fill
          sizes={sizes}
          priority={priority}
          className="portrait-img object-cover"
        />
      ) : (
        <div className="absolute inset-0">
          <div
            aria-hidden="true"
            className="glow-brand absolute -right-1/4 top-1/4 h-3/4 w-3/4 opacity-40"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 400 500"
            className="absolute inset-0 h-full w-full"
          >
            {/* Abstract shoulders-and-head silhouette, not a likeness */}
            <circle cx="200" cy="196" r="72" fill="rgba(255,255,255,0.045)" />
            <path
              d="M64 500c0-84 61-142 136-142s136 58 136 142z"
              fill="rgba(255,255,255,0.045)"
            />
            <circle
              cx="200"
              cy="196"
              r="72"
              fill="none"
              stroke="rgba(0,255,94,0.32)"
              strokeWidth="1.25"
            />
            <path
              d="M64 500c0-84 61-142 136-142s136 58 136 142"
              fill="none"
              stroke="rgba(0,255,94,0.32)"
              strokeWidth="1.25"
            />
          </svg>
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-5xl tracking-[-0.03em] text-ink/80"
          >
            {initials}
          </span>
          <span className="sr-only">
            Portrait of {founder.name} — photograph pending.
          </span>
          <span className="absolute inset-x-0 bottom-0 border-t border-hairline bg-abyss/70 px-4 py-2.5 text-center font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-3 backdrop-blur-sm">
            Portrait pending
          </span>
        </div>
      )}

      {/* Green rim-light and floor shadow, tying photography to the brand. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-transparent opacity-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[linear-gradient(to_left,rgba(0,255,94,0.16),transparent)] opacity-0 transition-opacity duration-700 group-hover/portrait:opacity-100"
        style={{ transitionTimingFunction: "var(--ease-signature)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04]"
      />
    </div>
  );
}
