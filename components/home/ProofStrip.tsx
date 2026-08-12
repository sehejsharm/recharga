import { Reveal } from "@/components/motion/Reveal";
import { company } from "@/lib/site";

/**
 * Verifiable positioning only (§5.1). Recognition, location, sector and
 * company registration — nothing that implies a validated product or a
 * customer relationship.
 */
const PROOF = [
  {
    label: "Recognition",
    value: "DPIIT-recognised",
    detail: "Startup India, Government of India",
  },
  {
    label: "Based in",
    value: "Jaipur, India",
    detail: `${company.locality}, ${company.region}`,
  },
  {
    label: "Sector",
    value: "Deep-tech clean energy",
    detail: "Wind generation technology",
  },
  {
    label: "Model",
    value: "Technology licensing",
    detail: "Adopted by manufacturers, not sold as a product",
  },
];

export function ProofStrip() {
  return (
    <section aria-label="Company credentials" className="border-y border-hairline bg-abyss">
      <div className="shell">
        {/* Dividers sit between columns, so every column except the first
            needs matching inset padding — otherwise its text butts straight
            up against the rule. */}
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
          {PROOF.map((item, i) => (
            <Reveal
              as="li"
              key={item.label}
              delay={i * 0.06}
              y={16}
              className={[
                "border-hairline",
                i < PROOF.length - 1 ? "border-b sm:border-b-0" : "",
                i > 0 ? "lg:border-l lg:pl-8" : "",
                i % 2 === 1 ? "sm:border-l sm:pl-8 lg:pl-8" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="py-9 pr-8">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-3">
                  {item.label}
                </p>
                <p className="mt-3 font-display text-lg leading-tight tracking-[-0.02em] text-ink">
                  {item.value}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                  {item.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
