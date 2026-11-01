"use client";
import { useEffect, useRef, useState } from "react";

export default function Reveal({children, className = "", delay = 0, as: Tag = "div"}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !('IntersectionObserver' in window)) {
      setVisible(true); return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target); }
    }, { threshold: 0.08, rootMargin: "0px 0px 45px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <Tag ref={ref} className={`cinema-reveal ${visible ? "is-visible" : ""} ${className}`} style={{"--reveal-delay": `${delay}ms`}}>{children}</Tag>;
}
