"use client";
import { useState } from "react";
import MoviePlayer from "./MoviePlayer";

const names = Array.from({length:7},(_,i)=>`Watch ${i+1}`);
export default function WatchExperience({movieId,type,title,seasons}) {
  const [selected,setSelected] = useState(0);
  const [started,setStarted] = useState(false);
  const [season,setSeason] = useState(1);
  const [episode,setEpisode] = useState(1);
  const [loading,setLoading] = useState(false);
  const sources = [
    { movie:id=>`https://cinevu.icu/player.html?type=movie&id=${id}`,tv:(id,s,e)=>`https://embed.cinevu.icu/embed/tv/${id}/${s}/${e}`,sandbox:false },
    { movie:id=>`https://player.cinezo.live/embed/movie/${id}?autoplay=true`,tv:(id,s,e)=>`https://player.cinezo.live/embed/tv/${id}/${s}/${e}?autoplay=true`,sandbox:true },
    { movie:id=>`https://vidzen.fun/movie/${id}?autoPlay=true`,tv:(id,s,e)=>`https://vidzen.fun/tv/${id}?season=${s}&episode=${e}&autoPlay=true`,sandbox:true },
    { movie:id=>`https://nxsha.space/embed/movie/${id}?autoplay=true`,tv:(id,s,e)=>`https://nxsha.space/embed/tv/${id}/${s}/${e}?autoplay=true`,sandbox:true },
    { movie:id=>`https://cinesrc.st/embed/movie/${id}?autoplay=true`,tv:(id,s,e)=>`https://cinesrc.st/embed/tv/${id}?s=${s}&e=${e}&autoplay=true`,sandbox:true },
    { movie:id=>`https://embed.vidrift.net/embed/movie/${id}?autoplay=true`,tv:(id,s,e)=>`https://embed.vidrift.net/embed/tv/${id}/${s}/${e}?autoplay=true`,sandbox:false },
    { movie:id=>`https://rivestream.ru/watch?type=movie&id=${id}&autoplay=true`,tv:(id,s,e)=>`https://rivestream.ru/watch?type=tv&id=${id}&season=${s}&episode=${e}&autoplay=true`,sandbox:true }
  ];
  const source=sources[selected];
  const url=type==='tv'?source.tv(movieId,season,episode):source.movie(movieId);
  function choose(i){setSelected(i);setStarted(true);setLoading(true);}
  return <div className="watch-content">
    <div className="watch-main">
      <div className="watch-brand">YMCINEMA <span>· {type==='tv'?'SERIES':'FILM'}</span></div>
      <h1>{title}</h1>
      {type==='tv' && <div className="watch-episode-controls"><label>Season <input type="number" min="1" max={seasons} value={season} onChange={e=>{setSeason(Math.max(1,Number(e.target.value)||1));setStarted(false);}} /></label><label>Episode <input type="number" min="1" value={episode} onChange={e=>{setEpisode(Math.max(1,Number(e.target.value)||1));setStarted(false);}} /></label></div>}
      {!started ? <button className="watch-big-play" onClick={()=>{setStarted(true);setLoading(true);}}>▶ Play {names[selected]}</button> : <><div className="watch-player-box">{loading && <div className="watch-loading">Connecting to {names[selected]}…</div>}<iframe key={url} src={url} title={names[selected]} allowFullScreen allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="no-referrer" onLoad={()=>setLoading(false)} {...(source.sandbox?{sandbox:'allow-scripts allow-same-origin allow-presentation'}:{})}/></div><button className="watch-close" onClick={()=>setStarted(false)}>■ Stop playback</button></>}
    </div>
    <aside className="watch-sources"><div className="watch-sources-title">SOURCES <span>{started?(loading?'● Connecting':'● Selected'):'● Ready'}</span></div>{names.map((name,i)=><button key={name} className={selected===i?'active':''} onClick={()=>choose(i)}><span className="watch-source-dot"/>{name}<small>{selected===i&&loading?'CONNECTING':'READY'}</small></button>)}</aside>
  </div>;
}
