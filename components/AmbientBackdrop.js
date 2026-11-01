"use client";

import { useEffect } from "react";

/** A fixed, non-interactive color field that blends as visitors scroll. */
export default function AmbientBackdrop() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const progress = Math.max(0, Math.min(1, scrollY / max));
      // Broad, overlapping washes instead of color bands at section boundaries.
      const teal = Math.max(0, 1 - Math.abs(progress - .16) / .46);
      const blue = Math.max(0, 1 - Math.abs(progress - .51) / .48);
      const amber = Math.max(0, 1 - Math.abs(progress - .88) / .43);
      root.style.setProperty("--ambient-teal", (0.17 + teal * .44).toFixed(3));
      root.style.setProperty("--ambient-blue", (0.16 + blue * .48).toFixed(3));
      root.style.setProperty("--ambient-amber", (amber * .32).toFixed(3));
      root.style.setProperty("--ambient-drift", `${Math.round(progress * 18)}%`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    if (!reduce.matches) {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.style.removeProperty("--ambient-teal");
      root.style.removeProperty("--ambient-blue");
      root.style.removeProperty("--ambient-amber");
      root.style.removeProperty("--ambient-drift");
    };
  }, []);
  return <div className="ambient-field" aria-hidden="true" />;
}
