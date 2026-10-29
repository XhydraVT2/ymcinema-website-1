"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const IMG = "https://image.tmdb.org/t/p";

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "l" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
    </svg>
  );
}

export default function Hero({ slides }) {
  const n = slides.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((k) => setI(((k % n) + n) % n), [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), 9000);
    return () => clearTimeout(t);
  }, [i, paused, n]);

  if (!n) return null;
  const s = slides[i];
  const filled = Math.max(0, Math.min(5, Math.round(s.rating / 2)));
  const upNext = n > 1 ? [1, 2, 3].map((k) => (i + k) % n).filter((idx, p, arr) => idx !== i && arr.indexOf(idx) === p) : [];

  return (
    <header className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.map((sl, k) => (
        <div key={sl.id} className={`hero-bg ${k === i ? "on" : ""}`}>
          <Image src={`${IMG}/w1280${sl.backdrop}`} alt="" fill sizes="100vw" priority={k === 0} />
        </div>
      ))}

      <div className="hero-content wrap">
        <div className="hero-info" key={s.id}>
          <div className="hero-tag">
            <span className="brand glass">YMCINEMA</span>
            <span>
              ● #{i + 1} Trending · {s.type === "tv" ? "Series" : "Movie"}
              {s.year ? ` · ${s.year}` : ""}
            </span>
          </div>

          {s.logo ? (
            <img className="hero-logo" src={`${IMG}/w500${s.logo}`} alt={s.title} />
          ) : (
            <h1 className="hero-title">{s.title}</h1>
          )}

          <div className="hero-meta">
            <span className="stars" aria-label={`Rated ${s.rating.toFixed(1)} out of 10`}>
              {"★".repeat(filled)}
              <span className="off">{"★".repeat(5 - filled)}</span>
            </span>
            <span className="hero-pct">{Math.round(s.rating * 10)}%</span>
            {s.genres.map((g) => (
              <span className="pill" key={g} style={{ margin: 0 }}>
                {g}
              </span>
            ))}
          </div>

          <p className="hero-desc">{s.overview}</p>

          <div className="hero-actions">
            <Link className="btn primary" href={`/${s.type}/${s.id}#watch`}>
              ▶ Play
            </Link>
            <Link className="btn glass" href={`/${s.type}/${s.id}`}>
              ⓘ More Info
            </Link>
          </div>

          <div className="hero-nav">
            <div className="segs">
              {slides.map((sl, k) => (
                <button
                  key={sl.id}
                  aria-label={`Go to slide ${k + 1}`}
                  className={`seg ${k < i ? "done" : ""} ${k === i ? "on" : ""} ${paused ? "paused" : ""}`}
                  onClick={() => go(k)}
                />
              ))}
            </div>
            <button className="round" aria-label="Previous" onClick={() => go(i - 1)}>
              <Chevron dir="l" />
            </button>
            <button className="round" aria-label="Next" onClick={() => go(i + 1)}>
              <Chevron dir="r" />
            </button>
          </div>
        </div>
      </div>

      {upNext.length > 0 && (
        <aside className="upnext">
          <div className="lbl">UP NEXT</div>
          <div className="upnext-row">
            {upNext.map((idx) => (
              <button key={slides[idx].id} className="un" onClick={() => go(idx)}>
                <div className="th">
                  <Image src={`${IMG}/w500${slides[idx].backdrop}`} alt={slides[idx].title} fill sizes="200px" />
                </div>
                <div className="nm">{slides[idx].title}</div>
              </button>
            ))}
          </div>
        </aside>
      )}
    </header>
  );
}
