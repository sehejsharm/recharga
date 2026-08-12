/**
 * Film-grain overlay (§10 H). A single inline SVG turbulence tile, rendered as
 * a data URI so it costs no request and no JavaScript. Very low opacity —
 * it should read as texture on the graphite, never as noise.
 */
const GRAIN = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="160" height="160" filter="url(#n)" opacity="0.55"/></svg>`;

export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(GRAIN)}")`,
        backgroundSize: "160px 160px",
      }}
    />
  );
}
