"use client";
import { useState } from "react";

export default function MovieSongs({ songs = [], movieTitle, year }) {
  const [active, setActive] = useState(null);
  const search = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${movieTitle} ${year || ""} official songs soundtrack`)}`;
  return (
    <section id="songs" className="ym-songs-section">
      <div className="ym-songs-heading">
        <div><span className="ym-songs-eyebrow">♪ OFFICIAL SOUNDTRACK</span><h2>Songs &amp; Music</h2></div>
        <a href={search} target="_blank" rel="noopener noreferrer" className="ym-songs-search">Find songs on YouTube ↗</a>
      </div>
      {songs.length ? <>
        {active && <div className="ym-songs-player">
          <button type="button" onClick={() => setActive(null)} className="ym-songs-close">✕ Close player</button>
          <iframe key={active} src={`https://www.youtube-nocookie.com/embed/${active}?autoplay=0`} title="Movie song" allow="encrypted-media; picture-in-picture" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
        </div>}
        <div className="ym-songs-track">
          {songs.map(song => <button key={song.id} type="button" className={`ym-song-card ${active === song.id ? "is-active" : ""}`} onClick={() => setActive(song.id)}>
            <span className="ym-song-image" style={{backgroundImage:`linear-gradient(0deg,rgba(0,0,0,.35),transparent),url(https://i.ytimg.com/vi/${song.id}/hqdefault.jpg)`}}><span className="ym-song-play">▶</span></span>
            <strong>{song.title}</strong><small>{song.channel}</small>
          </button>)}
        </div>
      </> : <p className="ym-songs-empty">No verified official songs are available for this movie yet. <a href={search} target="_blank" rel="noopener noreferrer">Search YouTube ↗</a></p>}
    </section>
  );
}
