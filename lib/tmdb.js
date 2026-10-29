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
};

export async function getCategory(key, page = 1) {
  const c = CATEGORIES[key];
  if (!c) return null;
  const data = await tmdb(c.path, { ...c.params, page: String(page) });
  return { ...c, key, type: c.type || "movie", ...data };
}
