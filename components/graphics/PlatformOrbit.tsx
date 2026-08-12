"use client";

import { useId, useState } from "react";

/**
 * Interactive platform orbit.
 *
 * RADAX at the centre, its applications orbiting it — wind first, hydro next,
 * hybrid-vehicle alternators beyond. Hovering or focusing a node lights its
 * orbit and swaps the caption, so the platform story is something you poke at
 * rather than read.
 *
 * Nodes are real buttons: keyboard reachable, and every caption ships in the
 * HTML so the content survives without JavaScript.
 */

type Node = {
  id: string;
  label: string;
  horizon: string;
  body: string;
  /** Orbit radii and the node's angle in degrees. */
  rx: number;
  ry: number;
  angle: number;
};

const NODES: Node[] = [
  {
    id: "wind",
    label: "Wind",
    horizon: "Now",
    body: "Multi-megawatt wind turbines are where the need is sharpest, and where RADAX is being developed first.",
    rx: 118,
    ry: 62,
    angle: -34,
  },
  {
    id: "hydro",
    label: "Hydro",
    horizon: "Next",
    body: "Hydro-electric generation poses a closely related problem: low speed, high torque, decades of service life.",
    rx: 172,
    ry: 96,
    angle: 156,
  },
  {
    id: "alternators",
    label: "Alternators",
    horizon: "Beyond",
    body: "The same principles carry down in scale, to compact high-power-density machines for hybrid vehicles.",
    rx: 224,
    ry: 128,
    angle: 52,
  },
];

const CX = 260;
const CY = 175;

const pointOn = (node: Node) => {
  const rad = (node.angle * Math.PI) / 180;
  return { x: CX + Math.cos(rad) * node.rx, y: CY + Math.sin(rad) * node.ry };
};

export function PlatformOrbit({ className }: { className?: string }) {
  const [activeId, setActiveId] = useState<string>("wind");
  const uid = useId();
  const active = NODES.find((n) => n.id === activeId)!;

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-abyss">
        <div
          aria-hidden="true"
          className="glow-brand pointer-events-none absolute inset-1/4 opacity-60"
        />

        <svg
          viewBox="0 0 520 350"
          className="relative w-full"
          role="img"
          aria-label="Diagram of the RADAX platform: a central generator architecture with wind, hydro and hybrid-vehicle alternators as applications orbiting it."
        >
          {/* Orbits */}
          {NODES.map((node) => {
            const isActive = node.id === activeId;
            return (
              <ellipse
                key={`orbit-${node.id}`}
                cx={CX}
                cy={CY}
                rx={node.rx}
                ry={node.ry}
                fill="none"
                stroke={isActive ? "#00FF5E" : "#2E2E34"}
                strokeWidth={1}
                strokeDasharray="3 7"
                opacity={isActive ? 0.75 : 0.55}
                className={isActive ? "orbit-spin" : undefined}
                style={{
                  transformOrigin: `${CX}px ${CY}px`,
                  transition: "stroke .5s var(--ease-signature), opacity .5s",
                }}
              />
            );
          })}

          {/* Core: the architecture itself */}
          <g>
            <circle cx={CX} cy={CY} r={54} fill="#111113" stroke="#3A3A42" />
            <circle
              cx={CX}
              cy={CY}
              r={40}
              fill="none"
              stroke="#00FF5E"
              strokeWidth={1.4}
              opacity={0.55}
              className="anim-pulse"
            />
            <circle cx={CX} cy={CY} r={26} fill="none" stroke="#2E2E34" />
            {/* Flux ticks around the core */}
            {Array.from({ length: 24 }, (_, i) => {
              const a = (i / 24) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={CX + Math.cos(a) * 40}
                  y1={CY + Math.sin(a) * 40}
                  x2={CX + Math.cos(a) * 50}
                  y2={CY + Math.sin(a) * 50}
                  stroke="#7C7C85"
                  strokeWidth={1}
                  opacity={0.32}
                />
              );
            })}
            <text
              x={CX}
              y={CY + 4}
              textAnchor="middle"
              fill="#F4F4F6"
              fontSize={15}
              letterSpacing="0.06em"
              className="font-display"
            >
              RADAX
            </text>
          </g>

          {/* Application nodes */}
          {NODES.map((node) => {
            const { x, y } = pointOn(node);
            const isActive = node.id === activeId;
            return (
              <g key={node.id}>
                <line
                  x1={CX}
                  y1={CY}
                  x2={x}
                  y2={y}
                  stroke="#00FF5E"
                  strokeWidth={1}
                  opacity={isActive ? 0.4 : 0}
                  style={{ transition: "opacity .45s var(--ease-signature)" }}
                />
                <g
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  aria-describedby={`${uid}-caption`}
                  onMouseEnter={() => setActiveId(node.id)}
                  onFocus={() => setActiveId(node.id)}
                  onClick={() => setActiveId(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveId(node.id);
                    }
                  }}
                  className="cursor-pointer outline-none"
                  style={{ transition: "opacity .3s" }}
                >
                  {/* Generous invisible hit area */}
                  <circle cx={x} cy={y} r={34} fill="transparent" />
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? 11 : 7}
                    fill={isActive ? "#00FF5E" : "#27272C"}
                    stroke={isActive ? "#6BFFA3" : "#3A3A42"}
                    strokeWidth={1.4}
                    style={{ transition: "all .45s var(--ease-signature)" }}
                  />
                  <text
                    x={x}
                    y={y - 22}
                    textAnchor="middle"
                    fill={isActive ? "#F4F4F6" : "#9A9AA2"}
                    fontSize={13}
                    className="font-display"
                    style={{ transition: "fill .4s" }}
                  >
                    {node.label}
                  </text>
                  <text
                    x={x}
                    y={y + 30}
                    textAnchor="middle"
                    fill={isActive ? "#00FF5E" : "#7C7C85"}
                    fontSize={8.5}
                    letterSpacing="0.18em"
                    className="font-mono"
                    style={{ transition: "fill .4s" }}
                  >
                    {node.horizon.toUpperCase()}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* All captions ship in the HTML; only the active one is shown. */}
      <div id={`${uid}-caption`} className="mt-6 min-h-[4.5rem]">
        {NODES.map((node) => (
          <p
            key={node.id}
            hidden={node.id !== activeId}
            className="max-w-xl text-[0.9375rem] leading-relaxed text-ink-2"
          >
            <span className="text-ink">{node.label} — {node.horizon.toLowerCase()}.</span>{" "}
            {node.body}
          </p>
        ))}
        <p className="sr-only">{active.label} is currently shown.</p>
      </div>
    </div>
  );
}
