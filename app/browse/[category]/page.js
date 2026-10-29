import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "../../../lib/tmdb";
import { Grid } from "../../../components/Cards";

export default async function Browse({ params, searchParams }) {
  const { category } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Math.min(500, parseInt(sp?.page || "1", 10) || 1));
  const data = await getCategory(category, page);
  if (!data) notFound();
  const total = Math.min(data.total_pages || 1, 500);
  return (
    <main className="wrap section">
      <h2 style={{ fontSize: 26, margin: "24px 0" }}>{data.title}</h2>
      <Grid items={data.results} type={data.type} />
      <div className="pager">
        {page > 1 && <Link href={`/browse/${category}?page=${page - 1}`}>← Prev</Link>}
        <span style={{ alignSelf: "center", color: "var(--muted)" }}>Page {page} of {total}</span>
        {page < total && <Link href={`/browse/${category}?page=${page + 1}`}>Next →</Link>}
      </div>
    </main>
  );
}
