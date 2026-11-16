import Link from "next/link";
import { notFound } from "next/navigation";
import { getProviders, getAnimeProviderTitles } from "../../../../lib/providers";
import { Grid } from "../../../../components/Cards";

export default async function AnimeProviderPage({ params, searchParams }) {
  const { id } = await params;
  const sp = (await searchParams) || {};
  const type = sp.type === "movie" ? "movie" : "tv";
  const page = Math.max(1, Math.min(500, Number.parseInt(sp.page || "1", 10) || 1));
  const [all, data] = await Promise.all([
    getProviders(type, 100),
    getAnimeProviderTitles(id, type, page).catch(() => null),
  ]);
  const provider = all.find((p) => String(p.provider_id) === String(id));
  if (!provider || !data) notFound();
  const total = Math.min(data.total_pages || 1, 500);
  const base = `/anime/provider/${id}`;
  return (
    <main className="wrap page">
      <div className="page-head">
        <p className="eyebrow">Anime streaming · India</p>
        <h1 className="page-title">Anime {type === "tv" ? "series" : "movies"} on {provider.provider_name}</h1>
      </div>
      <div style={{ marginBottom: 26 }}>
        <Link className={`pill ${type === "tv" ? "on" : ""}`} href={`${base}?type=tv`}>Series</Link>
        <Link className={`pill ${type === "movie" ? "on" : ""}`} href={`${base}?type=movie`}>Movies</Link>
      </div>
      {data.results?.length ? <Grid items={data.results} type={type} /> : <p className="sub">No anime titles listed for this platform right now.</p>}
      <div className="pager">
        {page > 1 && <Link className="glass" href={`${base}?type=${type}&page=${page - 1}`}>← Prev</Link>}
        <span>Page {page} of {total}</span>
        {page < total && <Link className="glass" href={`${base}?type=${type}&page=${page + 1}`}>Next →</Link>}
      </div>
    </main>
  );
}
