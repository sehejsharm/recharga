"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Interactive flux-path explorer.
 *
 * One cross-section through a generator that morphs between the three
 * topologies, so the difference is a change you watch rather than three
 * pictures you compare:
 *
 *   radial — flux crosses the air gap perpendicular to the shaft
 *   axial  — flux crosses it along the shaft
 *   hybrid — both paths, in one machine
 *
 * Teaching diagram about generator topology in general. No dimensions, no
 * proportions, no internal detail of any specific machine.
 *
 * Tabs are real buttons in a tablist, so it is keyboard and screen-reader
 * operable; a description of each mode is announced on change. Without JS the
 * hybrid view renders with all three descriptions present in the HTML.
 */

type Mode = "radial" | "axial" | "hybrid";

const MODES: {
  id: Mode;
  label: string;
  headline: string;
  body: string;
}[] = [
  {
    id: "radial",
    label: "Radial",
    headline: "The industry standard",
    body: "Flux crosses the gap perpendicular to the shaft. Predictable to scale — which is why the sector standardised on it, and why its limits are now the sector's limits.",
  },
  {
    id: "axial",
    label: "Axial",
    headline: "Compact, but awkward at scale",
    body: "Flux crosses along the shaft instead. Attractive for high-torque machines in a short envelope, with its own structural problems as diameter grows.",
  },
  {
    id: "hybrid",
    label: "RADAX hybrid",
    headline: "Both paths, one machine",
    body: "RADAX works radial and axial together, so more of the volume inside the envelope does useful magnetic work.",
  },
];

const AXIS_Y = 150;

export function FluxExplorer({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("hybrid");
  const [auto, setAuto] = useState(true);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Cycle gently until the visitor takes control, so the graphic is alive
  // rather than waiting to be discovered.
  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setMode((current) => {
        const i = MODES.findIndex((m) => m.id === current);
        return MODES[(i + 1) % MODES.length].id;
      });
    }, 3800);
    return () => clearInterval(id);
  }, [auto]);

  const choose = (next: Mode) => {
    setAuto(false);
    setMode(next);
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const delta =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + MODES.length) % MODES.length;
    choose(MODES[next].id);
    tabsRef.current[next]?.focus();
  };

  const showRadial = mode === "radial" || mode === "hybrid";
  const showAxial = mode === "axial" || mode === "hybrid";
  const active = MODES.find((m) => m.id === mode)!;

  return (
    <div className={className} data-mode={mode}>
      <div
        role="tablist"
        aria-label="Generator flux topology"
        className="flex flex-wrap gap-2"
      >
        {MODES.map((item, i) => {
          const selected = item.id === mode;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`flux-tab-${item.id}`}
              aria-selected={selected}
              aria-controls="flux-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(item.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`rounded-full border px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
                selected
                  ? "border-brand/60 bg-brand/10 text-brand"
                  : "border-hairline text-ink-3 hover:border-ink-3 hover:text-ink-2"
              }`}
              style={{ transitionTimingFunction: "var(--ease-signature)" }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        id="flux-panel"
        role="tabpanel"
        aria-labelledby={`flux-tab-${mode}`}
        className="mt-6"
      >
        <div className="relative overflow-hidden rounded-2xl border border-hairline bg-abyss">
          <div
            aria-hidden="true"
            className="glow-brand pointer-events-none absolute inset-x-1/4 inset-y-0 opacity-40"
          />
          <svg
            viewBox="0 0 460 300"
            className="relative w-full"
            role="img"
            aria-label={`Cross-section of a ${active.label} flux generator. ${active.body}`}
          >
            <defs>
              <linearGradient id="fx-steel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2A2A31" />
                <stop offset="100%" stopColor="#17171A" />
              </linearGradient>
            </defs>

            {/* Shaft axis */}
            <line
              x1={26}
              y1={AXIS_Y}
              x2={434}
              y2={AXIS_Y}
              stroke="#7C7C85"
              strokeWidth={1}
              strokeDasharray="7 6"
              opacity={0.65}
            />

            {/* Legend, kept in the empty top-left corner so it can never
                collide with the machine at any of the three modes. */}
            <g>
              <line
                x1={26}
                y1={24}
                x2={50}
                y2={24}
                stroke="#7C7C85"
                strokeWidth={1}
                strokeDasharray="7 6"
                opacity={0.65}
              />
              <text
                x={57}
                y={27.5}
                fill="#7C7C85"
                fontSize={9}
                letterSpacing="0.16em"
                className="font-mono"
              >
                SHAFT AXIS
              </text>
            </g>

            {/* Rotor body */}
            <rect
              x={120}
              y={AXIS_Y - 34}
              width={220}
              height={68}
              rx={3}
              fill="url(#fx-steel)"
              stroke="#3A3A42"
            />

            {/* --- Radial elements: stator arcs above and below --- */}
            <g
              style={{
                opacity: showRadial ? 1 : 0.12,
                transition: "opacity .6s var(--ease-signature)",
              }}
            >
              <rect x={112} y={62} width={236} height={20} rx={3} fill="url(#fx-steel)" stroke="#3A3A42" />
              <rect x={112} y={218} width={236} height={20} rx={3} fill="url(#fx-steel)" stroke="#3A3A42" />
              <rect x={120} y={AXIS_Y - 34} width={220} height={11} rx={2} fill="rgba(0,255,94,0.13)" stroke="rgba(0,255,94,0.55)" />
              <rect x={120} y={AXIS_Y + 23} width={220} height={11} rx={2} fill="rgba(0,255,94,0.13)" stroke="rgba(0,255,94,0.55)" />
            </g>

            {/* Radial flux arrows */}
            <g
              stroke="#00FF5E"
              fill="#00FF5E"
              style={{
                opacity: showRadial ? 1 : 0,
                transition: "opacity .5s var(--ease-signature)",
              }}
            >
              {[150, 195, 240, 285, 320].map((x, i) => (
                <g key={x} className="flux-arrow" style={{ animationDelay: `${i * 180}ms` }}>
                  <line x1={x} y1={AXIS_Y - 40} x2={x} y2={AXIS_Y - 88} strokeWidth={1.4} strokeLinecap="round" />
                  <polygon points={`${x},${AXIS_Y - 96} ${x - 4.5},${AXIS_Y - 85} ${x + 4.5},${AXIS_Y - 85}`} />
                  <line x1={x} y1={AXIS_Y + 40} x2={x} y2={AXIS_Y + 88} strokeWidth={1.4} strokeLinecap="round" />
                  <polygon points={`${x},${AXIS_Y + 96} ${x - 4.5},${AXIS_Y + 85} ${x + 4.5},${AXIS_Y + 85}`} />
                </g>
              ))}
            </g>

            {/* --- Axial elements: end discs --- */}
            <g
              style={{
                opacity: showAxial ? 1 : 0.12,
                transition: "opacity .6s var(--ease-signature)",
              }}
            >
              <rect x={58} y={72} width={22} height={156} rx={3} fill="url(#fx-steel)" stroke="#3A3A42" />
              <rect x={380} y={72} width={22} height={156} rx={3} fill="url(#fx-steel)" stroke="#3A3A42" />
              <rect x={120} y={AXIS_Y - 34} width={11} height={68} rx={2} fill="rgba(0,255,94,0.13)" stroke="rgba(0,255,94,0.55)" />
              <rect x={329} y={AXIS_Y - 34} width={11} height={68} rx={2} fill="rgba(0,255,94,0.13)" stroke="rgba(0,255,94,0.55)" />
            </g>

            {/* Axial flux arrows */}
            <g
              stroke="#00FF5E"
              fill="#00FF5E"
              style={{
                opacity: showAxial ? 1 : 0,
                transition: "opacity .5s var(--ease-signature)",
              }}
            >
              {[104, 150, 196].map((y, i) => (
                <g key={y} className="flux-arrow" style={{ animationDelay: `${i * 200 + 90}ms` }}>
                  <line x1={116} y1={y} x2={92} y2={y} strokeWidth={1.4} strokeLinecap="round" />
                  <polygon points={`84,${y} 95,${y - 4.5} 95,${y + 4.5}`} />
                  <line x1={344} y1={y} x2={368} y2={y} strokeWidth={1.4} strokeLinecap="round" />
                  <polygon points={`376,${y} 365,${y - 4.5} 365,${y + 4.5}`} />
                </g>
              ))}
            </g>

            <text
              x={230}
              y={288}
              textAnchor="middle"
              fill="#7C7C85"
              fontSize={8.5}
              letterSpacing="0.18em"
              className="font-mono"
            >
              CONCEPTUAL — NOT TO SCALE
            </text>
          </svg>
        </div>

        {/* Live copy for the selected mode. All three are in the HTML for
            crawlers and for the no-JS case; only the active one is shown. */}
        <div className="mt-6 min-h-[6.5rem]">
          {MODES.map((item) => (
            <div
              key={item.id}
              hidden={item.id !== mode}
              className="max-w-xl"
            >
              <h3 className="display-3 text-ink">{item.headline}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
