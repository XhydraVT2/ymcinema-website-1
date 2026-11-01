"use client";
import { useRef } from "react";

export default function CarouselRail({ children }) {
  const rail = useRef(null);
  function move(direction) {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(300, el.clientWidth * .78), behavior: "smooth" });
  }
  return (
    <div className="cinema-rail">
      <button className="rail-arrow rail-prev" aria-label="Scroll movies left" onClick={() => move(-1)}>‹</button>
      <div className="hrow" ref={rail}>{children}</div>
      <button className="rail-arrow rail-next" aria-label="Scroll movies right" onClick={() => move(1)}>›</button>
    </div>
  );
}
