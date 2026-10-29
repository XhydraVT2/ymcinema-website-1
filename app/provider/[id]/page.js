import Link from "next/link";
import { notFound } from "next/navigation";
import { getProviders, getProviderTitles } from "../../../lib/providers";
import { Grid } from "../../../components/Cards";

export default async function ProviderPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const type = sp?.type === "tv" ? "tv" : "movie";
  const page = Math.max(1, Math.min(500, parseInt(sp?.page || "1", 10) || 1));

  const [all, data] = await Promise.all([
    getProviders(type, 100),
    getProviderTitles(id, type, page).catch(() => null),
  ]);
  const prov = all.find((p) => String(p.provider_id) === String(id));
  if (!prov || !data) notFound();
  const total = Math.min(data.total_pages || 1, 500);
  const base = `/provider/${id}`;

  return (
    <main className="wrap section">
      <h2 style={{ fontSize: 26, margin: "24px 0 8px" }}>Hindi {type === "tv" ? "series" : "movies"} on {prov.provider_name}</h2>
      <div style={{ marginBottom: 20 }}>
        <Link className={`tag ${type === "movie" ? "on" : ""}`} href={`${base}?type=movie`}>Movies</Link>
        <Link className={`tag ${type === "tv" ? "on" : ""}`} href={`${base}?type=tv`}>TV Shows</Link>
      </div>
      {data.results.length === 0 ? (
        <p className="err">No Hindi titles listed for this platform right now.</p>
      ) : (
        <Grid items={data.results} type={type} />
      )}
      <div className="pager">
        {page > 1 && <Link href={`${base}?type=${type}&page=${page - 1}`}>← Prev</Link>}
        <span style={{ alignSelf: "center", color: "var(--muted)" }}>Page {page} of {total}</span>
        {page < total && <Link href={`${base}?type=${type}&page=${page + 1}`}>Next →</Link>}
      </div>
    </main>
  );
}
