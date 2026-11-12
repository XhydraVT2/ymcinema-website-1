"use client";
import { useRef } from "react";

/** Pointer-reactive lighting, scoped to the hovered card. No animation loop. */
export default function SpotlightCard({ children, className = "" }) {
  const ref = useRef(null);
  function move(e) {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = node.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    node.style.setProperty("--spot-x", `${x * 100}%`);
    node.style.setProperty("--spot-y", `${y * 100}%`);
    node.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
    node.style.setProperty("--tilt-y", `${(x - 0.5) * 5}deg`);
  }
  function reset() {
    if (!ref.current) return;
    ref.current.style.setProperty("--tilt-x", "0deg");
    ref.current.style.setProperty("--tilt-y", "0deg");
  }
  return <div ref={ref} className={`spotlight-shell ${className}`} onPointerMove={move} onPointerLeave={reset}>{children}</div>;
}
