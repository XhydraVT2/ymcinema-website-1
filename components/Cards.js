import Link from "next/link";
import Image from "next/image";
import CarouselRail from "./CarouselRail";
import SpotlightCard from "./SpotlightCard";
import Reveal from "./Reveal";
import { IMG } from "../lib/tmdb";

function typeOf(item, type) {
  return type || item.media_type || (item.title ? "movie" : "tv");
}

export function Card({ item, type }) {
  const t = typeOf(item, type);
  const title = item.title || item.name || "Untitled";
  const date = item.release_date || item.first_air_date || "";
  const src = item.backdrop_path
    ? `${IMG}/w780${item.backdrop_path}`
    : item.poster_path
    ? `${IMG}/w500${item.poster_path}`
    : null;
  return (
    <Reveal className="reveal-card"><SpotlightCard><Link href={`/${t}/${item.id}`} className="wcard premium-card">
      <div className="thumb">
        <span className="glass-sheen" aria-hidden="true" />
        <span className="glass-play" aria-hidden="true">▶</span>
        <span className="cinema-card-info" aria-hidden="true"><span className="cinema-card-kicker">{t === "tv" ? "TV SERIES" : "FEATURE FILM"} · {date.slice(0,4) || "COMING SOON"}</span><strong>{title}</strong><span className="cinema-card-watch">View details <span>↗</span></span></span>
        {src ? (
          <Image src={src} alt={title} fill sizes="(max-width: 700px) 80vw, 370px" />
        ) : (
          <div className="noimg">{title.slice(0, 1)}</div>
        )}
      </div>
      <div className="wt">{title}</div>
      <div className="wm">
        <span className="kind">{t === "tv" ? "SERIES" : "MOVIE"}</span>
        <span>{date.slice(0, 4) || "TBA"}</span>
        {item.vote_average > 0 && <span className="rt">★ {item.vote_average.toFixed(1)}</span>}
      </div>
    </Link></SpotlightCard></Reveal>
  );
}

export function Section({ eyebrow, title, href, hrefLabel = "Browse all ↗", right, children, id }) {
  return (
    <section className="sec" id={id}>
      <Reveal className="reveal-section-head">
      <div className="sec-head">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
        </div>
        <div className="head-right">
          {right}
          {href && (
            <Link className="pill-link glass" href={href}>
              {hrefLabel}
            </Link>
          )}
        </div>
      </div>
      </Reveal>
      {children}
    </section>
  );
}

export function Row({ eyebrow, title, href, items, type }) {
  if (!items?.length) return null;
  return (
    <Section eyebrow={eyebrow} title={title} href={href}>
      <CarouselRail label={title}>
        {items.map((m) => (
          <Card key={m.id} item={m} type={type} />
        ))}
      </CarouselRail>
    </Section>
  );
}

export function Grid({ items, type }) {
  return (
    <div className="wgrid">
      {items.map((m) => (
        <Card key={m.id} item={m} type={type} />
      ))}
    </div>
  );
}

export function Top10({ items, type, eyebrow, title, right, href, id }) {
  const list = (items || []).filter((m) => m.backdrop_path || m.poster_path).slice(0, 10);
  if (!list.length) return null;
  return (
    <Section eyebrow={eyebrow} title={title} right={right} href={href} id={id}>
      <CarouselRail ranked label={`${title} rankings`}>
        {list.map((m, idx) => {
          const mediaType = typeOf(m, type);
          const name = m.title || m.name || "Untitled";
          const year = (m.release_date || m.first_air_date || "").slice(0, 4);
          return (
            <Reveal key={`${mediaType}-${m.id}`} className="rank-reveal">
              <Link href={`/${mediaType}/${m.id}`} className="t10 t10-premium" aria-label={`Number ${idx + 1}: ${name}`}>
                <div className="rank-art">
                  <span className="num" aria-hidden="true">{idx + 1}</span>
                  <div className="pp">
                    {m.vote_average > 0 && <span className="rtg">★ {m.vote_average.toFixed(1)}</span>}
                    <Image src={`${IMG}/${m.backdrop_path ? "w780" : "w500"}${m.backdrop_path || m.poster_path}`} alt={name} fill sizes="(max-width: 600px) 78vw, 360px" />
                    <span className="rank-gloss" aria-hidden="true" />
                  </div>
                </div>
                <div className="rank-title" title={name}>{name}</div>
                <div className="wm"><span className="kind">{mediaType === "tv" ? "SERIES" : "MOVIE"}</span><span>{year || "TBA"}</span></div>
              </Link>
            </Reveal>
          );
        })}
      </CarouselRail>
    </Section>
  );
}
