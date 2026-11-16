import Link from "next/link";
import { tmdb } from "../../../../../lib/tmdb";
import { Grid } from "../../../../../components/Cards";

const NAMES = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 27: "Horror",
  10749: "Romance", 878: "Science Fiction", 53: "Thriller", 10759: "Action & Adventure",
  10765: "Sci-Fi & Fantasy", 9648: "Mystery",
};

export default async function AnimeGenre({ params, searchParams }) {
  const { type, id } = await params;
  const sp = (await searchParams) || {};
  if (!["movie", "tv"].includes(type) || !/^\d+$/.test(id) || !NAMES[id]) {
    return <main className="wrap genre-page"><h1>Genre not found</h1></main>;
  }
  const page = Math.max(1, Math.min(500, Number.parseInt(sp.page || "1", 10) || 1));
  let data = null;
  try {
    data = await tmdb(`/discover/${type}`, {
      with_genres: id === "16" ? "16" : `16,${id}`,
      with_original_language: "ja",
      sort_by: "popularity.desc",
      page: String(page),
    });
  } catch (e) { console.error("Anime genre unavailable:", e); }
  const total = Math.min(data?.total_pages || 1, 500);
  const base = `/anime/genre/${type}/${id}`;
  return (
    <main className="wrap genre-page">
      <Link className="pill-link glass" href="/anime#genres">← Back to anime genres</Link>
      <p className="eyebrow">Explore Japanese anime {type === "tv" ? "series" : "movies"}</p>
      <h1>{NAMES[id]} Anime</h1>
      {!data ? <p>Titles are unavailable right now.</p> : data.results?.length ? <Grid items={data.results} type={type} /> : <p>No titles found for this genre.</p>}
      {data && total > 1 && (
        <div className="pager">
          {page > 1 && <Link className="glass" href={`${base}?page=${page - 1}`}>← Prev</Link>}
          <span>Page {page} of {total}</span>
          {page < total && <Link className="glass" href={`${base}?page=${page + 1}`}>Next →</Link>}
        </div>
      )}
    </main>
  );
}
