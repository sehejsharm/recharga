"use client";

import { useEffect, useRef } from "react";

/**
 * Conceptual electromagnetic flux field.
 *
 * Particles are advected along a vector field that blends a slow ambient flow
 * with a rotational swirl around two poles — an abstract nod to axial and
 * radial flux paths. It depicts nothing real and claims nothing: it is
 * atmosphere, not a diagram of a machine.
 *
 * Deliberately 2D canvas rather than WebGL. A three.js scene would have cost
 * roughly 150 KB of JS for the same first impression and put the LCP budget
 * at risk; this ships in a few KB and idles at zero cost off-screen.
 */

type Particle = { x: number; y: number; px: number; py: number; life: number };

const BG = "#0e0e10";

export function HeroField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let frame = 0;
    let running = true;
    let time = 0;

    // Pointer influence, eased toward the raw position each frame.
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };
    let scrollFactor = 0;

    const cores = navigator.hardwareConcurrency ?? 4;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale density with area, then clamp hard on small or low-power devices.
      const area = width * height;
      const target = Math.round(area / 2600);
      const cap = width < 720 || cores <= 4 ? 260 : 780;
      const count = Math.max(90, Math.min(target, cap));

      particles = Array.from({ length: count }, () => spawn());

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);
    };

    const spawn = (): Particle => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return { x, y, px: x, py: y, life: 40 + Math.random() * 190 };
    };

    /** Vector field angle at a point. */
    const fieldAngle = (x: number, y: number) => {
      const nx = x / width;
      const ny = y / height;

      // Ambient flow: two crossed sinusoids give a slow, organic drift.
      const flow =
        Math.sin(ny * 5.2 + time * 0.32) * 1.7 +
        Math.cos(nx * 4.1 - time * 0.24) * 1.7;

      // Two poles create the counter-rotating swirl.
      let swirl = 0;
      let weight = 0;
      const poles = [
        { x: 0.36, y: 0.46, dir: 1 },
        { x: 0.68, y: 0.58, dir: -1 },
      ];
      for (const pole of poles) {
        const dx = nx - pole.x;
        const dy = ny - pole.y;
        const dist = Math.hypot(dx, dy) + 0.0001;
        const w = Math.exp(-dist * 4.6);
        swirl += (Math.atan2(dy, dx) + (Math.PI / 2) * pole.dir) * w;
        weight += w;
      }
      if (weight > 0) swirl /= weight;

      // Pointer adds a local rotational nudge.
      let pointerTerm = 0;
      if (pointer.active) {
        const dx = nx - pointer.x;
        const dy = ny - pointer.y;
        const dist = Math.hypot(dx, dy) + 0.0001;
        const w = Math.exp(-dist * 7);
        pointerTerm = (Math.atan2(dy, dx) + Math.PI / 2) * w * 1.2;
      }

      const blend = Math.min(1, weight);
      return flow * (1 - blend * 0.75) + swirl * blend + pointerTerm;
    };

    const render = () => {
      if (!running) return;
      frame = requestAnimationFrame(render);
      time += 0.0022;

      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      // Trail decay instead of a hard clear.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(14, 14, 16, 0.085)";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1;

      // The field dims and settles as the hero scrolls away.
      const energy = 1 - scrollFactor * 0.85;
      if (energy <= 0.02) return;

      for (const p of particles) {
        p.px = p.x;
        p.py = p.y;

        const angle = fieldAngle(p.x, p.y);
        const speed = 0.85 + Math.sin(angle * 2.1) * 0.35;
        p.x += Math.cos(angle) * speed;
        p.y += Math.sin(angle) * speed;
        p.life -= 1;

        if (
          p.life <= 0 ||
          p.x < -20 ||
          p.x > width + 20 ||
          p.y < -20 ||
          p.y > height + 20
        ) {
          Object.assign(p, spawn());
          continue;
        }

        // Brightest near the poles, cooling to teal at the edges.
        const heat = Math.min(
          1,
          Math.max(
            0,
            1 - Math.hypot(p.x / width - 0.5, p.y / height - 0.52) * 2.05,
          ),
        );
        const alpha = (0.09 + heat * 0.5) * energy;

        ctx.strokeStyle =
          heat > 0.55
            ? `rgba(107, 255, 163, ${alpha})`
            : `rgba(0, 194, 74, ${alpha * 0.85})`;

        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = (event.clientY - rect.top) / rect.height;
      pointer.active = true;
    };

    const onScroll = () => {
      const rect = canvas.getBoundingClientRect();
      scrollFactor = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)));
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

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );

    const onVisibility = () =>
      document.hidden ? stop() : void (canvas.isConnected && start());

    const resizeObserver = new ResizeObserver(resize);

    resize();
    onScroll();
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(render);

    // Fade the canvas in over the static poster once it has something to show.
    canvas.animate?.(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 1400, easing: "cubic-bezier(0.16,1,0.3,1)", fill: "forwards" },
    );

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      // The canvas is decorative; the hero's meaning lives entirely in the
      // heading and copy beside it.
    />
  );
}
