# YMCINEMA

Bollywood-first movie & TV discovery site (Next.js + TMDB). Hollywood and TV sections included.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local` and set `TMDB_TOKEN` (free "API Read Access Token" from https://www.themoviedb.org/settings/api)
3. `npm run dev`

## Deploy to Vercel
1. Push this folder to a GitHub repo, or run `npx vercel` inside it.
2. Project name: `ymcinema`.
3. Add environment variable `TMDB_TOKEN` (Project Settings -> Environment Variables), then redeploy.

## Notes
- Bollywood = Hindi-language films (`with_original_language=hi`, region IN).
- Streaming providers use TMDB watch-provider data for India, ordered Bollywood-first (see `lib/providers.js`).
- This product uses the TMDB API but is not endorsed or certified by TMDB.
