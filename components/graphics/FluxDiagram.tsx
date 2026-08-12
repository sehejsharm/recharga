/**
 * Conceptual flux-path diagrams (§10 D).
 *
 * Textbook cross-sections through a generator, drawn to the same convention
 * in all three variants so the difference reads at a glance: where does the
 * magnetic flux cross the air gap relative to the shaft axis?
 *
 *   radial  — flux crosses perpendicular to the axis
 *   axial   — flux crosses parallel to the axis
 *   hybrid  — both paths, in one machine
 *
 * These are teaching diagrams about generator topology in general. They show
 * no dimensions, no proportions and no internal detail of any specific
 * machine. Pure server-rendered SVG: no JS, visible with or without it.
 */

type Variant = "radial" | "axial" | "hybrid";

const AXIS_Y = 100;

/** Arrowheaded flux line. `dir` is the unit direction the flux travels. */
function FluxArrow({
  x,
  y,
  dx,
  dy,
  length,
  delay,
  className = "text-brand",
}: {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  delay: number;
  className?: string;
}) {
  const x2 = x + dx * length;
  const y2 = y + dy * length;
  // Perpendicular, for the arrowhead's base corners.
  const px = -dy;
  const py = dx;
  const head = 5;

  return (
    <g
      className={`flux-arrow ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <line
        x1={x}
        y1={y}
        x2={x2 - dx * head}
        y2={y2 - dy * head}
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
      />
      <polygon
        points={[
          `${x2},${y2}`,
          `${x2 - dx * head + px * head * 0.55},${y2 - dy * head + py * head * 0.55}`,
          `${x2 - dx * head - px * head * 0.55},${y2 - dy * head - py * head * 0.55}`,
        ].join(" ")}
        fill="currentColor"
      />
    </g>
  );
}

/** Laminated stack / magnet block. */
function Block({
  x,
  y,
  w,
  h,
  tone = "steel",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: "steel" | "magnet";
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={2}
      fill={tone === "magnet" ? "rgba(0,255,94,0.10)" : "rgba(255,255,255,0.045)"}
      stroke={tone === "magnet" ? "rgba(0,255,94,0.5)" : "rgba(255,255,255,0.22)"}
      strokeWidth={1}
    />
  );
}

function Axis() {
  return (
    <g>
      <line
        x1={8}
        y1={AXIS_Y}
        x2={232}
        y2={AXIS_Y}
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="6 5"
        className="text-ink-3"
        opacity={0.7}
      />
      <text
        x={232}
        y={AXIS_Y - 7}
        textAnchor="end"
        className="fill-ink-3 font-mono"
        fontSize={8}
        letterSpacing="0.14em"
      >
        AXIS
      </text>
    </g>
  );
}

export function FluxDiagram({
  variant,
  className,
}: {
  variant: Variant;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 200"
      className={className}
      role="img"
      aria-label={DIAGRAM_ALT[variant]}
    >
      <title>{DIAGRAM_ALT[variant]}</title>
      <Axis />

      {(variant === "radial" || variant === "hybrid") && (
        <>
          {/* Stator stacks, outermost, above and below the axis */}
          <Block x={46} y={34} w={148} h={13} />
          <Block x={46} y={153} w={148} h={13} />
          {/* Rotor with surface magnets, across the radial air gap */}
          <Block x={52} y={58} w={136} h={12} tone="magnet" />
          <Block x={52} y={130} w={136} h={12} tone="magnet" />

          {[70, 100, 130, 160].map((x, i) => (
            <g key={`r-${x}`}>
              <FluxArrow x={x} y={57} dx={0} dy={-1} length={10} delay={i * 220} />
              <FluxArrow
                x={x}
                y={143}
                dx={0}
                dy={1}
                length={10}
                delay={i * 220 + 110}
              />
            </g>
          ))}
        </>
      )}

      {(variant === "axial" || variant === "hybrid") && (
        <>
          {variant === "axial" ? (
            <>
              {/* Two stator discs straddling a rotor disc, seen edge-on */}
              <Block x={62} y={40} w={13} h={120} />
              <Block x={165} y={40} w={13} h={120} />
              <Block x={112} y={46} w={16} h={108} tone="magnet" />

              {[64, 88, 112, 136].map((y, i) => (
                <g key={`a-${y}`}>
                  <FluxArrow
                    x={110}
                    y={y}
                    dx={-1}
                    dy={0}
                    length={31}
                    delay={i * 220}
                  />
                  <FluxArrow
                    x={130}
                    y={y}
                    dx={1}
                    dy={0}
                    length={31}
                    delay={i * 220 + 110}
                  />
                </g>
              ))}
            </>
          ) : (
            <>
              {/* Hybrid: end discs added to the radial stack */}
              <Block x={22} y={52} w={12} h={96} />
              <Block x={206} y={52} w={12} h={96} />

              {[72, 100, 128].map((y, i) => (
                <g key={`h-${y}`}>
                  <FluxArrow
                    x={48}
                    y={y}
                    dx={-1}
                    dy={0}
                    length={13}
                    delay={i * 200 + 60}
                  />
                  <FluxArrow
                    x={192}
                    y={y}
                    dx={1}
                    dy={0}
                    length={13}
                    delay={i * 200 + 160}
                  />
                </g>
              ))}
            </>
          )}
        </>
      )}
    </svg>
  );
}

export const DIAGRAM_ALT: Record<Variant, string> = {
  radial:
    "Cross-section diagram of a radial flux generator: magnetic flux crosses the air gap perpendicular to the shaft axis, between rotor magnets and the surrounding stator.",
  axial:
    "Cross-section diagram of an axial flux generator: magnetic flux crosses the air gap parallel to the shaft axis, between a rotor disc and the stator discs on either side.",
  hybrid:
    "Cross-section diagram of a hybrid axial-radial flux generator: flux crosses the air gap both perpendicular to the shaft axis and along it, using radial and axial paths in one machine.",
};

export const DIAGRAM_COPY: Record<
  Variant,
  { label: string; title: string; body: string }
> = {
  radial: {
    label: "Convention 01",
    title: "Radial flux",
    body: "The workhorse of the industry. Flux crosses the air gap perpendicular to the shaft. It scales predictably, which is exactly why the whole sector standardised on it — and why its limits are now the sector's limits.",
  },
  axial: {
    label: "Convention 02",
    title: "Axial flux",
    body: "Flux crosses the gap along the shaft instead. The geometry is attractive for compact, high-torque machines, but at multi-megawatt scale it brings its own structural problems.",
  },
  hybrid: {
    label: "The RADAX approach",
    title: "Hybrid axial–radial flux",
    body: "RADAX uses both paths in a single direct-drive machine, so more of the available volume does useful magnetic work. The intent is a better balance of torque, mass and cost than either convention reaches alone.",
  },
};
