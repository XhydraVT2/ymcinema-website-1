# V31 — Trending Bollywood hero sync

- Hero takes the first eight backdrop-equipped movies from the exact same `bollywood-trending` results used in the homepage Trending Bollywood rail.
- Preserves TMDB ordering and uses detail lookups only for richer hero metadata and logos.
- Keeps a slide when its details request fails, avoiding unexpected missing entries.
- No other visual or carousel behavior changed.
