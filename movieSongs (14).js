// Prefer verified music videos attached to the movie in TMDB.
// Optional YouTube Data API v3 key enables automatic official-song discovery.
// No API key? The UI still offers a clearly labelled YouTube search.
const MUSIC_WORDS = /\\b(song|music video|lyrical|lyrics|soundtrack|audio song|title track|full song)\\b/i;
const EXCLUDE = /\\b(trailer|teaser|reaction|review|interview|behind the scenes|making of|promo|fanmade|fan made)\\b/i;
const OFFICIAL = /t.series|sony music|zee music|saregama|tips official|yrf|eros now|universal music|times music|official/i;

export async function getMovieSongs(movie) {
  const tmdb = (movie.videos?.results || [])
    .filter(v => v.site === "YouTube" && /^[\\w-]{11}$/.test(v.key || "") && MUSIC_WORDS.test(v.name || "") && !EXCLUDE.test(v.name || ""))
    .map(v => ({ id: v.key, title: v.name, channel: "Movie video", source: "TMDB" }));
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return tmdb.slice(0, 12);
  try {
    const title = movie.title || movie.original_title || "";
    const year = (movie.release_date || "").slice(0, 4);
    const q = `${title} ${year} official song`;
    const params = new URLSearchParams({ part: "snippet", type: "video", maxResults: "20", q, key, videoEmbeddable: "true" });
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, { next: { revalidate: 86400 } });
    if (!res.ok) return tmdb.slice(0, 12);
    const data = await res.json();
    const needle = title.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\\s+/).filter(w => w.length > 2);
    const matches = (data.items || []).filter(item => {
      const sn = item.snippet || {};
      const t = (sn.title || "").toLowerCase();
      const normalized = t.replace(/[^a-z0-9 ]/g, "");
      const relevant = needle.length && needle.every(w => normalized.includes(w));
      return relevant && MUSIC_WORDS.test(t) && !EXCLUDE.test(t) && OFFICIAL.test(sn.channelTitle || "");
    }).map(item => ({ id: item.id?.videoId, title: item.snippet.title, channel: item.snippet.channelTitle, source: "YouTube" }))
      .filter(v => /^[\\w-]{11}$/.test(v.id || ""));
    return [...matches, ...tmdb].filter((v, i, arr) => arr.findIndex(x => x.id === v.id) === i).slice(0, 12);
  } catch { return tmdb.slice(0, 12); }
}
