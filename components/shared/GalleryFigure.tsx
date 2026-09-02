"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

/**
 * A gallery card that removes itself if its image fails to load, so a missing
 * or broken source never renders as an empty box. When a real image exists at
 * `src`, the card shows normally — nothing else to change.
 */
export function GalleryFigure({ src, alt, caption, width, height }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    // An <img> that has finished loading with zero natural width has failed.
    // This catches failures that happened before hydration attached onError;
    // a lazy image that simply hasn't loaded yet reports complete === false, so
    // it is not hidden by mistake.
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setBroken(true);
  }, []);

  if (broken) return null;

  return (
    <figure className="overflow-hidden rounded-2xl border border-hairline bg-surface-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={width}
        height={height}
        onError={() => setBroken(true)}
        className="block h-56 w-full object-cover"
      />
      <figcaption className="px-4 py-3 text-sm text-ink-2">{caption}</figcaption>
    </figure>
  );
}
