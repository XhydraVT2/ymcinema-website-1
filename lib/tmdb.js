const BASE = "https://api.themoviedb.org/3";
export const IMG = "https://image.tmdb.org/t/p";

export async function tmdb(path, params = {}) {
  const token = process.env.TMDB_TOKEN;
  if (!token) throw new Error("TMDB_TOKEN is not set");
  const qs = new URLSearchParams({ language: "en-US", ...params });
  const res = await fetch(`${BASE}${path}?${qs}`, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status} on ${path}`);
  return res.json();
}

const today = () => new Date().toISOString().slice(0, 10);

// Bollywood = Hindi-language films, produced/released in India
const BOLLY = { with_original_language: "hi", region: "IN" };

export const CATEGORIES = {
  "bollywood-latest": {
    title: "Latest Bollywood",
    path: "/discover/movie",
    params: { ...BOLLY, sort_by: "primary_release_date.desc", "primary_release_date.lte": today(), "vote_count.gte": "5" },
  },
  "bollywood-trending": {
    title: "Trending Bollywood",
    path: "/discover/movie",
    params: { ...BOLLY, sort_by: "popularity.desc", "primary_release_date.lte": today() },
  },
  "bollywood-top-rated": {
    title: "Top Rated Bollywood",
    path: "/discover/movie",
    params: { ...BOLLY, sort_by: "vote_average.desc", "vote_count.gte": "300" },
  },
  "bollywood-classics": {
    title: "Bollywood Classics (before 2000)",
    path: "/discover/movie",
    params: { ...BOLLY, sort_by: "vote_average.desc", "primary_release_date.lte": "1999-12-31", "vote_count.gte": "30" },
  },
  "bollywood-2000s": {
    title: "Bollywood 2000–2014",
    path: "/discover/movie",
    params: { ...BOLLY, sort_by: "popularity.desc", "primary_release_date.gte": "2000-01-01", "primary_release_date.lte": "2014-12-31", "vote_count.gte": "50" },
  },
  "bollywood-upcoming": {
    title: "Upcoming Bollywood",
    path: "/discover/movie",
    params: { ...BOLLY, sort_by: "primary_release_date.asc", "primary_release_date.gte": today() },
  },
  "hindi-series": {
    title: "Hindi Series & Shows",
    path: "/discover/tv",
    params: { with_original_language: "hi", sort_by: "popularity.desc" },
    type: "tv",
  },
  "hindi-series-top": {
    title: "Top Rated Hindi Series",
    path: "/discover/tv",
    params: { with_original_language: "hi", sort_by: "vote_average.desc", "vote_count.gte": "50" },
    type: "tv",
  },
  "hollywood-trending": {
    title: "Trending Hollywood",
    path: "/discover/movie",
    params: { with_original_language: "en", region: "US", sort_by: "popularity.desc", "primary_release_date.lte": today() },
  },
  "hollywood-top-rated": {
    title: "Top Rated Hollywood",
    path: "/movie/top_rated",
    params: { region: "US" },
  },
  "tv-trending": {
    title: "Trending TV",
    path: "/trending/tv/week",
    params: {},
    type: "tv",
  },
  // Anime catalog: original Japanese-language animation (TMDB genre 16).
  // Movies and TV are kept separate so each card opens the correct detail page.
  "anime-latest-series": {
    title: "Latest Anime Series",
    path: "/discover/tv",
    params: { with_original_language: "ja", with_genres: "16", sort_by: "first_air_date.desc", "first_air_date.lte": today(), "vote_count.gte": "2" },
    type: "tv",
  },
  "anime-trending": {
    title: "Trending Anime",
    path: "/discover/tv",
    // Trending should feel recent. Older ongoing franchises remain discoverable
    // under Popular Anime and their decade/classic rows instead.
    params: { with_original_language: "ja", with_genres: "16", sort_by: "popularity.desc", "first_air_date.gte": `${new Date().getUTCFullYear() - 2}-01-01`, "first_air_date.lte": today() },
    type: "tv",
  },
  "anime-popular-series": {
    title: "Popular Anime Series",
    path: "/discover/tv",
    params: { with_original_language: "ja", with_genres: "16", sort_by: "popularity.desc", "vote_count.gte": "100" },
    type: "tv",
  },
  "anime-top-rated": {
    title: "Top Rated Anime Series",
    path: "/discover/tv",
    params: { with_original_language: "ja", with_genres: "16", sort_by: "vote_average.desc", "vote_count.gte": "200" },
    type: "tv",
  },
  "anime-latest-movies": {
    title: "Latest Anime Movies",
    path: "/discover/movie",
    params: { with_original_language: "ja", with_genres: "16", sort_by: "primary_release_date.desc", "primary_release_date.lte": today(), "vote_count.gte": "2" },
  },
  "anime-movies-popular": {
    title: "Popular Anime Movies",
    path: "/discover/movie",
    params: { with_original_language: "ja", with_genres: "16", sort_by: "popularity.desc", "primary_release_date.lte": today() },
  },
  "anime-movies-top-rated": {
    title: "Top Rated Anime Movies",
    path: "/discover/movie",
    params: { with_original_language: "ja", with_genres: "16", sort_by: "vote_average.desc", "vote_count.gte": "100" },
  },
  "anime-2020s": {
    title: "Anime of the 2020s",
    path: "/discover/tv",
    params: { with_original_language: "ja", with_genres: "16", "first_air_date.gte": "2020-01-01", "first_air_date.lte": today(), sort_by: "popularity.desc" },
    type: "tv",
  },
  "anime-2010s": {
    title: "Anime of the 2010s",
    path: "/discover/tv",
    params: { with_original_language: "ja", with_genres: "16", "first_air_date.gte": "2010-01-01", "first_air_date.lte": "2019-12-31", sort_by: "popularity.desc" },
    type: "tv",
  },
  "anime-2000s": {
    title: "Anime of the 2000s",
    path: "/discover/tv",
    params: { with_original_language: "ja", with_genres: "16", "first_air_date.gte": "2000-01-01", "first_air_date.lte": "2009-12-31", sort_by: "popularity.desc" },
    type: "tv",
  },
  "anime-1990s": {
    title: "Anime of the 1990s",
    path: "/discover/tv",
    params: { with_original_language: "ja", with_genres: "16", "first_air_date.gte": "1990-01-01", "first_air_date.lte": "1999-12-31", sort_by: "popularity.desc" },
    type: "tv",
  },
  "anime-classics": {
    title: "Classic Anime Before 1990",
    path: "/discover/tv",
    params: { with_original_language: "ja", with_genres: "16", "first_air_date.lte": "1989-12-31", sort_by: "popularity.desc" },
    type: "tv",
  },
  "anime-upcoming-movies": {
    title: "Upcoming Anime Movies",
    path: "/discover/movie",
    params: { with_original_language: "ja", with_genres: "16", sort_by: "primary_release_date.asc", "primary_release_date.gte": today() },
  },
};

export async function getCategory(key, page = 1) {
  const c = CATEGORIES[key];
  if (!c) return null;
  const data = await tmdb(c.path, { ...c.params, page: String(page) });
  return { ...c, key, type: c.type || "movie", ...data };
}

// Use the same movie IDs and order as the homepage Trending Bollywood rail.
// Fetch details only to enrich the slides with title artwork, genres and descriptions.
export async function getHeroSlides(trendingMovies = [], count = 8, mediaType = "movie") {
  const picks = trendingMovies.filter((m) => m.backdrop_path).slice(0, count);
  const full = await Promise.all(
    picks.map((m) => {
      const type = m.media_type === "movie" || m.media_type === "tv" ? m.media_type : mediaType;
      return tmdb(`/${type}/${m.id}`, { append_to_response: "images", include_image_language: type === "tv" ? "en,ja,null" : "en,ja,hi,null" }).catch(() => null);
    })
  );
  return picks.map((m, index) => {
    const d = full[index] || m;
    const logos = d.images?.logos || [];
    const logo = logos.find((l) => l.iso_639_1 === "en") || logos[0];
    return {
      id: m.id,
      type: m.media_type === "movie" || m.media_type === "tv" ? m.media_type : mediaType,
      title: d.title || d.name || m.title || m.name || "Untitled",
      overview: d.overview || m.overview || "",
      genres: (d.genres || []).slice(0, 3).map((g) => g.name),
      rating: d.vote_average || m.vote_average || 0,
      year: (d.release_date || d.first_air_date || m.release_date || m.first_air_date || "").slice(0, 4),
      backdrop: m.backdrop_path,
      logo: logo?.file_path || null,
    };
  });
}

// Recent anime FIRST for the /anime hero, separate from all-time popularity.
// In 2026 the highlight includes 2026 and 2025 debuts, not series from 1997.
// TMDB TV "first_air_date" means a show's debut, not its newest season.
export async function getRecentAnimeHeroSlides(count = 8) {
  const currentYear = new Date().getUTCFullYear();
  const since = `${currentYear - 1}-01-01`;
  const until = today();
  const [series, films] = await Promise.all([
    tmdb("/discover/tv", {
      with_original_language: "ja",
      with_genres: "16",
      sort_by: "popularity.desc",
      "first_air_date.gte": since,
      "first_air_date.lte": until,
      "vote_count.gte": "15",
    }),
    tmdb("/discover/movie", {
      with_original_language: "ja",
      with_genres: "16",
      sort_by: "popularity.desc",
      "primary_release_date.gte": since,
      "primary_release_date.lte": until,
      "vote_count.gte": "10",
    }),
  ]);

  const prepare = (items, type) => (items || [])
    .filter((item) => {
      const date = type === "tv" ? item.first_air_date : item.release_date;
      return item.backdrop_path && date && date >= since && date <= until;
    })
    .map((item) => ({ ...item, media_type: type }))
    .sort((a, b) => {
      const dateA = (a.first_air_date || a.release_date || "").slice(0, 4);
      const dateB = (b.first_air_date || b.release_date || "").slice(0, 4);
      // Current-year premieres first; within a year prefer popular titles.
      return dateB.localeCompare(dateA) || (b.popularity || 0) - (a.popularity || 0);
    });

  const tv = prepare(series.results, "tv");
  const movie = prepare(films.results, "movie");
  const picked = [];
  const seen = new Set();
  // Keep a mix of new TV series and anime movies where available.
  const order = ["tv", "movie", "tv", "tv", "movie", "tv", "tv", "movie"];
  for (const type of order.slice(0, count)) {
    const primary = type === "movie" ? movie : tv;
    const secondary = type === "movie" ? tv : movie;
    const item = primary.shift() || secondary.shift();
    if (!item) break;
    const key = `${item.media_type}-${item.id}`;
    if (!seen.has(key)) { picked.push(item); seen.add(key); }
  }
  // Fill any remaining slots without ever falling back to old franchises.
  for (const item of [...tv, ...movie]) {
    if (picked.length >= count) break;
    const key = `${item.media_type}-${item.id}`;
    if (!seen.has(key)) { picked.push(item); seen.add(key); }
  }

  return getHeroSlides(picked, count, "tv");
}
