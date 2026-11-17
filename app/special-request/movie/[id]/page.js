import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { tmdb, IMG } from "../../../../lib/tmdb";
import SpecialRequestPlayer from "../../../../components/SpecialRequestPlayer";

export const dynamic = "force-dynamic";

export default async function SpecialRequestPage({ params }) {
  const { id } = await params;
  if (process.env.ENABLE_SPECIAL_REQUESTS !== "true" || !/^[1-9]\d{0,8}$/.test(id)) notFound();
  let movie;
  try { movie = await tmdb(`/movie/${id}`); } catch { notFound(); }
  return (
    <main className="test-stream-page">
      {movie.backdrop_path && <div className="test-stream-backdrop"><Image alt="" src={`${IMG}/w1280${movie.backdrop_path}`} fill sizes="100vw" priority /></div>}
      <div className="test-stream-inner">
        <nav className="test-stream-top"><Link href={`/movie/${id}`} className="test-stream-back">← Movie details</Link><span>YMCINEMA <b>· SPECIAL REQUESTS</b></span></nav>
        <header className="test-stream-header"><div className="test-stream-eyebrow">SPECIAL REQUESTS</div><h1>{movie.title || "Movie"}</h1><p>Additional options for this title, when available.</p></header>
        <SpecialRequestPlayer id={id}/>
      </div>
    </main>
  );
}
