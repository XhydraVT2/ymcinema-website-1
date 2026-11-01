import Link from "next/link";
import Image from "next/image";
import CarouselRail from "./CarouselRail";
import SpotlightCard from "./SpotlightCard";
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
    <SpotlightCard><Link href={`/${t}/${item.id}`} className="wcard premium-card">
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
    </Link></SpotlightCard>
  );
}

export function Section({ eyebrow, title, href, hrefLabel = "Browse all ↗", right, children, id }) {
  return (
    <section className="sec" id={id}>
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
      {children}
    </section>
  );
}

export function Row({ eyebrow, title, href, items, type }) {
  if (!items?.length) return null;
  return (
    <Section eyebrow={eyebrow} title={title} href={href}>
      <CarouselRail>
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
  const list = (items || []).filter((m) => m.poster_path).slice(0, 10);
  if (!list.length) return null;
  return (
    <Section eyebrow={eyebrow} title={title} right={right} href={href} id={id}>
      <div className="top10">
        {list.map((m, idx) => (
          <Link key={m.id} href={`/${type}/${m.id}`} className="t10">
            <span className="num">{idx + 1}</span>
            <div className="pp">
              {m.vote_average > 0 && <span className="rtg">★ {m.vote_average.toFixed(1)}</span>}
              <Image src={`${IMG}/w342${m.poster_path}`} alt={m.title || m.name} fill sizes="180px" />
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
