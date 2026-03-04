"use client";
import { useEffect } from "react";

const SECTION_AMBIENT: Record<string, { intensity: number; y: number }> = {
  hero:      { intensity: 0.04,  y: 30 },
  manifesto: { intensity: 0.045, y: 28 },
  services:  { intensity: 0.05,  y: 25 },
  process:   { intensity: 0.055, y: 35 },
  approach:  { intensity: 0.05,  y: 30 },
  team:      { intensity: 0.045, y: 30 },
  contact:   { intensity: 0.04,  y: 30 },
  cta:       { intensity: 0.06,  y: 40 },
};

const PARALLAX_INTENSITY: Record<string, number> = { "1": 0.02, "2": 0.04, "3": 0.06 };

export function ScrollAmbientProvider() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const scale = isCoarse || isMobile ? 0.5 : 1;
    const disableParallax = prefersReduced || isCoarse || isMobile;

    let curI = 0.04, curY = 30, tgtI = 0.04, tgtY = 30;
    let raf = 0, live = true;
    const T = 0.025;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Collect parallax elements once
    const parallaxEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]")
    );

    function tick() {
      if (!live) return;

      // ── Ambient lerp ──────────────────────────────────────────
      curI = lerp(curI, tgtI, T);
      curY = lerp(curY, tgtY, T);
      const root = document.documentElement;
      root.style.setProperty("--ambient-y", `${curY.toFixed(2)}%`);
      root.style.setProperty("--ambient-intensity", (curI * (prefersReduced ? 0 : 1)).toFixed(4));

      // ── Parallax translateY ───────────────────────────────────
      if (!disableParallax && parallaxEls.length > 0) {
        const scrollH = (document.scrollingElement?.scrollHeight ?? document.body.scrollHeight) - window.innerHeight;
        const progress = scrollH > 0 ? window.scrollY / scrollH : 0;
        for (const el of parallaxEls) {
          const lvl = el.dataset.parallax ?? "1";
          const intensity = PARALLAX_INTENSITY[lvl] ?? 0.02;
          const shift = progress * intensity * 100;
          el.style.transform = `translateY(${shift.toFixed(2)}vh)`;
        }
      }

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    // ── Section ambient observer ──────────────────────────────────
    const ratios = new Map<string, number>();
    const els = document.querySelectorAll<HTMLElement>("[data-ambient]");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = (entry.target as HTMLElement).dataset.ambient ?? "";
          ratios.set(key, entry.intersectionRatio);
        }
        let bestKey = "hero", bestRatio = 0;
        ratios.forEach((r, k) => { if (r > bestRatio) { bestRatio = r; bestKey = k; } });
        const cfg = SECTION_AMBIENT[bestKey] ?? SECTION_AMBIENT.hero;
        tgtI = cfg.intensity * scale;
        tgtY = cfg.y;
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i * 0.05) }
    );

    els.forEach((el) => io.observe(el));
    return () => { live = false; cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  return <div aria-hidden="true" className="ambient-overlay" />;
}
