import Link from "next/link";
import Hero from "../../components/Hero";
import Genres from "../../components/Genres";
import PlatformCarousel from "../../components/PlatformCarousel";
import AnimeProviders from "../../components/AnimeProviders";
import { Row, Top10 } from "../../components/Cards";
import { getCategory, getHeroSlides } from "../../lib/tmdb";
import { getProviders, getAnimeProviderTitles } from "../../lib/providers";

export const metadata = {
  title: "Anime | YMCINEMA",
  description: "Explore the latest Japanese anime series, anime movies, top-rated favourites and timeless classics on YMCINEMA.",
};

// Anime home follows the same sequence and components as the main Home page:
// cinematic hero, rows, streaming providers, Top 10, genre browser, platforms.
const BEFORE = [
  ["anime-latest-series", "Fresh releases", "Latest Anime Series"],
  ["anime-trending", "Trending now", "Trending Anime"],
  ["anime-latest-movies", "On the big screen", "Latest Anime Movies"],
];
const AFTER = [
  ["anime-popular-series", "Fan favourites", "Popular Anime Series"],
  ["anime-movies-popular", "Anime films", "Popular Anime Movies"],
  ["anime-top-rated", "Critically acclaimed", "Top Rated Anime Series"],
  ["anime-movies-top-rated", "Acclaimed films", "Top Rated Anime Movies"],
  ["anime-2020s", "This decade", "Anime of the 2020s"],
  ["anime-2010s", "The 2010s", "Anime of the 2010s"],
  ["anime-2000s", "Nostalgia", "Anime of the 2000s"],
  ["anime-1990s", "Retro picks", "Anime of the 1990s"],
  ["anime-classics", "Throwback", "Classic Anime Before 1990"],
  ["anime-upcoming-movies", "Coming soon", "Upcoming Anime Movies"],
];

export default async function AnimeHome({ searchParams }) {
  const sp = (await searchParams) || {};
  const topType = sp.top === "movie" ? "movie" : "tv";
  const providerType = sp.ptype === "movie" ? "movie" : "tv";
  const mkHref = (over = {}) => {
    const cur = { ptype: sp.ptype, p: sp.p, top: sp.top, ...over };
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(cur)) if (value) params.set(key, value);
    const qs = params.toString();
    return qs ? `/anime?${qs}` : "/anime";
  };

  let slides, top, rows;
  try {
    const keys = [...BEFORE, ...AFTER].map(([key]) => key);
    [top, ...rows] = await Promise.all([
      getCategory(topType === "movie" ? "anime-movies-top-rated" : "anime-top-rated"),
      ...keys.map((key) => getCategory(key)),
    ]);
    const trending = rows.find((row) => row.key === "anime-trending");
    slides = await getHeroSlides(trending?.results || [], 8, "tv");
  } catch (e) {
    console.error("Anime catalog could not load:", e);
    return (
      <main className="wrap page">
        <div className="err">
          <h2>Anime will be back shortly</h2>
          <p>Unable to load anime titles from TMDB. Please try again in a moment.</p>
        </div>
      </main>
    );
  }

  let providers = [], selectedProvider = null, providerTitles = [];
  try {
    providers = await getProviders(providerType, 18);
    selectedProvider = providers.find((p) => String(p.provider_id) === String(sp.p)) || providers[0] || null;
    if (selectedProvider) {
      const titles = await getAnimeProviderTitles(selectedProvider.provider_id, providerType);
      providerTitles = titles.results || [];
    }
  } catch (e) {
    console.error("Anime provider listings unavailable:", e);
  }

  const byKey = Object.fromEntries(rows.map((row) => [row.key, row]));
  const wide = ([key, eyebrow, title]) => (
    <Row key={key} eyebrow={eyebrow} title={title} href={`/browse/${key}`} items={byKey[key]?.results} type={byKey[key]?.type} />
  );

  return (
    <>
      <Hero slides={slides} tag="Anime" />
      <main className="wrap">
        {BEFORE.map(wide)}
        <AnimeProviders
          providers={providers}
          selected={selectedProvider}
          ptype={providerType}
          titles={providerTitles}
          mkHref={mkHref}
        />
        <Top10
          id="top10"
          eyebrow="All-time favourites"
          title="Top 10 Anime"
          items={top?.results || []}
          type={top?.type || "tv"}
          href={`/browse/${topType === "movie" ? "anime-movies-top-rated" : "anime-top-rated"}`}
          right={
            <div className="toggle glass">
              <Link className={topType === "tv" ? "on" : ""} href={mkHref({ top: "" }) + "#top10"} scroll={false}>Series</Link>
              <Link className={topType === "movie" ? "on" : ""} href={mkHref({ top: "movie" }) + "#top10"} scroll={false}>Movies</Link>
            </div>
          }
        />
        {AFTER.map(wide)}
        <Genres
          originalLanguage="ja"
          basePath="/anime/genre"
          movies={byKey["anime-latest-movies"]?.results || []}
          shows={byKey["anime-trending"]?.results || []}
        />
        <PlatformCarousel />
      </main>
    </>
  );
}
