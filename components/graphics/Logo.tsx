/**
 * The Recharga Chargine mark: plug head, two prongs, and a bolt cutting through.
 *
 * Vector traced from the supplied brand artwork. Swap in the official source
 * SVG when it is available (see CONTENT-TODO.md) — geometry lives only here
 * and in /public/logo*.svg.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        <path d="M212 116 A99 99 0 1 0 384 208 Z" />
        <path d="M240 232 L118 341 L203 347 L137 452 L293 314 L231 306 Z" />
      </g>
      <g
        stroke="currentColor"
        strokeWidth={22}
        strokeLinecap="round"
        fill="none"
      >
        <path d="M256 132 L293 63" />
        <path d="M351 183 L388 113" />
      </g>
    </svg>
  );
}

/** Mark plus wordmark, set in the display face. */
export function Logo({
  className,
  markClassName = "text-brand",
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className={`h-7 w-7 shrink-0 ${markClassName}`} />
      <span className="font-display text-[1.0625rem] font-medium leading-none tracking-[-0.02em] text-ink">
        Recharga{" "}
        <span className="text-ink-2">Chargine</span>
      </span>
    </span>
  );
}
