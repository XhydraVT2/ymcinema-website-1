import Image from "next/image";
import { notFound } from "next/navigation";
import { tmdb, IMG } from "./tmdb";
import { Row } from "../components/Cards";

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
  const runtime = d.runtime || (d.episode_run_time && d.episode_run_time[0]);
  const trailer = (d.videos?.results || []).find((v) => v.site === "YouTube" && v.type === "Trailer");
  const cast = (d.credits?.cast || []).slice(0, 12);
  const crew = d.credits?.crew || [];
  const director = crew.find((c) => c.job === "Director");

  return (
    <>
      <section className="detail">
        {d.backdrop_path && (
          <div className="bd">
            <Image src={`${IMG}/w1280${d.backdrop_path}`} alt="" fill sizes="100vw" />
          </div>
        )}
        <div className="wrap body">
          <div className="pimg">
            {d.poster_path && <Image src={`${IMG}/w500${d.poster_path}`} alt={title} fill sizes="280px" priority />}
          </div>
          <div className="txt">
            <h1>{title}</h1>
            {d.tagline && <p style={{ color: "var(--muted)", fontStyle: "italic" }}>{d.tagline}</p>}
            <div style={{ margin: "10px 0" }}>
              {d.vote_average > 0 && <span className="tag">★ {d.vote_average.toFixed(1)}</span>}
              {date && <span className="tag">{date.slice(0, 4)}</span>}
              {runtime ? <span className="tag">{runtime} min</span> : null}
              {d.original_language && <span className="tag">{d.original_language.toUpperCase()}</span>}
              {type === "tv" && d.number_of_seasons ? <span className="tag">{d.number_of_seasons} seasons</span> : null}
              {(d.genres || []).map((g) => <span className="tag" key={g.id}>{g.name}</span>)}
            </div>
            <p className="ov">{d.overview || "No overview available."}</p>
            {director && <p><strong>Director:</strong> {director.name}</p>}
            {trailer && (
              <div className="trailer">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  allow="encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      </section>
      <main className="wrap">
        {cast.length > 0 && (
          <section className="section cast">
            <h2>Cast</h2>
            <div className="row">
              {cast.map((c) => (
                <div className="card" key={c.credit_id}>
                  <div className="poster">
                    {c.profile_path && <Image src={`${IMG}/w185${c.profile_path}`} alt={c.name} fill sizes="120px" />}
                  </div>
                  <div className="meta">
                    <div className="t">{c.name}</div>
                    <div className="y">{c.character}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <Row title="More like this" items={d.similar?.results} type={type} />
      </main>
    </>
  );
}
