"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor-reactive dot field.
 *
 * A calm engineered grid at rest; near the pointer the dots brighten to brand
 * green and lean away, as if the cursor carried a charge. A slow wave keeps it
 * breathing when nobody is moving the mouse.
 *
 * Purely decorative, always `aria-hidden`. Pauses off-screen and when the tab
 * is hidden, and never starts at all under `prefers-reduced-motion` — the
 * static CSS grid behind it is what remains.
 */
export function MagneticDots({
  className,
  spacing = 34,
  radius = 150,
}: {
  className?: string;
  /** Grid pitch in CSS pixels. */
  spacing?: number;
  /** Pointer influence radius in CSS pixels. */
  radius?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let frame = 0;
    let running = false;
    let time = 0;

    // Pointer is tracked in canvas space; -1 means "no pointer yet".
    const pointer = { x: -1, y: -1, strength: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;
    };

    const render = () => {
      if (!running) return;
      frame = requestAnimationFrame(render);
      time += 0.006;

      ctx.clearRect(0, 0, width, height);

      // Ease the pointer influence in and out so it never snaps.
      pointer.strength += ((pointer.x < 0 ? 0 : 1) - pointer.strength) * 0.08;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = col * spacing;
          const baseY = row * spacing;

          // Idle breathing wave.
          const wave =
            Math.sin(baseX * 0.012 + time * 1.6) *
            Math.cos(baseY * 0.014 - time * 1.2);

          let dx = 0;
          let dy = 0;
          let heat = 0;

          if (pointer.x >= 0) {
            const px = baseX - pointer.x;
            const py = baseY - pointer.y;
            const dist = Math.hypot(px, py);
            if (dist < radius) {
              const falloff = (1 - dist / radius) ** 2 * pointer.strength;
              heat = falloff;
              // Lean away from the cursor.
              const push = falloff * 13;
              dx = (px / (dist || 1)) * push;
              dy = (py / (dist || 1)) * push;
            }
          }

          const size = 1 + heat * 1.9;
          const alpha = 0.1 + wave * 0.05 + heat * 0.85;
          if (alpha <= 0.02) continue;

          ctx.beginPath();
          ctx.arc(baseX + dx, baseY + dy, size, 0, Math.PI * 2);
          ctx.fillStyle =
            heat > 0.06
              ? `rgba(0, 255, 94, ${Math.min(1, alpha)})`
              : `rgba(154, 154, 162, ${Math.max(0, alpha * 0.5)})`;
          ctx.fill();
        }
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(render);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      // Keep reacting slightly beyond the edges so it never feels boxed in.
      const margin = radius;
      pointer.x =
        x > -margin && x < rect.width + margin && y > -margin && y < rect.height + margin
          ? x
          : -1;
      pointer.y = y;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    const resizeObserver = new ResizeObserver(resize);

    resize();
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [spacing, radius]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
