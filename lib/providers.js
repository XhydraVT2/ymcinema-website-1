import { tmdb } from "./tmdb";

// Platforms that matter most for Bollywood, in the order they should appear.
// IDs are TMDB watch-provider IDs. Anything not available in India is skipped automatically.
const PRIORITY = [
  122, // JioHotstar / Hotstar
  8,   // Netflix
  9,   // Amazon Prime Video
  232, // ZEE5
  237, // SonyLIV
  970, // JioCinema
  561, // Lionsgate Play
  532, // aha
  309, // Sun NXT
  218, // Eros Now
  315, // hoichoi
  350, // Apple TV+
  337, // Disney+
  11,  // MUBI
];

export async function getProviders(type = "movie", limit = 16) {
  const data = await tmdb(`/watch/providers/${type}`, { watch_region: "IN" });
  const list = data.results || [];
  const rank = (p) => {
    const i = PRIORITY.indexOf(p.provider_id);
    return i === -1 ? 1000 + (p.display_priorities?.IN ?? p.display_priority ?? 999) : i;
  };
  return list.sort((a, b) => rank(a) - rank(b)).slice(0, limit);
}

export async function getProviderTitles(providerId, type = "movie", page = 1) {
  return tmdb(`/discover/${type}`, {
    with_original_language: "hi",
    watch_region: "IN",
    with_watch_providers: String(providerId),
    with_watch_monetization_types: "flatrate",
    sort_by: "popularity.desc",
    page: String(page),
  });
}
