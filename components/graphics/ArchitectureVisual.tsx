/**
 * Conceptual RADAX architecture visual (§10 C).
 *
 * An abstract annular machine form seen at a three-quarter angle: concentric
 * rings standing in for the radial flux path, an end face standing in for the
 * axial path, and green flux arcs crossing both.
 *
 * This is intentionally diagrammatic, not a render of a real machine. It
 * carries no dimensions, no slot or pole counts that mean anything, and no
 * internal detail — it communicates the *idea* of two flux paths in one
 * direct-drive form and nothing more.
 */

const RX = 196;
const RY = 68;
const CX = 300;
const CY = 196;
const DEPTH = 104;

/** Evenly spaced tick marks around an ellipse — reads as a laminated stack. */
function Ticks({
  rx,
  ry,
  count,
  length,
  opacity,
}: {
  rx: number;
  ry: number;
  count: number;
  length: number;
  opacity: number;
}) {
  return (
    <g stroke="currentColor" strokeWidth={1} opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return (
          <line
            key={i}
            x1={CX + cos * rx}
            y1={CY + sin * ry}
            x2={CX + cos * (rx - length)}
            y2={CY + sin * (ry - length * (ry / rx))}
          />
        );
      })}
    </g>
  );
}

export function ArchitectureVisual({ className }: { className?: string }) {
  const label =
    "Conceptual diagram of the RADAX generator architecture: an annular direct-drive machine form shown at an angle, with concentric rings representing the radial flux path and an end face representing the axial flux path, and flux arcs crossing both.";

  return (
    <svg
      viewBox="0 0 600 420"
      className={className}
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <desc>
        Conceptual illustration only. It does not depict a manufactured
        generator or disclose internal design detail.
      </desc>

      <defs>
        <radialGradient id="radax-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#00FF5E" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#0E9E6E" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#00FF5E" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="radax-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#27272C" />
          <stop offset="100%" stopColor="#161618" />
        </linearGradient>

        <linearGradient id="radax-face" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#1E1E22" />
          <stop offset="100%" stopColor="#111113" />
        </linearGradient>

        <linearGradient id="radax-arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00FF5E" stopOpacity="0" />
          <stop offset="50%" stopColor="#6BFFA3" stopOpacity="1" />
          <stop offset="100%" stopColor="#00FF5E" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Atmosphere */}
      <ellipse
        cx={CX}
        cy={CY + DEPTH / 2}
        rx={280}
        ry={190}
        fill="url(#radax-glow)"
        className="anim-drift"
        style={{ transformOrigin: "center" }}
      />

      {/* Extruded barrel: the axial depth of the machine */}
      <path
        d={`M ${CX - RX} ${CY} L ${CX - RX} ${CY + DEPTH} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CY + DEPTH} L ${CX + RX} ${CY} Z`}
        fill="url(#radax-body)"
        stroke="#2E2E34"
        strokeWidth={1.25}
      />

      {/* Axial flux path: lines running back along the barrel */}
      <g className="text-brand" opacity={0.85}>
        {[-150, -90, -30, 30, 90, 150].map((offset, i) => {
          const x = CX + offset;
          const t = offset / RX;
          const y = CY + Math.sqrt(Math.max(0, 1 - t * t)) * RY;
          return (
            <g
              key={offset}
              className="flux-arrow"
              style={{ animationDelay: `${i * 180}ms` }}
            >
              <line
                x1={x}
                y1={y}
                x2={x}
                y2={y + DEPTH - 12}
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.55}
              />
              <polygon
                points={`${x},${y + DEPTH} ${x - 4},${y + DEPTH - 9} ${x + 4},${y + DEPTH - 9}`}
                fill="currentColor"
              />
            </g>
          );
        })}
      </g>

      {/* End face */}
      <ellipse
        cx={CX}
        cy={CY}
        rx={RX}
        ry={RY}
        fill="url(#radax-face)"
        stroke="#3A3A42"
        strokeWidth={1.25}
      />

      {/* Concentric rings: the radial flux path */}
      <g fill="none" className="text-ink-3">
        <ellipse cx={CX} cy={CY} rx={RX - 16} ry={RY - 5.5} stroke="currentColor" strokeWidth={1} opacity={0.75} />
        <ellipse cx={CX} cy={CY} rx={RX - 44} ry={RY - 15} stroke="currentColor" strokeWidth={1} opacity={0.5} />
        <ellipse cx={CX} cy={CY} rx={RX - 96} ry={RY - 33} stroke="currentColor" strokeWidth={1} opacity={0.38} />
      </g>

      <g className="text-ink-3">
        <Ticks rx={RX - 16} ry={RY - 5.5} count={72} length={12} opacity={0.3} />
      </g>

      {/* Active magnetic ring */}
      <ellipse
        cx={CX}
        cy={CY}
        rx={RX - 28}
        ry={RY - 10}
        fill="none"
        stroke="#00FF5E"
        strokeWidth={1.5}
        opacity={0.5}
        className="anim-pulse"
      />

      {/* Sweeping arc — the rotating field */}
      <ellipse
        cx={CX}
        cy={CY}
        rx={RX - 28}
        ry={RY - 10}
        fill="none"
        stroke="url(#radax-arc)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="150 640"
        className="radax-sweep"
      />

      {/* Radial flux crossing the gap on the visible face */}
      <g className="text-brand">
        {[0.12, 0.3, 0.5, 0.7, 0.88].map((t, i) => {
          const angle = Math.PI + t * Math.PI;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const outer = { x: CX + cos * (RX - 20), y: CY + sin * (RY - 7) };
          const inner = { x: CX + cos * (RX - 92), y: CY + sin * (RY - 32) };
          return (
            <g
              key={t}
              className="flux-arrow"
              style={{ animationDelay: `${i * 240 + 90}ms` }}
            >
              <line
                x1={outer.x}
                y1={outer.y}
                x2={inner.x}
                y2={inner.y}
                stroke="currentColor"
                strokeWidth={1.25}
                strokeLinecap="round"
              />
              <circle cx={inner.x} cy={inner.y} r={2.4} fill="currentColor" />
            </g>
          );
        })}
      </g>

      {/* Bore */}
      <ellipse
        cx={CX}
        cy={CY}
        rx={RX - 132}
        ry={RY - 46}
        fill="#0E0E10"
        stroke="#2E2E34"
        strokeWidth={1}
      />

      {/* Callouts */}
      <g className="fill-ink-3 font-mono" fontSize={10} letterSpacing="0.14em">
        <line
          x1={CX + RX - 40}
          y1={CY - RY + 14}
          x2={CX + RX + 34}
          y2={CY - RY - 26}
          stroke="#2E2E34"
          strokeWidth={1}
        />
        <text x={CX + RX + 40} y={CY - RY - 28}>
          RADIAL PATH
        </text>

        <line
          x1={CX - RX + 26}
          y1={CY + DEPTH - 34}
          x2={CX - RX - 30}
          y2={CY + DEPTH + 26}
          stroke="#2E2E34"
          strokeWidth={1}
        />
        <text x={CX - RX - 36} y={CY + DEPTH + 38} textAnchor="start">
          AXIAL PATH
        </text>
      </g>

      <text
        x={CX}
        y={404}
        textAnchor="middle"
        className="fill-ink-3 font-mono"
        fontSize={9.5}
        letterSpacing="0.16em"
      >
        CONCEPTUAL ILLUSTRATION — NOT TO SCALE
      </text>
    </svg>
  );
}
