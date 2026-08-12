import Link from "next/link";
import { IconArrowRight } from "@/components/graphics/Icons";
import { MagneticDots } from "@/components/graphics/MagneticDots";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";

export function CtaBand({
  heading = "For OEMs, investors and partners — let's talk.",
  body = "If you build wind turbines, invest in the energy transition, or want to understand where generator technology goes next, we'd like to hear from you.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden border-t border-hairline bg-abyss"
    >
      <div
        aria-hidden="true"
        className="glow-brand pointer-events-none absolute left-1/2 top-full h-[30rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 opacity-70"
      />
      <MagneticDots
        className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
        spacing={36}
        radius={170}
      />

      <div className="shell section relative text-center">
        <Reveal>
          <p className="eyebrow justify-center">Get in touch</p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2
            id="cta-heading"
            className="display-2 mx-auto mt-7 max-w-3xl text-ink"
          >
            {heading}
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="lede mx-auto mt-7 max-w-xl">{body}</p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-11 flex justify-center">
            <Magnetic strength={0.22}>
              <Link href="/contact" className="btn-primary group">
                Start a conversation
                <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
