import { getCategory, getHeroSlides } from "../lib/tmdb";

import Hero from "../components/Hero";
import { Row, Top10 } from "../components/Cards";

import Link from "next/link";

const BEFORE = [
  ["bollywood-latest", "Out now", "Just added Bollywood"],
  ["bollywood-trending", "Trending now", "Trending Bollywood"],
];
const AFTER = [
  ["bollywood-classics", "Throwback", "Bollywood classics"],
  ["bollywood-2000s", "Golden years", "Bollywood 2000–2014"],
  ["bollywood-upcoming", "Coming soon", "Upcoming Bollywood"],
  ["hindi-series", "Binge-worthy", "Hindi series & shows"],
  ["hollywood-trending", "Hollywood", "Trending Hollywood"],
  ["hollywood-top-rated", "Hollywood", "Top rated Hollywood"],
  ["tv-trending", "This week", "Trending TV"],
];

export default async function Home({ searchParams }) {
  const sp = (await searchParams) || {};
  const ptype = sp.ptype === "tv" ? "tv" : "movie";
  const ttype = sp.top === "tv" ? "tv" : "movie";

  // Build a home URL keeping the current choices, overriding some
  const mkHref = (over = {}) => {
    const cur = { ptype: sp.ptype, p: sp.p, top: sp.top, ...over };
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries(cur)) if (v) u.set(k, v);
    const s = u.toString();
    return s ? `/?${s}` : "/";
  };

  let slides, top, rows;
  try {
    const keys = [...BEFORE, ...AFTER].map((r) => r[0]);
    [slides, top, ...rows] = await Promise.all([
      getHeroSlides(),
      getCategory(ttype === "tv" ? "hindi-series-top" : "bollywood-top-rated"),
      ...keys.map((k) => getCategory(k)),
    ]);
  } catch (e) {
    return (
      <div className="err">
        <h2>Almost there</h2>
        <p>
          Could not load data from TMDB. Make sure the <code>TMDB_TOKEN</code> environment variable is set in Vercel,
          then redeploy.
        </p>
      </div>
    );
  }

  const byKey = Object.fromEntries(rows.map((r) => [r.key, r]));
  const wide = ([key, eyebrow, title]) => (
    <Row key={key} eyebrow={eyebrow} title={title} href={`/browse/${key}`} items={byKey[key]?.results} type={byKey[key]?.type} />
  );

  return (
    <>
      <Hero slides={slides} />
      <main className="wrap">
        {BEFORE.map(wide)}

        <Top10
          id="top10"
          eyebrow="All-time favourites"
          title="Top 10 Bollywood"
          items={top.results}
          type={top.type}
          href={`/browse/${ttype === "tv" ? "hindi-series-top" : "bollywood-top-rated"}`}
          right={
            <div className="toggle glass">
              <Link className={ttype === "movie" ? "on" : ""} href={mkHref({ top: "" }) + "#top10"} scroll={false}>
                Movies
              </Link>
              <Link className={ttype === "tv" ? "on" : ""} href={mkHref({ top: "tv" }) + "#top10"} scroll={false}>
                TV Shows
              </Link>
            </div>
          }
        />

        {AFTER.map(wide)}
      </main>
    </>
  );
}
