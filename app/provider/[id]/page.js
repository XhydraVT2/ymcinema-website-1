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
    <main className="wrap page">
      <div className="page-head">
        <p className="eyebrow">Streaming · India</p>
        <h1 className="page-title">
          Hindi {type === "tv" ? "series" : "movies"} on {prov.provider_name}
        </h1>
      </div>
      <div style={{ marginBottom: 26 }}>
        <Link className={`pill ${type === "movie" ? "on" : ""}`} href={`${base}?type=movie`}>
          Movies
        </Link>
        <Link className={`pill ${type === "tv" ? "on" : ""}`} href={`${base}?type=tv`}>
          TV Shows
        </Link>
      </div>
      {data.results.length === 0 ? (
        <p className="sub">No Hindi titles listed for this platform right now.</p>
      ) : (
        <Grid items={data.results} type={type} />
      )}
      <div className="pager">
        {page > 1 && (
          <Link className="glass" href={`${base}?type=${type}&page=${page - 1}`}>
            ← Prev
          </Link>
        )}
        <span>
          Page {page} of {total}
        </span>
        {page < total && (
          <Link className="glass" href={`${base}?type=${type}&page=${page + 1}`}>
            Next →
          </Link>
        )}
      </div>
    </main>
  );
}
