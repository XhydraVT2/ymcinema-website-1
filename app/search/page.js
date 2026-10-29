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
    <main className="wrap section">
      <h2 style={{ fontSize: 26, margin: "24px 0" }}>{q ? `Results for “${q}”` : "Search"}</h2>
      {q && results.length === 0 && <p className="err">Nothing found.</p>}
      <Grid items={results} />
    </main>
  );
}
