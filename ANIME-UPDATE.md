# YMCINEMA Anime section

- **Navigation:** Anime after TV Shows, before Music.
- **Page:** `/anime` copies the Home design: hero carousel, horizontal rows, providers, Top 10, genre carousel and platform footer.
- **Catalog:** TMDB Japanese-language original titles with Animation genre (16), for separate movies and TV series. Newest first row, then trending, rankings and decade collections reaching back to pre-1990 classics.
- **Browse:** Each row's Browse all links to paginated `/browse/anime-...` pages. New Anime genre filters live under `/anime/genre/...` and providers under `/anime/provider/...`.
- **Hero:** Reuses the existing Hero component and enriches anime TV entries with TMDB images/logos.
- **Existing site:** Home and streaming/movie/series/Test Stream pages are unchanged except for the small backward-compatible Hero/Genres component enhancements.
- **Credentials:** No changes needed to `TMDB_TOKEN` or existing stream environment variables.
- **Deployment:** Copy the extracted `ymcinema-website-1-main` project contents into the GitHub repository root (do not upload the containing ZIP as a single file). Commit/push and let Vercel build.
- **Caveat:** TMDB's 'Japanese + Animation' filtering is a practical anime catalog definition, not a comprehensive anime registry. Availability and artwork depend on TMDB metadata.
