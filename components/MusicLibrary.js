"use client";
import { useEffect, useRef, useState } from "react";
const tabs=[["trending","Discover"],["new","New Releases"],["king","KING"],["romantic","Romantic"],["dance","Dance"],["classics","Classics"]];
const STORE="ymcinema.hindi.music.favorites.v1";
const sc = q => `https://soundcloud.com/search?q=${encodeURIComponent(q)}`;
const yt = q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q+" official song")}`;
export default function MusicLibrary(){
 const [category,setCategory]=useState("trending"),[tracks,setTracks]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[search,setSearch]=useState(""),[playing,setPlaying]=useState(null),[favorites,setFavorites]=useState([]),[showFavorites,setShowFavorites]=useState(false),[youtube,setYoutube]=useState(null);
 const audio=useRef(null);
 useEffect(()=>{try{const v=JSON.parse(localStorage.getItem(STORE)||"[]");if(Array.isArray(v))setFavorites(v)}catch{}},[]);
 useEffect(()=>{try{localStorage.setItem(STORE,JSON.stringify(favorites))}catch{}},[favorites]);
 useEffect(()=>{let cancelled=false;setLoading(true);setError("");setPlaying(null);setYoutube(null);fetch("/api/music/discover?category="+encodeURIComponent(category)).then(async r=>{const data=await r.json();if(!r.ok)throw new Error(data.error||"Unavailable");return data}).then(d=>{if(!cancelled)setTracks(d.tracks||[])}).catch(e=>{if(!cancelled){setTracks([]);setError(e.message)}}).finally(()=>{if(!cancelled)setLoading(false)});return()=>{cancelled=true}},[category]);
 const listed=(showFavorites?favorites:tracks).filter(t=>`${t.title} ${t.artist} ${t.album}`.toLowerCase().includes(search.toLowerCase()));
 function toggleFavorite(t){setFavorites(old=>old.some(x=>x.id===t.id)?old.filter(x=>x.id!==t.id):[t,...old])}
 function play(t){setYoutube(null);setPlaying(old=>old?.id===t.id?null:t)}
 return <main className="ym-hindi-music">
  <header className="ym-hindi-hero"><div className="ym-hindi-glow"/><span className="ym-hindi-overline">YMCINEMA · HINDI MUSIC</span><h1>Bollywood, on repeat<span>.</span></h1><p>Discover fresh Hindi film songs, explore your favorites, and listen without leaving YMCINEMA.</p><div className="ym-hindi-hero-actions"><a href="#discover">Explore music ↓</a><a href={sc("latest bollywood hindi songs")} target="_blank" rel="noopener noreferrer">Explore SoundCloud ↗</a></div></header>
  <section id="discover" className="ym-hindi-content">
   <div className="ym-hindi-heading"><div><span>YOUR BOLLYWOOD SOUNDTRACK</span><h2>Discover Hindi music</h2></div><button type="button" className={showFavorites?"ym-hindi-saved selected":"ym-hindi-saved"} onClick={()=>setShowFavorites(v=>!v)}>♡ {showFavorites?"Show discovery":"My favorites"} ({favorites.length})</button></div>
   <div className="ym-hindi-toolbar"><div className="ym-hindi-tabs">{tabs.map(([key,label])=><button type="button" key={key} className={!showFavorites&&category===key?"selected":""} onClick={()=>{setCategory(key);setShowFavorites(false)}}>{label}</button>)}</div><input type="search" aria-label="Search displayed music" placeholder="Search songs or artists…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
   {category==="king"&&!showFavorites&&<div className="ym-hindi-spotlight"><strong>✦ Spotlight: KING — Tu Mil Jaaye</strong><span>Explore the new song from Shah Rukh Khan's KING. Availability in the music catalog depends on the provider.</span><a href={yt("KING Tu Mil Jaaye T Series Arijit Ed Sheeran")} target="_blank" rel="noopener noreferrer">Find official video ↗</a></div>}
   {loading&&!showFavorites?<div className="ym-hindi-state">Finding Hindi songs…</div>:error&&!showFavorites?<div className="ym-hindi-state">{error} <button onClick={()=>setCategory("new")}>Try New Releases</button></div>:listed.length===0?<div className="ym-hindi-state">{showFavorites?"No saved songs yet. Tap ♡ on a track to save it.":"No matching songs found. Try another category."}</div>:<div className="ym-hindi-grid">{listed.map((t,i)=><article className="ym-hindi-track" key={t.id+"-"+i}>
    <div className="ym-hindi-art"><img src={t.artwork||"/favicon.ico"} alt="" loading="lazy"/><button className="ym-hindi-play" type="button" onClick={()=>play(t)} aria-label={`Play preview of ${t.title}`} disabled={!t.preview}>{playing?.id===t.id?"Ⅱ":"▶"}</button></div>
    <div className="ym-hindi-track-title" title={t.title}>{t.title}</div><div className="ym-hindi-track-artist" title={t.artist}>{t.artist}</div>
    <div className="ym-hindi-track-actions"><button type="button" onClick={()=>toggleFavorite(t)} aria-label={`Favorite ${t.title}`}>{favorites.some(f=>f.id===t.id)?"♥ Saved":"♡ Save"}</button><a href={yt(t.title+" "+t.artist)} target="_blank" rel="noopener noreferrer">Full song ↗</a></div>
   </article>)}</div>}
   <div className="ym-hindi-note">Tracks are discovered from India's music catalog and may include non-Hindi matches. New releases are sorted by release date, not a verified trending ranking. Playback previews are provided by Apple; full songs open official-platform searches.</div>
  </section>
  <section className="ym-hindi-sc"><div><span>SOUNDCLOUD COLLECTION</span><h2>More Bollywood on SoundCloud</h2><p>Explore Hindi playlists and songs on SoundCloud. Play public, embeddable tracks right here by pasting their URL below.</p></div><SoundCloudPlayer/></section>
  {playing&&<div className="ym-hindi-player" role="region" aria-label="Audio preview player"><img src={playing.artwork} alt=""/><div><strong>{playing.title}</strong><small>{playing.artist} · Preview clip</small></div><audio key={playing.id} ref={audio} src={playing.preview} controls autoPlay onEnded={()=>setPlaying(null)}/><button type="button" onClick={()=>setPlaying(null)} aria-label="Close player">✕</button></div>}
 </main>
}
function SoundCloudPlayer(){
 const [input,setInput]=useState(""),[url,setUrl]=useState(""),[error,setError]=useState("");
 function submit(e){e.preventDefault();setError("");try{const u=new URL(input);if(u.protocol!=="https:"||!["soundcloud.com","www.soundcloud.com","m.soundcloud.com"].includes(u.hostname)||u.pathname==="/")throw Error();setUrl(u.toString())}catch{setError("Enter a public HTTPS SoundCloud track or playlist link.")}}
 return <div className="ym-hindi-sc-player"><form onSubmit={submit}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste a public SoundCloud track or playlist link…" aria-label="SoundCloud URL"/><button type="submit">Play here</button></form>{error&&<p role="alert">{error}</p>}{url&&<iframe title="SoundCloud embedded music player" src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=false&show_comments=false`} loading="lazy" allow="encrypted-media"/>}<a href={sc("bollywood hindi official songs")} target="_blank" rel="noopener noreferrer">Browse Bollywood on SoundCloud ↗</a></div>
}
