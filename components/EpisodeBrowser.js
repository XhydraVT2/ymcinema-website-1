"use client";
import PlayIcon from "./PlayIcon";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
const IMG = "https://image.tmdb.org/t/p";
export default function EpisodeBrowser({id,seasons,episodesBySeason}) {
  const valid = seasons.filter(s=>s.season_number>0);
  const [season,setSeason]=useState(valid[0]?.season_number ?? 1);
  const [layout,setLayout]=useState("carousel");
  const [open,setOpen]=useState(false);
  const [scrollState,setScrollState]=useState({left:false,right:true});
  const rail=useRef(null);
  const current=valid.find(s=>s.season_number===season);
  const episodes=episodesBySeason[String(season)] || [];
  const updateArrows=()=>{const el=rail.current;if(el)setScrollState({left:el.scrollLeft>8,right:el.scrollLeft+el.clientWidth<el.scrollWidth-8});};
  useEffect(()=>{const el=rail.current;if(!el||layout!=="carousel")return;const resize=new ResizeObserver(updateArrows);resize.observe(el);updateArrows();return()=>resize.disconnect();},[layout,season,episodes.length]);
  const move=(direction)=>{const el=rail.current;if(!el)return;const item=el.querySelector('.episode-item');const distance=item?item.getBoundingClientRect().width+18:el.clientWidth*.8;el.scrollBy({left:distance*direction,behavior:'smooth'});};
  const changeSeason=(number)=>{setSeason(number);setOpen(false);if(rail.current)rail.current.scrollLeft=0;};
  return <section className="episodes-section" id="episodes">
    <div className="episodes-top"><div><div className="episodes-eyebrow">SEASON {season} · {episodes.length} EPISODES</div><h2>Episodes</h2></div>
    <div className="episodes-tools"><div className="episodes-layout" aria-label="Episode layout">
      <button className={layout==='carousel'?'chosen':''} onClick={()=>setLayout('carousel')} aria-label="Carousel view" title="Carousel view">▣</button>
      <button className={layout==='grid'?'chosen':''} onClick={()=>setLayout('grid')} aria-label="Grid view" title="Grid view">▦</button>
      <button className={layout==='list'?'chosen':''} onClick={()=>setLayout('list')} aria-label="List view" title="List view">☷</button>
    </div><div className="season-picker"><button className="season-trigger" onClick={()=>setOpen(v=>!v)} aria-expanded={open}>S{season} &nbsp; {current?.name || `Season ${season}`} ⌄</button>{open&&<div className="season-menu"><div className="season-menu-label">{valid.length} SEASONS</div>{valid.map(s=><button key={s.id} className={s.season_number===season?'active':''} onClick={()=>changeSeason(s.season_number)}>{s.poster_path&&<Image src={`${IMG}/w92${s.poster_path}`} alt="" width={38} height={57}/>}<span><strong>{s.name}</strong><small>{s.episode_count} episodes · {s.air_date?.slice(0,4)||'TBA'}</small></span>{s.season_number===season?'✓':''}</button>)}</div>}</div></div></div>
    <div className="episode-carousel-wrap">
      <div ref={rail} onScroll={layout==='carousel'?updateArrows:undefined} className={`episode-list ${layout==='grid'?'episode-grid':layout==='carousel'?'episode-carousel':''}`}>
        {episodes.map(e=><article className="episode-item" key={e.id}><div className="episode-still">{e.still_path&&<Image src={`${IMG}/w500${e.still_path}`} alt={`Episode ${e.episode_number}`} fill sizes="(max-width:700px) 85vw, 320px"/>}<span className="episode-num">E{e.episode_number}</span>{e.runtime&&<span className="episode-duration">{e.runtime}m</span>}</div><div className="episode-details"><div className="episodes-eyebrow">EPISODE {e.episode_number}</div><h3>{e.name}</h3><div className="episode-meta">{e.air_date||'TBA'} · {e.runtime?`${e.runtime} min`: 'Runtime TBA'} {e.vote_average>0?`· ★ ${e.vote_average.toFixed(1)}`:''}</div><p>{e.overview||'Episode description not available.'}</p><Link className="btn primary episode-play" href={`/watch/tv/${id}?season=${season}&episode=${e.episode_number}`}><PlayIcon /> Play</Link></div></article>)}
        {!episodes.length&&<p>Episode information is not available for this season.</p>}
      </div>
      {layout==='carousel'&&episodes.length>1&&<><button className="episode-rail-arrow episode-rail-prev" onClick={()=>move(-1)} disabled={!scrollState.left} aria-label="Previous episodes">‹</button><button className="episode-rail-arrow episode-rail-next" onClick={()=>move(1)} disabled={!scrollState.right} aria-label="Next episodes">›</button></>}
    </div>
  </section>;
}
