/**
 * Custom thin-line icon set (§10 G). One consistent stroke weight, one
 * 24-unit grid, one visual language — no mixed free-icon-pack look.
 * All decorative: callers supply the text label.
 */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
  focusable: "false" as const,
};

/** Direct drive — rotor coupled straight to the hub, no gearbox. */
export function IconDirectDrive({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" />
      <path d="M6 6l2.1 2.1M15.9 15.9L18 18M18 6l-2.1 2.1M8.1 15.9L6 18" />
    </svg>
  );
}

/** Hybrid flux — one ring, two flux paths. */
export function IconHybridFlux({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <ellipse cx="12" cy="9.5" rx="8.5" ry="3.6" />
      <path d="M3.5 9.5v5a8.5 3.6 0 0 0 17 0v-5" />
      <path d="M12 5.9v3.6" />
      <path d="M12 13.1v5.4" />
      <path d="M10.4 16.9L12 18.6l1.6-1.7" />
    </svg>
  );
}

/** Modular — repeatable segments that scale. */
export function IconModular({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <path d="M13.5 17.25h7.5M17.25 13.5v7.5" />
    </svg>
  );
}

/** Licensing — an architecture handed to someone else to build. */
export function IconLicense({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 3.5h9L19.5 9v11.5h-15z" />
      <path d="M13.5 3.5V9h6" />
      <circle cx="10" cy="14" r="2.2" />
      <path d="M12.2 14h4.3M15 14v2" />
    </svg>
  );
}

/** Permanent magnet. */
export function IconMagnet({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 19.5V11a7 7 0 0 1 14 0v8.5" />
      <path d="M5 19.5h4V11a3 3 0 0 1 6 0v8.5h4" />
      <path d="M5 15.5h4M15 15.5h4" />
    </svg>
  );
}

/** Wind / turbine context. */
export function IconWind({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 12V21" />
      <path d="M9.5 21h5" />
      <circle cx="12" cy="12" r="1.6" />
      <path d="M12 10.4V3.5M13.4 12.8l6 3.4M10.6 12.8l-6 3.4" />
    </svg>
  );
}

/** Scale / megawatt class. */
export function IconScale({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 20.5V14M9.5 20.5V9.5M15.5 20.5V6M21.5 20.5V3.5" />
    </svg>
  );
}

/** Efficiency / energy pathway. */
export function IconEnergy({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M13 3.5L5.5 13.5h5l-1 7L17 10.5h-5z" />
    </svg>
  );
}

/** Materials / mass. */
export function IconMass({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 2.8l8.5 4.9v8.6L12 21.2 3.5 16.3V7.7z" />
      <path d="M12 12l8.5-4.3M12 12v9.2M12 12L3.5 7.7" />
    </svg>
  );
}

/** Contact / conversation. */
export function IconMail({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2" />
      <path d="M3.5 6.8l8.5 6 8.5-6" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}
