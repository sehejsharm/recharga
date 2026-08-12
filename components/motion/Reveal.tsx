import { Fragment, type CSSProperties, type ReactNode } from "react";

/**
 * Scroll reveals — server components, no client JavaScript.
 *
 * The hidden state is applied only under `html.motion-ok`, a class an inline
 * script adds before the body paints and only when motion is welcome. So:
 *
 *   - no JS, or JS that fails → every element renders visible, in the HTML
 *   - reduced motion          → every element renders visible
 *   - otherwise               → hidden, then revealed on enter by the observer
 *
 * This is the inverse of the usual `initial={{ opacity: 0 }}` approach, which
 * serialises invisible content into the server HTML and makes the whole page
 * depend on hydration to be readable.
 */

type Tag = "div" | "section" | "li" | "span" | "p" | "figure";

type RevealProps = {
  children: ReactNode;
  /** Seconds of delay — for hand-tuned stagger within a group. */
  delay?: number;
  /** Travel distance in px. 0 gives a pure fade. */
  y?: number;
  as?: Tag;
  className?: string;
};

const revealStyle = (delay: number, y: number): CSSProperties =>
  ({
    ...(delay ? { "--reveal-delay": `${delay}s` } : {}),
    ...(y !== 24 ? { "--reveal-y": `${y}px` } : {}),
  }) as CSSProperties;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  as: Tag = "div",
  className,
}: RevealProps) {
  return (
    <Tag data-reveal="" className={className} style={revealStyle(delay, y)}>
      {children}
    </Tag>
  );
}

/**
 * Heading whose words rise from behind a mask, one after another.
 * Used sparingly — section titles, never body copy and never the hero H1.
 * The words are real text nodes, so selection and screen readers are normal.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
  id,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  /** Set when the heading is the target of an aria-labelledby. */
  id?: string;
  as?: "h2" | "h3" | "p";
}) {
  const words = text.split(" ");

  return (
    <Tag
      id={id}
      data-reveal-words=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            className="mask-word"
            style={{ "--word-index": i } as CSSProperties}
          >
            {word}
          </span>
          {/* Real space between inline-blocks so wrapping stays natural. */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
