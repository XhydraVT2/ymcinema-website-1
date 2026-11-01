"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Reveal from "./Reveal";
import { IMG } from "../lib/tmdb";

const GENRES = [
  {id:28,tv:10759,name:"Action",color:"#e34354"},
  {id:12,tv:10759,name:"Adventure",color:"#d99a31"},
  {id:16,tv:16,name:"Animation",color:"#cc4d9e"},
  {id:35,tv:35,name:"Comedy",color:"#d7b52b"},
  {id:80,tv:80,name:"Crime",color:"#477eab"},
  {id:99,tv:99,name:"Documentary",color:"#299e94"},
  {id:18,tv:18,name:"Drama",color:"#8244b7"},
  {id:10751,tv:10751,name:"Family",color:"#49a66b"},
  {id:14,tv:10765,name:"Fantasy",color:"#7366c8"},
  {id:27,tv:9648,name:"Horror / Mystery",color:"#9b4559"},
  {id:10749,tv:18,name:"Romance",color:"#c96083"},
  {id:878,tv:10765,name:"Sci-Fi",color:"#4284b6"},
  {id:53,tv:9648,name:"Thriller",color:"#8c6a6a"},
];
export default function Genres({movies=[],shows=[]}) {
  const [type,setType] = useState("movie");
  const railRef = useRef(null);
  const [edges,setEdges] = useState({start:true,end:false});
  const refresh = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setEdges({start:el.scrollLeft <= 3,end:el.scrollLeft + el.clientWidth >= el.scrollWidth - 3});
  },[]);
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    refresh();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : null;
    observer?.observe(el);
    window.addEventListener("resize",refresh);
    return () => {observer?.disconnect();window.removeEventListener("resize",refresh);};
  },[type,refresh]);
  function scrollGenres(direction) {
    const el = railRef.current;
    if (!el) return;
    const item = el.firstElementChild;
    const width = item?.getBoundingClientRect().width || 220;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 16;
    const count = Math.max(1,Math.floor(el.clientWidth/(width+gap)));
    el.scrollBy({left:direction*(width+gap)*count,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  }
  const items = (type === "tv" ? shows : movies).filter(item => item.original_language === "hi");
  return <section className="sec genre-section" id="genres">
    <Reveal><div className="sec-head"><div><p className="eyebrow">Find your mood</p><h2>Browse by genre</h2></div><div className="head-right"><div className="toggle glass" aria-label="Choose media type"><button type="button" className={type === "movie" ? "on" : ""} onClick={()=>{setType("movie");railRef.current?.scrollTo({left:0});}}>▦ Movies</button><button type="button" className={type === "tv" ? "on" : ""} onClick={()=>{setType("tv");railRef.current?.scrollTo({left:0});}}>▢ TV Shows</button></div><Link className="pill-link glass" href={`/genre/${type}/28`}>Browse Action ↗</Link></div></div></Reveal>
    <div className="genre-carousel-shell">
      <button type="button" className="genre-nav genre-nav-prev" aria-label="Scroll genres left" onClick={()=>scrollGenres(-1)} disabled={edges.start}>‹</button>
      <div className="genre-rail" ref={railRef} onScroll={refresh} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Browse genres">{GENRES.map((genre,i)=>{
      const id=type==="tv"?genre.tv:genre.id;
      const image=items.find(m=>m.genre_ids?.includes(id)&&m.backdrop_path)?.backdrop_path || items.find(m=>m.backdrop_path)?.backdrop_path;
      return <Reveal key={`${type}-${genre.name}`} className="genre-reveal"><Link href={`/genre/${type}/${id}`} className="genre-tile" style={{"--genre-accent":genre.color,"--genre-delay":`${i*35}ms`}}><span className="genre-art">{image && <Image src={`${IMG}/w780${image}`} alt="" fill sizes="220px"/>}</span><span className="genre-shade"/><span className="genre-title">{genre.name}</span><span className="genre-arrow" aria-hidden="true">↗</span></Link></Reveal>
    })}</div>
      <button type="button" className="genre-nav genre-nav-next" aria-label="Scroll genres right" onClick={()=>scrollGenres(1)} disabled={edges.end}>›</button>
    </div>
  </section>;
}
