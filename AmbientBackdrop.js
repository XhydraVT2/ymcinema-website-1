"use client";
import { useEffect, useState } from "react";

const DEFAULT = [36, 53, 66];
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export default function AmbientBackdrop() {
  const [art, setArt] = useState("");
  const [previous, setPrevious] = useState("");
  const [showNew, setShowNew] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let live = true, frame = 0, last = 0;
    let current = [...DEFAULT], target = [...DEFAULT], imagePath = "";
    const onHero = () => {
      const cssArt = root.style.getPropertyValue("--hero-art");
      const match = cssArt.match(/url\(["']?([^"')]+)["']?\)/);
      const nextPath = match?.[1] || "";
      if (!nextPath || nextPath === imagePath) return;
      imagePath = nextPath;
      setArt(old => { if(old && old !== nextPath) setPrevious(old); return nextPath; });
      setShowNew(false);
      requestAnimationFrame(() => requestAnimationFrame(() => { if(live) setShowNew(true); }));
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (!live || imagePath !== nextPath) return;
        try {
          const canvas = document.createElement("canvas"); canvas.width = 48; canvas.height = 27;
          const ctx = canvas.getContext("2d", { willReadFrequently:true });
          ctx.drawImage(img,0,0,48,27);
          const pixels=ctx.getImageData(0,0,48,27).data;
          let r=0,g=0,b=0,weight=0;
          for(let i=0;i<pixels.length;i+=16){
            const red=pixels[i],green=pixels[i+1],blue=pixels[i+2];
            const brightness=(red+green+blue)/3;
            if(brightness<22 || brightness>235)continue;
            const w=1+Math.min(1,Math.max(0,(Math.max(red,green,blue)-Math.min(red,green,blue))/120));
            r+=red*w;g+=green*w;b+=blue*w;weight+=w;
          }
          if(weight>0) target=[r,g,b].map(v=>clamp(v/weight*.62,26,110));
        } catch { /* Cross-origin image may not expose pixels; keep the existing calm palette. */ }
      };
      img.src=nextPath;
    };
    const tick = now => {
      if(!live)return;
      const dt=Math.min(64,Math.max(0,now-(last||now)));last=now;
      const blend=reduced.matches?1:1-Math.exp(-dt/2100);
      current=current.map((v,i)=>v+(target[i]-v)*blend);
      root.style.setProperty("--scene-glow",`rgb(${current.map(Math.round).join(",")})`);
      frame=requestAnimationFrame(tick);
    };
    window.addEventListener("ymc-hero-change",onHero);
    onHero();frame=requestAnimationFrame(tick);
    return()=>{live=false;cancelAnimationFrame(frame);window.removeEventListener("ymc-hero-change",onHero);root.style.removeProperty("--scene-glow");};
  },[]);
  return <div className="ambient-field v29-atmosphere" aria-hidden="true">
    {previous && <div className="v29-art v29-art-old" style={{backgroundImage:`url("${previous}")`}} />}
    {art && <div className={`v29-art v29-art-new ${showNew?"is-visible":""}`} style={{backgroundImage:`url("${art}")`}} />}
    <div className="v29-art-overlay" />
  </div>;
}
