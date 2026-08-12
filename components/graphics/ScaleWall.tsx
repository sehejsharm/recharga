/**
 * "Every megawatt adds mass" — the scaling problem, drawn.
 *
 * Bars rise as turbine rating rises, with the curve steepening rather than
 * staying linear. Deliberately **unitless and unlabelled on the vertical
 * axis**: this shows the shape of a well-known industry problem, not a
 * measurement, and it draws no RADAX comparison line — that would imply a
 * validated result we do not publish.
 *
 * Server-rendered SVG. The bars grow via CSS once revealed, so the graphic is
 * complete and readable with no JavaScript at all.
 */

const BARS = [
  { label: "Small", height: 0.2 },
  { label: "Mid", height: 0.34 },
  { label: "Large", height: 0.56 },
  { label: "Multi-MW", height: 0.82 },
  { label: "Next class", height: 1 },
];

const W = 460;
const H = 240;
const FLOOR = 196;
const TOP = 26;
const BAR_W = 46;
const GAP = 26;

export function ScaleWall({ className }: { className?: string }) {
  const startX = (W - (BARS.length * BAR_W + (BARS.length - 1) * GAP)) / 2;

  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-abyss p-2">
        <div
          aria-hidden="true"
          className="glow-brand pointer-events-none absolute -bottom-24 left-1/2 h-64 w-96 -translate-x-1/2 opacity-40"
        />
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="relative w-full"
          role="img"
          aria-label="Conceptual chart: as wind turbine rating increases, conventional generator mass and cost rise faster than linearly. Illustrative only, with no units or measured values."
        >
          {/* Baseline */}
          <line x1={20} y1={FLOOR} x2={W - 20} y2={FLOOR} stroke="#2E2E34" />

          {/* Vertical axis label, deliberately qualitative */}
          <text
            x={20}
            y={TOP - 8}
            fill="#7C7C85"
            fontSize={9}
            letterSpacing="0.16em"
            className="font-mono"
          >
            GENERATOR MASS &amp; COST →
          </text>

          {BARS.map((bar, i) => {
            const x = startX + i * (BAR_W + GAP);
            const full = FLOOR - TOP;
            const h = full * bar.height;
            const isLast = i === BARS.length - 1;
            return (
              <g key={bar.label}>
                {/* Track */}
                <rect
                  x={x}
                  y={TOP}
                  width={BAR_W}
                  height={full}
                  rx={3}
                  fill="rgba(255,255,255,0.022)"
                />
                {/* Bar — grows from the baseline on reveal */}
                <rect
                  className="scale-bar"
                  x={x}
                  y={FLOOR - h}
                  width={BAR_W}
                  height={h}
                  rx={3}
                  fill={isLast ? "rgba(0,255,94,0.20)" : "rgba(255,255,255,0.06)"}
                  stroke={isLast ? "rgba(0,255,94,0.6)" : "#3A3A42"}
                  style={{
                    transformOrigin: `${x + BAR_W / 2}px ${FLOOR}px`,
                    transitionDelay: `${i * 110}ms`,
                  }}
                />
                <text
                  x={x + BAR_W / 2}
                  y={FLOOR + 18}
                  textAnchor="middle"
                  fill={isLast ? "#00FF5E" : "#7C7C85"}
                  fontSize={8.5}
                  letterSpacing="0.12em"
                  className="font-mono"
                >
                  {bar.label.toUpperCase()}
                </text>
              </g>
            );
          })}

          <text
            x={W / 2}
            y={H - 6}
            textAnchor="middle"
            fill="#7C7C85"
            fontSize={8.5}
            letterSpacing="0.16em"
            className="font-mono"
          >
            TURBINE RATING → · CONCEPTUAL, NO UNITS
          </text>
        </svg>
      </div>
    </figure>
  );
}
