import Link from "next/link";
import { PortraitFrame } from "@/components/graphics/PortraitFrame";
import { IconArrowRight } from "@/components/graphics/Icons";
import type { Founder } from "@/lib/site";

export function FounderCard({
  founder,
  priority = false,
  sizes,
}: {
  founder: Founder;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <article className="group/card">
      <Link
        href={`/team/${founder.slug}`}
        className="block rounded-2xl focus-visible:outline-offset-4"
      >
        <PortraitFrame founder={founder} priority={priority} sizes={sizes} />

        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl tracking-[-0.025em] text-ink">
              {founder.name}
            </h3>
            <p className="mt-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-brand">
              {founder.role}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="mt-1.5 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-hairline text-ink-2 transition-all duration-500 group-hover/card:border-brand/60 group-hover/card:text-brand"
            style={{ transitionTimingFunction: "var(--ease-signature)" }}
          >
            <IconArrowRight className="h-4 w-4" />
          </span>
        </div>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-2">
          {founder.summary}
        </p>
      </Link>
    </article>
  );
}
