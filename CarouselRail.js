"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/** Shared accessible carousel controls for movie rows and ranked rails. */
export default function CarouselRail({ children, ranked = false, label = "Movies" }) {
  const rail = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const refresh = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    refresh();
    const el = rail.current;
    if (!el) return;
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : null;
    observer?.observe(el);
    window.addEventListener("resize", refresh);
    return () => { observer?.disconnect(); window.removeEventListener("resize", refresh); };
  }, [children, refresh]);
  function move(direction) {
    const el = rail.current;
    if (!el) return;
    const item = el.firstElementChild;
    const itemWidth = item?.getBoundingClientRect().width || 320;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 20;
    const count = Math.max(1, Math.floor(el.clientWidth / (itemWidth + gap)));
    const distance = (itemWidth + gap) * count;
    el.scrollBy({ left: direction * distance, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  return (
    <div className={`cinema-rail v22-carousel ${ranked ? "v22-ranked" : ""}`} aria-label={label}>
      <button type="button" className="rail-arrow rail-prev" aria-label={`Scroll ${label} left`} onClick={() => move(-1)} disabled={edges.start}>‹</button>
      <div className={ranked ? "top10 top10-premium" : "hrow"} ref={rail} onScroll={refresh} tabIndex={0} role="region" aria-roledescription="carousel" aria-label={label}>{children}</div>
      <button type="button" className="rail-arrow rail-next" aria-label={`Scroll ${label} right`} onClick={() => move(1)} disabled={edges.end}>›</button>
    </div>
  );
}
