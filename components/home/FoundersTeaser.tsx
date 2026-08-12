import Link from "next/link";
import { FounderCard } from "@/components/shared/FounderCard";
import { IconArrowRight } from "@/components/graphics/Icons";
import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { founders } from "@/lib/site";

export function FoundersTeaser() {
  return (
    <section
      aria-labelledby="founders-heading"
      className="section border-t border-hairline"
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <p className="eyebrow">Leadership</p>
            </Reveal>
            <RevealWords
              as="h2"
              text="The people building it"
              className="display-2 mt-6 text-ink"
              delay={0.05}
            />
          </div>

          <Reveal delay={0.12}>
            <Link href="/team" className="link-draw font-display text-lg">
              Meet the team
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:gap-16">
          {founders.map((founder, i) => (
            <Reveal key={founder.slug} delay={i * 0.1} y={32}>
              <FounderCard
                founder={founder}
                sizes="(min-width: 640px) 36rem, 100vw"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
