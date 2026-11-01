"use client";
import { useEffect } from "react";

/** Keep normal vertical page scrolling when the pointer is above a horizontal rail.
 * Rail arrows, touch swipes, and intentional horizontal trackpad gestures still work.
 */
export default function VerticalWheelScroll() {
  useEffect(() => {
    const selector = ".hrow, .top10-premium, .genre-rail, .episode-carousel, .cast-row, .v14-rail, #providers .tiles, #providers .hrow";
    function onWheel(event) {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || event.deltaY === 0) return;
      const target = event.target;
      if (!(target instanceof Element) || !target.closest(selector)) return;
      // Some browsers route a vertical wheel over scrollable rails to horizontal scrolling.
      // Consume only vertical-intent wheel input and send it to the document instead.
      event.preventDefault();
      const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      window.scrollBy({ top: event.deltaY * scale, behavior: "instant" });
    }
    document.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => document.removeEventListener("wheel", onWheel, true);
  }, []);
  return null;
}
