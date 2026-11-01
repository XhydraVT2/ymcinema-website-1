"use client";
import { useEffect } from "react";

// Deliberately muted: the lighting should complement artwork, not compete with it.
const PALETTES = [
  [49, 78, 99], [74, 67, 91], [49, 87, 84],
  [94, 75, 65], [68, 87, 76], [85, 69, 84], [55, 77, 104],
];
const BASE = [49, 78, 99];
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
function paletteFor(text) {
  let hash = 0;
  for (const c of text || "") hash = (hash * 33 + c.charCodeAt(0)) >>> 0;
  return PALETTES[hash % PALETTES.length];
}
export default function AmbientBackdrop() {
  useEffect(() => {
    const root = document.documentElement;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = [...BASE], target = [...BASE];
    let pointer = null, frame = 0, last = 0, active = true;
    let lastSection = null;
    const sections = () => [...document.querySelectorAll(".sec, .episodes-section, .prov-panel, .d-hero")];
    const selectTarget = () => {
      const viewport = window.innerHeight || 800;
      const focus = viewport * .54;
      let nearest = null, distance = Infinity;
      for (const section of sections()) {
        const rect = section.getBoundingClientRect();
        const delta = Math.abs(clamp(focus, rect.top, rect.bottom) - focus);
        const center = Math.abs((rect.top + rect.bottom) / 2 - focus);
        const score = delta * 2 + center * .12;
        if (score < distance) { distance = score; nearest = section; }
      }
      if (nearest) lastSection = nearest;
      const label = pointer?.querySelector(".wt, .cinema-card-info strong")?.textContent || lastSection?.querySelector("h2")?.textContent || "YMCINEMA";
      let next = paletteFor(label);
      const hero = getComputedStyle(root).getPropertyValue("--hero-rgb").trim().split(",").map(Number);
      if (!pointer && window.scrollY < viewport * .55 && hero.length === 3 && hero.every(Number.isFinite)) {
        next = hero.map((n, i) => clamp(BASE[i] * .65 + n * .35, 35, 112));
      }
      // A hover influences the color gently; never jump to a saturated palette.
      target = next.map((n, i) => BASE[i] * .35 + n * .65);
    };
    const tick = (now) => {
      if (!active) return;
      const dt = Math.min(64, Math.max(0, now - (last || now)));
      last = now;
      const blend = motion.matches ? 1 : 1 - Math.exp(-dt / 1550);
      current = current.map((n, i) => n + (target[i] - n) * blend);
      root.style.setProperty("--scene-glow", `rgb(${current.map(n => Math.round(n)).join(",")})`);
      frame = requestAnimationFrame(tick);
    };
    const onOver = (event) => {
      const card = event.target.closest?.(".premium-card, .t10-premium");
      if (card && card !== pointer) { pointer = card; selectTarget(); }
    };
    const onOut = (event) => {
      if (pointer && pointer.contains(event.target) && !pointer.contains(event.relatedTarget)) {
        pointer = null; selectTarget();
      }
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("scroll", selectTarget, { passive: true });
    window.addEventListener("resize", selectTarget);
    window.addEventListener("ymc-hero-change", selectTarget);
    selectTarget();
    frame = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", selectTarget);
      window.removeEventListener("resize", selectTarget);
      window.removeEventListener("ymc-hero-change", selectTarget);
      root.style.removeProperty("--scene-glow");
    };
  }, []);
  return <div className="ambient-field" aria-hidden="true" />;
}
