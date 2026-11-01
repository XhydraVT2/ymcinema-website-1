"use client";
import { useEffect } from "react";

const PALETTES = [[54,123,165],[104,81,158],[39,137,132],[168,95,74],[84,119,85],[123,81,112],[71,111,151]];
function paletteFor(text) {
  let hash = 0;
  for (const c of text) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTES[hash % PALETTES.length];
}
export default function AmbientBackdrop() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let active = null;
    let hovered = null;
    const paint = () => {
      frame = 0;
      const scroll = window.scrollY;
      const sections = [...document.querySelectorAll(".sec, .episodes-section, .prov-panel, .d-hero")];
      const focusY = scroll + innerHeight * .55;
      let nearest = sections[0];
      let distance = Infinity;
      for (const el of sections) {
        const box = el.getBoundingClientRect();
        const center = scroll + box.top + box.height / 2;
        const d = Math.abs(center - focusY);
        if (d < distance) { nearest = el; distance = d; }
      }
      const name = hovered?.querySelector(".wt, .cinema-card-info strong")?.textContent || nearest?.querySelector("h2")?.textContent || "Cinema";
      const color = hovered ? paletteFor(name) : nearest ? paletteFor(name) : [54,123,165];
      const heroColor = getComputedStyle(root).getPropertyValue("--hero-rgb").trim() || "54,123,165";
      const [r,g,b] = (scroll < innerHeight * .8 && !hovered ? heroColor.split(",").map(Number) : color);
      root.style.setProperty("--scene-rgb", `${r},${g},${b}`);
      root.style.setProperty("--scene-x", hovered ? `${Math.round((hovered.getBoundingClientRect().left + hovered.getBoundingClientRect().width/2) / innerWidth * 100)}%` : "50%");
      root.style.setProperty("--scene-y", hovered ? `${Math.round((hovered.getBoundingClientRect().top + hovered.getBoundingClientRect().height/2) / innerHeight * 100)}%` : "46%");
      root.style.setProperty("--scroll-progress", `${Math.min(100, scroll / Math.max(1, document.documentElement.scrollHeight-innerHeight) * 100)}%`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const onOver = (e) => {
      const card = e.target.closest?.(".premium-card, .wcard");
      if (card && card !== hovered) { hovered = card; schedule(); }
    };
    const onOut = (e) => {
      if (hovered && hovered.contains(e.target) && !hovered.contains(e.relatedTarget)) { hovered = null; schedule(); }
    };
    const onHero = schedule;
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("scroll", schedule, {passive:true});
    window.addEventListener("resize", schedule);
    window.addEventListener("ymc-hero-change", onHero);
    paint();
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("ymc-hero-change", onHero);
      ["--scene-rgb","--scene-x","--scene-y","--scroll-progress"].forEach(p=>root.style.removeProperty(p));
    };
  }, []);
  return <div className="ambient-field" aria-hidden="true" />;
}
