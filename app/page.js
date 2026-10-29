import Link from "next/link";
import Image from "next/image";
import { getCategory, IMG } from "../lib/tmdb";
import { Row } from "../components/Cards";
import { Providers } from "../components/Providers";
import { getProviders } from "../lib/providers";

export const revalidate = 3600;

const ROWS = [
  "bollywood-latest",
  "bollywood-trending",
  "bollywood-top-rated",
  "bollywood-2000s",
  "bollywood-classics",
  "bollywood-upcoming",
  "hindi-series",
  "hollywood-trending",
  "hollywood-top-rated",
  "tv-trending",
];

export default async function Home() {
  let rows, providers;
  try {
    [rows, providers] = await Promise.all([
      Promise.all(ROWS.map((k) => getCategory(k))),
      getProviders("movie"),
    ]);
  } catch (e) {
    return (
      <div className="err">
        <h2>Almost there</h2>
        <p>Could not load data from TMDB. Make sure the <code>TMDB_TOKEN</code> environment variable is set.</p>
      </div>
    );
  }
  const featured = (rows[1].results || []).find((m) => m.backdrop_path);
  return (
    <>
      {featured && (
        <header className="hero">
          <Image src={`${IMG}/original${featured.backdrop_path}`} alt={featured.title} fill priority sizes="100vw" />
          <div className="wrap info">
            <h1>{featured.title}</h1>
            <p>{featured.overview}</p>
            <Link className="btn" href={`/movie/${featured.id}`}>View details</Link>
          </div>
        </header>
      )}
      <main className="wrap">
        <Providers providers={providers} />
        {rows.map((r) => (
          <Row key={r.key} title={r.title} href={`/browse/${r.key}`} items={r.results} type={r.type} />
        ))}
      </main>
    </>
  );
}
