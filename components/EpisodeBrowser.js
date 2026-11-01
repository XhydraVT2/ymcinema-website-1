"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
const IMG = "https://image.tmdb.org/t/p";
export default function EpisodeBrowser({id,seasons,episodesBySeason}) {
  const valid = seasons.filter(s=>s.season_number>0);
  const [season,setSeason]=useState(valid[0]?.season_number ?? 1);
  const [layout,setLayout]=useState("list");
  const [open,setOpen]=useState(false);
  const current=valid.find(s=>s.season_number===season);
  const episodes=episodesBySeason[String(season)] || [];
  return <section className="episodes-section" id="episodes">
    <div className="episodes-top"><div><div className="episodes-eyebrow">SEASON {season} · {episodes.length} EPISODES</div><h2>Episodes</h2></div>
    <div className="episodes-tools"><div className="episodes-layout" aria-label="Episode layout"><button className={layout==='list'?'chosen':''} onClick={()=>setLayout('list')} aria-label="List view">☷</button><button className={layout==='grid'?'chosen':''} onClick={()=>setLayout('grid')} aria-label="Grid view">▦</button></div><div className="season-picker"><button className="season-trigger" onClick={()=>setOpen(v=>!v)} aria-expanded={open}>S{season} &nbsp; {current?.name || `Season ${season}`} ⌄</button>{open&&<div className="season-menu"><div className="season-menu-label">{valid.length} SEASONS</div>{valid.map(s=><button key={s.id} className={s.season_number===season?'active':''} onClick={()=>{setSeason(s.season_number);setOpen(false)}}>{s.poster_path&&<Image src={`${IMG}/w92${s.poster_path}`} alt="" width={38} height={57}/>}<span><strong>{s.name}</strong><small>{s.episode_count} episodes · {s.air_date?.slice(0,4)||'TBA'}</small></span>{s.season_number===season?'✓':''}</button>)}</div>}</div></div></div>
    <div className={`episode-list ${layout==='grid'?'episode-grid':''}`}>{episodes.map(e=><article className="episode-item" key={e.id}><div className="episode-still">{e.still_path&&<Image src={`${IMG}/w500${e.still_path}`} alt={`Episode ${e.episode_number}`} fill sizes="(max-width:700px) 100vw, 300px"/>}<span className="episode-num">E{e.episode_number}</span>{e.runtime&&<span className="episode-duration">{e.runtime}m</span>}</div><div className="episode-details"><div className="episodes-eyebrow">EPISODE {e.episode_number}</div><h3>{e.name}</h3><div className="episode-meta">{e.air_date||'TBA'} · {e.runtime?`${e.runtime} min`: 'Runtime TBA'} {e.vote_average>0?`· ★ ${e.vote_average.toFixed(1)}`:''}</div><p>{e.overview||'Episode description not available.'}</p><Link className="btn primary episode-play" href={`/watch/tv/${id}?season=${season}&episode=${e.episode_number}`}>▶ Play</Link></div></article>)}{!episodes.length&&<p>Episode information is not available for this season.</p>}</div>
  </section>;
}
