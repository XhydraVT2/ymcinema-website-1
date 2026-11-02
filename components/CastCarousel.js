"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function CastCarousel({ children }) {
  const track = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 2, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2 });
  }, []);
  useEffect(() => {
    update();
    const el = track.current;
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (el && observer) observer.observe(el);
    window.addEventListener("resize", update);
    return () => { observer?.disconnect(); window.removeEventListener("resize", update); };
  }, [update]);
  const move = (direction) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(180, el.clientWidth * 0.75), behavior: "smooth" });
  };
  return (
    <div className="cast-carousel">
      <button type="button" className="cast-arrow cast-prev" aria-label="Previous cast members" onClick={() => move(-1)} disabled={!edges.left}>‹</button>
      <div className="cast-row" ref={track} onScroll={update}>{children}</div>
      <button type="button" className="cast-arrow cast-next" aria-label="Next cast members" onClick={() => move(1)} disabled={!edges.right}>›</button>
    </div>
  );
}
