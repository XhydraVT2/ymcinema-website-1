import Link from "next/link";
import Image from "next/image";
import { IMG } from "../lib/tmdb";

export function Card({ item, type }) {
  const t = type || item.media_type || (item.title ? "movie" : "tv");
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date || "";
  return (
    <Link href={`/${t}/${item.id}`} className="card">
      <div className="poster">
        {item.vote_average > 0 && <span className="badge">★ {item.vote_average.toFixed(1)}</span>}
        {item.poster_path && (
          <Image src={`${IMG}/w342${item.poster_path}`} alt={title} fill sizes="160px" />
        )}
      </div>
      <div className="meta">
        <div className="t">{title}</div>
        <div className="y">{date.slice(0, 4) || "TBA"}</div>
      </div>
    </Link>
  );
}

export function Row({ title, href, items, type }) {
  if (!items?.length) return null;
  return (
    <section className="section">
      <h2>
        {title}
        {href && <Link href={href}>See all →</Link>}
      </h2>
      <div className="row">
        {items.map((m) => (
          <Card key={m.id} item={m} type={type} />
        ))}
      </div>
    </section>
  );
}

export function Grid({ items, type }) {
  return (
    <div className="grid">
      {items.map((m) => (
        <Card key={m.id} item={m} type={type} />
      ))}
    </div>
  );
}
