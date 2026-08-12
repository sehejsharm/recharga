/**
 * Licensing model, drawn as a circuit.
 *
 * Three nodes with a charge travelling the path between them: evaluate →
 * license → build. Pure CSS animation on server-rendered SVG, so it works
 * without JavaScript and stops dead under reduced motion.
 */

const STEPS = [
  { n: "01", title: "Evaluate", body: "We map the architecture onto your platform and supply chain." },
  { n: "02", title: "License", body: "You keep your product and brand. You skip the core generator R&D." },
  { n: "03", title: "Build", body: "We support integration, so it lands in turbines and not in a report." },
];

const W = 620;
const Y = 54;
const NODE_X = [80, 310, 540];

export function LicensingFlow({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-abyss px-4 py-6">
        <svg
          viewBox={`0 0 ${W} 108`}
          className="w-full"
          role="img"
          aria-label="Three-step licensing flow: evaluate, then license, then build."
        >
          {/* Track */}
          <line
            x1={NODE_X[0]}
            y1={Y}
            x2={NODE_X[2]}
            y2={Y}
            stroke="#2E2E34"
            strokeWidth={1.5}
          />
          {/* Travelling charge */}
          <line
            className="flow-charge"
            x1={NODE_X[0]}
            y1={Y}
            x2={NODE_X[2]}
            y2={Y}
            stroke="#00FF5E"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="42 418"
          />

          {NODE_X.map((x, i) => (
            <g key={x}>
              <circle cx={x} cy={Y} r={22} fill="#111113" stroke="#3A3A42" />
              <circle
                cx={x}
                cy={Y}
                r={22}
                fill="none"
                stroke="#00FF5E"
                strokeWidth={1.2}
                opacity={0.55}
                className="flux-arrow"
                style={{ animationDelay: `${i * 900}ms` }}
              />
              <text
                x={x}
                y={Y + 4}
                textAnchor="middle"
                fill="#00FF5E"
                fontSize={11}
                letterSpacing="0.1em"
                className="font-mono"
              >
                {STEPS[i].n}
              </text>
              <text
                x={x}
                y={Y + 42}
                textAnchor="middle"
                fill="#F4F4F6"
                fontSize={14}
                className="font-display"
              >
                {STEPS[i].title}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <ol className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.n} className="bg-surface-1 p-5">
            <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-brand">
              {step.n}
            </p>
            <h3 className="mt-2.5 font-display text-base font-medium text-ink">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
