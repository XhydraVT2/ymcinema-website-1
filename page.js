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
    <main className="wrap page">
      <div className="page-head">
        <p className="eyebrow">Browse</p>
        <h1 className="page-title">{data.title}</h1>
      </div>
      <Grid items={data.results} type={data.type} />
      <div className="pager">
        {page > 1 && (
          <Link className="glass" href={`/browse/${category}?page=${page - 1}`}>
            ← Prev
          </Link>
        )}
        <span>
          Page {page} of {total}
        </span>
        {page < total && (
          <Link className="glass" href={`/browse/${category}?page=${page + 1}`}>
            Next →
          </Link>
        )}
      </div>
    </main>
  );
}
