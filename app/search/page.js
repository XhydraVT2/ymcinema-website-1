import { tmdb } from "../../lib/tmdb";
import { Grid } from "../../components/Cards";

export default async function Search({ searchParams }) {
  const sp = await searchParams;
  const q = (sp?.q || "").trim();
  let results = [];
  if (q) {
    const data = await tmdb("/search/multi", { query: q, include_adult: "false" });
    results = (data.results || []).filter((r) => r.media_type === "movie" || r.media_type === "tv");
  }
  return (
    <main className="wrap page">
      <div className="page-head">
        <p className="eyebrow">Search</p>
        <h1 className="page-title">{q ? `Results for “${q}”` : "Search movies & shows"}</h1>
      </div>
      {q && results.length === 0 && <p className="sub">Nothing found. Try another title.</p>}
      {!q && <p className="sub">Use the search icon in the top bar.</p>}
      <Grid items={results} />
    </main>
  );
}
