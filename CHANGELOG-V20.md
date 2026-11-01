# V20 — Smart Recommendations

- Movie and TV detail pages now fetch TMDB recommendations and similar titles independently.
- Results are filtered to the current title's original language, preventing unrelated Hollywood suggestions on Hindi film pages.
- Genre overlap is required when metadata is available; candidates are scored by genre overlap and recommendation source.
- Discovery fallbacks use original language, shared genres and optional TMDB keywords.
- Duplicates, current title, adult results and entries without backdrops are excluded.
- Preserves all V19 UI and features.

Requires existing TMDB_TOKEN environment variable. Recommendations depend on TMDB metadata quality.
