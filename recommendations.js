import { tmdb } from './tmdb';

// Server-side recommendations: preserve original language and score thematic overlap.
export async function getSmartRecommendations(type, detail) {
  const id = detail.id;
  const language = detail.original_language || 'en';
  const genreIds = (detail.genres || []).map(g => g.id);
  const genreSet = new Set(genreIds);
  const keywordEndpoint = type === 'movie' ? `/movie/${id}/keywords` : `/tv/${id}/keywords`;
  const [recommended, similar, keywords] = await Promise.all([
    tmdb(`/${type}/${id}/recommendations`, { page: '1' }).catch(() => ({ results: [] })),
    tmdb(`/${type}/${id}/similar`, { page: '1' }).catch(() => ({ results: [] })),
    tmdb(keywordEndpoint).catch(() => ({})),
  ]);
  const keywordIds = (keywords.keywords || keywords.results || []).slice(0, 8).map(k => k.id);
  const commonParams = {
    with_original_language: language,
    sort_by: 'popularity.desc',
    'vote_count.gte': type === 'movie' ? '10' : '5',
    ...(genreIds.length ? { with_genres: genreIds.slice(0, 3).join('|') } : {}),
    ...(type === 'movie' ? { 'primary_release_date.lte': new Date().toISOString().slice(0, 10) } : {}),
  };
  const discoverPath = `/discover/${type}`;
  const [genreDiscover, keywordDiscover] = await Promise.all([
    tmdb(discoverPath, commonParams).catch(() => ({ results: [] })),
    keywordIds.length ? tmdb(discoverPath, { ...commonParams, with_keywords: keywordIds.slice(0, 3).join('|') }).catch(() => ({ results: [] })) : Promise.resolve({ results: [] }),
  ]);
  const candidates = new Map();
  const add = (items, origin) => {
    for (const item of items || []) {
      if (!item?.id || item.id === id || !item.backdrop_path || item.adult || item.original_language !== language) continue;
      const overlap = (item.genre_ids || []).filter(g => genreSet.has(g)).length;
      // Reject genre-unrelated titles when the metadata includes genres.
      if (genreSet.size && item.genre_ids?.length && !overlap) continue;
      const score = overlap * 30 + (origin === 'recommendations' ? 45 : origin === 'similar' ? 30 : origin === 'keywords' ? 35 : 10)
        + Math.min(item.vote_count || 0, 1000) / 1000 * 7
        + Math.min(item.vote_average || 0, 10) * 0.5;
      const previous = candidates.get(item.id);
      if (!previous || score > previous.score) candidates.set(item.id, { item, score });
    }
  };
  add(recommended.results, 'recommendations');
  add(similar.results, 'similar');
  add(keywordDiscover.results, 'keywords');
  add(genreDiscover.results, 'genre');
  return [...candidates.values()].sort((a, b) => b.score - a.score).slice(0, 18).map(x => x.item);
}
