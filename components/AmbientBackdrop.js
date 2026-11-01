"use client";
import { useEffect } from "react";

// A restrained ambient palette. Changes follow the section in view and the
// card under the pointer, rather than switching whole-page background images.
const PALETTES = [
  [62, 116, 145], [102, 81, 138], [49, 125, 117],
  [143, 91, 71], [86, 118, 90], [122, 83, 112], [62, 100, 153],
];
function paletteFor(text) {
  let hash = 0;
  for (const c of text || "") hash = (hash * 33 + c.charCodeAt(0)) >>> 0;
  return PALETTES[hash % PALETTES.length];
}
export default function AmbientBackdrop() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    let hovered = null;
    let lastColor = "";
    const update = () => {
      raf = 0;
      const scroll = window.scrollY;
      const viewport = window.innerHeight;
      const sections = [...document.querySelectorAll(".sec, .episodes-section, .prov-panel, .d-hero")];
      const focusY = viewport * 0.56;
      let nearest = null;
      let distance = Infinity;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height * 0.5 - focusY);
        if (d < distance) { nearest = el; distance = d; }
      }
      const label = hovered?.querySelector(".wt, .cinema-card-info strong")?.textContent
        || nearest?.querySelector("h2")?.textContent || "YMCINEMA";
      const hero = getComputedStyle(root).getPropertyValue("--hero-rgb").trim();
      const rgb = hovered ? paletteFor(label) : scroll < viewport * 0.7 && hero
        ? hero.split(",").map(Number) : paletteFor(label);
      const color = `rgb(${rgb.join(",")})`;
      if (color !== lastColor) {
        root.style.setProperty("--scene-glow", color);
        lastColor = color;
      }
      const rect = hovered?.getBoundingClientRect();
      root.style.setProperty("--scene-x", rect ? `${Math.round((rect.left + rect.width / 2) / innerWidth * 100)}%` : "52%");
      root.style.setProperty("--scene-y", rect ? `${Math.round((rect.top + rect.height / 2) / viewport * 100)}%` : "52%");
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const over = (e) => {
      const card = e.target.closest?.(".premium-card, .t10");
      if (card && card !== hovered) { hovered = card; schedule(); }
    };
    const out = (e) => {
      if (hovered && hovered.contains(e.target) && !hovered.contains(e.relatedTarget)) {
        hovered = null; schedule();
      }
    };
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("ymc-hero-change", schedule);
    update();
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("ymc-hero-change", schedule);
      ["--scene-glow", "--scene-x", "--scene-y"].forEach(p => root.style.removeProperty(p));
    };
  }, []);
  return <div className="ambient-field" aria-hidden="true" />;
}
