import PlayIcon from "./PlayIcon";
"use client";

import { useState } from "react";

// Source order and iframe restrictions follow the supplied legacy configuration.
const SOURCES = [
  { movie: (id) => `https://cinevu.icu/player.html?type=movie&id=${id}`, tv: (id,s,e) => `https://embed.cinevu.icu/embed/tv/${id}/${s}/${e}`, sandbox: true },
  { movie: (id) => `https://player.cinezo.live/embed/movie/${id}?autoplay=true`, tv: (id,s,e) => `https://player.cinezo.live/embed/tv/${id}/${s}/${e}?autoplay=true`, sandbox: true },
  { movie: (id) => `https://vidzen.fun/movie/${id}?autoPlay=true`, tv: (id,s,e) => `https://vidzen.fun/tv/${id}?season=${s}&episode=${e}&autoPlay=true`, sandbox: true },
  { movie: (id) => `https://nxsha.space/embed/movie/${id}?autoplay=true`, tv: (id,s,e) => `https://nxsha.space/embed/tv/${id}/${s}/${e}?autoplay=true`, sandbox: true },
  { movie: (id) => `https://cinesrc.st/embed/movie/${id}?autoplay=true`, tv: (id,s,e) => `https://cinesrc.st/embed/tv/${id}?s=${s}&e=${e}&autoplay=true`, sandbox: true },
  { movie: (id) => `https://embed.vidrift.net/embed/movie/${id}?autoplay=true`, tv: (id,s,e) => `https://embed.vidrift.net/embed/tv/${id}/${s}/${e}?autoplay=true`, sandbox: false },
  { movie: (id) => `https://rivestream.ru/watch?type=movie&id=${id}&autoplay=true`, tv: (id,s,e) => `https://rivestream.ru/watch?type=tv&id=${id}&season=${s}&episode=${e}&autoplay=true`, sandbox: true },
];

export default function MoviePlayer({ movieId, type = "movie" }) {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const source = SOURCES[selected];
  const id = encodeURIComponent(movieId);
  const url = type === "tv" ? source.tv(id, season, episode) : source.movie(id);
  const stop = () => setPlaying(false);

  return (
    <section id="watch" className="movie-player-section">
      <div className="movie-player-heading">
        <div><small>YMCINEMA</small><h2>Watch {type === "tv" ? "episode" : "movie"}</h2></div>
        <label htmlFor="movie-source">Server</label>
        <select id="movie-source" value={selected} onChange={(e) => { setSelected(Number(e.target.value)); stop(); }}>
          {SOURCES.map((_, index) => <option key={index} value={index}>Watch {index + 1}</option>)}
        </select>
      </div>
      {type === "tv" && <div className="movie-player-episodes">
        <label>Season <input aria-label="Season" type="number" min="1" value={season} onChange={(e) => { setSeason(Math.max(1, Number(e.target.value) || 1)); stop(); }} /></label>
        <label>Episode <input aria-label="Episode" type="number" min="1" value={episode} onChange={(e) => { setEpisode(Math.max(1, Number(e.target.value) || 1)); stop(); }} /></label>
      </div>}
      <div className="movie-player-frame">
        {playing ? (
          <iframe key={url} src={url} title={`Watch ${selected + 1} player`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="no-referrer" loading="lazy" {...(source.sandbox ? { sandbox: "allow-scripts allow-same-origin allow-presentation" } : {})} />
        ) : (
          <div className="movie-player-idle"><button className="btn primary" type="button" onClick={() => setPlaying(true)}><PlayIcon /> Play now</button></div>
        )}
      </div>
      {playing && <button className="movie-player-stop" type="button" onClick={stop}>■ Stop playback</button>}
    </section>
  );
}
