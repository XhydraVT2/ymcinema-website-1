"use client";
import PlayIcon from "./PlayIcon";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MoviePlayer from "./MoviePlayer";

const names = Array.from({length:7},(_,i)=>`Watch ${i+1}`);
export default function WatchExperience({movieId,type,title,seasons,initialSeason=1,initialEpisode=1}) {
  const router = useRouter();
  const [selected,setSelected] = useState(0);
  const [started,setStarted] = useState(false);
  const [season,setSeason] = useState(initialSeason);
  const [episode,setEpisode] = useState(initialEpisode);
  const [loading,setLoading] = useState(false);
  useEffect(()=>{setSeason(initialSeason);setEpisode(initialEpisode);setStarted(false);setLoading(false);},[movieId,initialSeason,initialEpisode]);
  const updateEpisode=(s,e)=>{const nextSeason=Math.min(seasons,Math.max(1,Number(s)||1));const nextEpisode=Math.max(1,Number(e)||1);setSeason(nextSeason);setEpisode(nextEpisode);setStarted(false);setLoading(false);router.push(`/watch/tv/${movieId}?season=${nextSeason}&episode=${nextEpisode}`,{scroll:false});};
  const sources = [
    { movie:id=>`https://cinevu.icu/player.html?type=movie&id=${id}`,tv:(id,s,e)=>`https://embed.cinevu.icu/embed/tv/${id}/${s}/${e}`,sandbox:true },
    { movie:id=>`https://player.cinezo.live/embed/movie/${id}?autoplay=true`,tv:(id,s,e)=>`https://player.cinezo.live/embed/tv/${id}/${s}/${e}?autoplay=true`,sandbox:true },
    { movie:id=>`https://vidzen.fun/movie/${id}?autoPlay=true`,tv:(id,s,e)=>`https://vidzen.fun/tv/${id}?season=${s}&episode=${e}&autoPlay=true`,sandbox:true },
    { movie:id=>`https://nxsha.space/embed/movie/${id}?autoplay=true`,tv:(id,s,e)=>`https://nxsha.space/embed/tv/${id}/${s}/${e}?autoplay=true`,sandbox:true },
    { movie:id=>`https://cinesrc.st/embed/movie/${id}?autoplay=true`,tv:(id,s,e)=>`https://cinesrc.st/embed/tv/${id}?s=${s}&e=${e}&autoplay=true`,sandbox:true },
    { movie:id=>`https://embed.vidrift.net/embed/movie/${id}?autoplay=true`,tv:(id,s,e)=>`https://embed.vidrift.net/embed/tv/${id}/${s}/${e}?autoplay=true`,sandbox:false },
    { movie:id=>`https://rivestream.ru/watch?type=movie&id=${id}&autoplay=true`,tv:(id,s,e)=>`https://rivestream.ru/watch?type=tv&id=${id}&season=${s}&episode=${e}&autoplay=true`,sandbox:true }
  ];
  const source=sources[selected];
  const url=type==='tv'?source.tv(movieId,season,episode):source.movie(movieId);
  function choose(i){setSelected(i);if(started){setLoading(true);}}
  return <div className="watch-content">
    <div className="watch-main">
      <div className="watch-brand">YMCINEMA <span>· {type==='tv'?'SERIES':'FILM'}</span></div>
      <h1>{title}</h1>
      {type==='tv' && <div className="watch-episode-controls"><label>Season <input type="number" min="1" max={seasons} value={season} onChange={e=>updateEpisode(e.target.value,episode)} /></label><label>Episode <input type="number" min="1" value={episode} onChange={e=>updateEpisode(season,e.target.value)} /></label></div>}
      {!started ? <button className="watch-big-play" aria-label={`Play ${title} using ${names[selected]}`} onClick={()=>{setStarted(true);setLoading(true);}}><PlayIcon /> Play {names[selected]}</button> : <><div className="watch-player-box" aria-label={`${title} player`}>{loading && <div className="watch-loading">Connecting to {names[selected]}…</div>}<iframe key={url} src={url} title={names[selected]} allowFullScreen allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="no-referrer" onLoad={()=>setLoading(false)} {...(source.sandbox?{sandbox:'allow-scripts allow-same-origin allow-presentation'}:{})}/></div><div className="watch-controls"><button className="watch-close" onClick={()=>{setStarted(false);setLoading(false);}}>■ Stop playback</button><span>Having trouble? Try another Watch source.</span></div></>}
    </div>
    <aside className="watch-sources"><div className="watch-sources-title">SOURCES <span>{started?(loading?'● Connecting':'● Selected'):'● Choose source'}</span></div>{names.map((name,i)=><button key={name} className={selected===i?'active':''} aria-pressed={selected===i} onClick={()=>choose(i)}><span className="watch-source-dot"/>{name}<small>{selected===i&&loading?'CONNECTING':'READY'}</small></button>)}</aside>
  </div>;
}
