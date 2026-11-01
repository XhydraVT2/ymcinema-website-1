"use client";

import { useState } from "react";

const SOURCES = [
  { name: "Cinezo", origin: "https://player.cinezo.live", sandbox: true },
  { name: "Nxsha", origin: "https://nxsha.space", sandbox: false },
  { name: "Cinesrc", origin: "https://cinesrc.st", sandbox: false },
  { name: "Vidrift", origin: "https://embed.vidrift.net", sandbox: false },
];

export default function MoviePlayer({ movieId }) {
  const [selected, setSelected] = useState(0);
  const source = SOURCES[selected];
  const url = `${source.origin}/embed/movie/${encodeURIComponent(movieId)}?autoplay=true`;

  return (
    <section id="movie-player" className="movie-player-section">
      <div className="movie-player-heading">
        <div><small>Movie player</small><h2>Watch movie</h2></div>
        <label htmlFor="movie-source">Source</label>
        <select id="movie-source" value={selected} onChange={(event) => setSelected(Number(event.target.value))}>
          {SOURCES.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}
        </select>
      </div>
      <div className="movie-player-frame">
        <iframe key={url} src={url} title={`${source.name} movie player`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" {...(source.sandbox ? { sandbox: "allow-scripts allow-same-origin allow-forms allow-presentation" } : {})} />
      </div>
      <p className="movie-player-note">If a source is unavailable, select another source above. Only play content you are authorized to view.</p>
    </section>
  );
}
