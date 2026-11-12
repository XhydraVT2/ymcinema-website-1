import PlayIcon from "../components/PlayIcon";
import TrailerIcon from "../components/TrailerIcon";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tmdb, IMG } from "./tmdb";
import { getSmartRecommendations } from "./recommendations";
import { Row, Section } from "../components/Cards";
import EpisodeBrowser from "../components/EpisodeBrowser";
import Reveal from "../components/Reveal";
import CastCarousel from "../components/CastCarousel";


const fmtDate = (d) =>
  d ? new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }) : "TBA";
const fmtRuntime = (m) => (m ? `${Math.floor(m / 60) ? Math.floor(m / 60) + "h " : ""}${m % 60}m` : null);

// Shared detail view for /movie/[id] and /tv/[id]
export async function Detail({ type, id }) {
  let d;
  try {
    d = await tmdb(`/${type}/${id}`, { append_to_response: "credits,videos" });
  } catch {
    notFound();
  }
  const smartRecommendations = await getSmartRecommendations(type, d);
  const seasons = type === "tv" ? (d.seasons || []).filter(s => s.season_number > 0) : [];
  const episodePairs = type === "tv" ? await Promise.all(seasons.map(async s => {
    try { const data = await tmdb(`/tv/${id}/season/${s.season_number}`); return [String(s.season_number), data.episodes || []]; }
    catch { return [String(s.season_number), []]; }
  })) : [];
  const episodesBySeason = Object.fromEntries(episodePairs);
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
        <div className="d-body">

          <div className="d-info detail-enter-info">
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
                <PlayIcon /> Play
              </Link>
              {type === "movie" && process.env.ENABLE_TEST_STREAM !== "false" && (
                <Link className="btn glass test-stream-detail-button" href={`/test-stream/movie/${id}`}>
                  <PlayIcon /> Test Stream <span className="test-stream-beta">BETA</span>
                </Link>
              )}
              {trailer && (
                <a className="btn glass" href="#trailer"><TrailerIcon /> Trailer</a>
              )}
              <a className="btn glass d-action-icon" href="#cast" aria-label="View cast">♧</a>
              <a className="btn glass d-action-icon" href={`https://www.themoviedb.org/${type}/${id}`} target="_blank" rel="noopener noreferrer" aria-label="Movie information on TMDB">↗</a>
            </div>
          </div>
          <aside className="d-trailer-panel glass detail-enter-aside">
            <div className="d-trailer-eyebrow">OFFICIAL TRAILER</div>
            {trailer ? <a href="#trailer" className="d-trailer-preview">{d.backdrop_path&&<Image src={`${IMG}/w500${d.backdrop_path}`} alt="" fill sizes="320px"/>}<span className="d-trailer-play"><PlayIcon size={22} /></span><span className="d-trailer-caption">Watch trailer ↗</span></a> : <p>Trailer unavailable</p>}
            <div className="d-trailer-cast"><small>STARRING</small><div className="d-cast-faces">{cast.slice(0,5).map(c=>c.profile_path?<Image key={c.id} src={`${IMG}/w185${c.profile_path}`} alt={c.name} width={37} height={37}/>:null)}</div><p>{cast.slice(0,3).map(c=>c.name).join(", ")}</p></div>
          </aside>
        </div>

        <div className="d-infobar-shell detail-enter-bar">
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

      <main className="wrap detail-lower" style={{ paddingTop: 30 }}>
        {type === "tv" && <EpisodeBrowser id={id} seasons={seasons} episodesBySeason={episodesBySeason} />}

        {trailer && (
          <Section id="trailer" eyebrow="Official" title="Trailer">
            <Reveal className="detail-reveal-block"><div className="glass trailer">
              <div className="vid">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  allow="encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div></Reveal>
          </Section>
        )}

        {cast.length > 0 && (
          <Section id="cast" eyebrow="Starring" title="Cast">
            <Reveal className="detail-reveal-block"><CastCarousel>
              {cast.map((c) => (
                <div className="pcard" key={c.credit_id}>
                  <div className="ph">
                    {c.profile_path && <Image src={`${IMG}/w185${c.profile_path}`} alt={c.name} fill sizes="132px" />}
                  </div>
                  <div className="n">{c.name}</div>
                  <div className="c">{c.character}</div>
                </div>
              ))}
            </CastCarousel></Reveal>
          </Section>
        )}

        <Row eyebrow="You may also like" title="More like this" items={smartRecommendations} type={type} />
      </main>
    </>
  );
}
