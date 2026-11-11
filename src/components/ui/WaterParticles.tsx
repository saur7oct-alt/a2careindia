'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Rising bubble field on canvas — the only decorative particle layer in the site, used
 * over the hero and closing CTA. Pauses when the tab is hidden, stops entirely under
 * reduced motion, and stays well below the legibility threshold for text over it.
 */
export function WaterParticles({
  className,
  density = 26,
  maxRadius = 3.2,
  speed = 0.22,
}: {
  className?: string;
  density?: number;
  maxRadius?: number;
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Data saver / reduced data: skip the decorative layer entirely.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    let raf = 0;
    let running = true;
    // 1.5x is the point of diminishing returns for a soft bubble field: it takes ~45% off
    // the per-frame fill area against a 2x ratio, at which the bubbles are already
    // sub-pixel. On a 1440p laptop the 2x buffer is the most expensive thing here.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    type Bubble = { x: number; y: number; r: number; vy: number; drift: number; alpha: number };
    let bubbles: Bubble[] = [];

    const seed = () => {
      const { clientWidth: width, clientHeight: height } = canvas;
      const count = width < 640 ? Math.round(density * 0.5) : density;
      bubbles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * maxRadius,
        vy: speed * (0.4 + Math.random()),
        drift: (Math.random() - 0.5) * 0.14,
        alpha: 0.12 + Math.random() * 0.3,
      }));
    };

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = canvas;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);

      for (const bubble of bubbles) {
        bubble.y -= bubble.vy;
        bubble.x += bubble.drift;

        if (bubble.y < -bubble.r) {
          bubble.y = height + bubble.r;
          bubble.x = Math.random() * width;
        }
        if (bubble.x < 0) bubble.x = width;
        if (bubble.x > width) bubble.x = 0;

        context.beginPath();
        context.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(178, 236, 244, ${bubble.alpha})`;
        context.fill();
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Stop painting once the hero has scrolled away.
        running = entry.isIntersecting;
        if (running) raf = requestAnimationFrame(draw);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    window.addEventListener('resize', resize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [reduced, density, maxRadius, speed]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  );
}
