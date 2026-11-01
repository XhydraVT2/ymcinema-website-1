import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tmdb, IMG } from "./tmdb";
import { Row, Section } from "../components/Cards";


const fmtDate = (d) =>
  d ? new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }) : "TBA";
const fmtRuntime = (m) => (m ? `${Math.floor(m / 60) ? Math.floor(m / 60) + "h " : ""}${m % 60}m` : null);

// Shared detail view for /movie/[id] and /tv/[id]
export async function Detail({ type, id }) {
  let d;
  try {
    d = await tmdb(`/${type}/${id}`, { append_to_response: "credits,videos,similar" });
  } catch {
    notFound();
  }
  const title = d.title || d.name;
  const date = d.release_date || d.first_air_date || "";
  const runtime = d.runtime || (d.episode_run_time && d.episode_run_time[0]) || null;
  const vids = d.videos?.results || [];
  const trailer = vids.find((v) => v.site === "YouTube" && v.type === "Trailer") || vids.find((v) => v.site === "YouTube");
  const cast = (d.credits?.cast || []).slice(0, 14);
  const crew = d.credits?.crew || [];
  const director =
    type === "movie" ? crew.find((c) => c.job === "Director")?.name : (d.created_by || []).map((c) => c.name).join(", ");
  const rating = d.vote_average || 0;
  const filled = Math.max(0, Math.min(5, Math.round(rating / 2)));
  const lang = d.spoken_languages?.[0]?.english_name || (d.original_language || "").toUpperCase();
  const studios = (d.production_companies || []).slice(0, 2);

  return (
    <>
      <section className="d-hero">
        {d.backdrop_path && (
          <div className="d-bg">
            <Image src={`${IMG}/w1280${d.backdrop_path}`} alt="" fill sizes="100vw" priority />
          </div>
        )}
        <div className="wrap d-body">
          <div className="d-poster glass">
            {d.poster_path && <Image src={`${IMG}/w500${d.poster_path}`} alt={title} fill sizes="300px" priority />}
          </div>

          <div className="d-info">
            <div className="hero-tag">
              <span className="brand glass">YMCINEMA</span>
              <span>
                ● {type === "tv" ? "Series" : "Movie"}
                {date ? ` · ${date.slice(0, 4)}` : ""}
                {runtime ? ` · ${fmtRuntime(runtime)}` : ""}
              </span>
            </div>
            <h1>{title}</h1>
            {d.tagline && <p className="tagline">{d.tagline}</p>}

            <div className="hero-meta">
              <span className="stars">
                {"★".repeat(filled)}
                <span className="off">{"★".repeat(5 - filled)}</span>
              </span>
              <span className="hero-pct">
                {Math.round(rating * 10)}% <span style={{ color: "var(--muted)", fontWeight: 500 }}>({d.vote_count})</span>
              </span>
              {(d.genres || []).map((g) => (
                <span className="pill" key={g.id} style={{ margin: 0 }}>
                  {g.name}
                </span>
              ))}
            </div>

            <p className="ov">{d.overview || "No overview available."}</p>
            {director && (
              <p className="facts">
                {type === "movie" ? "DIRECTED BY" : "CREATED BY"} <b>{director}</b>
              </p>
            )}

            <div className="hero-actions">
              <Link className="btn primary" href={`/watch/${type}/${id}`}>
                ▶ Play
              </Link>
              {trailer && (
                <a className="btn glass" href="#trailer">
                  🎬 Trailer
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="wrap" style={{ position: "relative", zIndex: 3, marginTop: 34 }}>
          <div className="glass infobar">
            <div>
              <small>Status</small>
              <b>{d.status || "—"}</b>
            </div>
            {runtime && (
              <div>
                <small>Runtime</small>
                <b>{fmtRuntime(runtime)}</b>
              </div>
            )}
            {type === "tv" && d.number_of_seasons ? (
              <div>
                <small>Seasons</small>
                <b>{d.number_of_seasons}</b>
              </div>
            ) : null}
            <div>
              <small>Language</small>
              <b>{lang || "—"}</b>
            </div>
            <div>
              <small>Released</small>
              <b>{fmtDate(date)}</b>
            </div>
            {studios.length > 0 && (
              <div className="studios">
                <small>Studios</small>
                <b>{studios.map((s) => s.name).join(" · ")}</b>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="wrap" style={{ paddingTop: 30 }}>

        {trailer && (
          <Section id="trailer" eyebrow="Official" title="Trailer">
            <div className="glass trailer">
              <div className="vid">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  allow="encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </Section>
        )}

        {cast.length > 0 && (
          <Section eyebrow="Starring" title="Cast">
            <div className="cast-row">
              {cast.map((c) => (
                <div className="pcard" key={c.credit_id}>
                  <div className="ph">
                    {c.profile_path && <Image src={`${IMG}/w185${c.profile_path}`} alt={c.name} fill sizes="132px" />}
                  </div>
                  <div className="n">{c.name}</div>
                  <div className="c">{c.character}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Row eyebrow="You may also like" title="More like this" items={d.similar?.results} type={type} />
      </main>
    </>
  );
}
