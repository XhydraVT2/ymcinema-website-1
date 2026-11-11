# YMCINEMA movie Test Stream experiment

This experiment **does not change the existing Play / Watch 1–7 experience**.
It adds a separate **Test Stream (BETA)** button on movie detail pages.

## Configure in Vercel

1. Open your YMCINEMA Vercel project > Settings > Environment Variables.
2. Add `STREMIO_CLOUD_MANIFEST` (the full private Cloud manifest URL) and `STREMIO_PENGU_MANIFEST` (the full private Pengu manifest URL). These must be HTTPS `.../manifest.json` URLs and you must be authorized to use the addons.
3. Keep your existing `TMDB_TOKEN` setting.
4. Set `ENABLE_TEST_STREAM=true` if desired (true is the default).
5. Redeploy. Test a movie details page and select **Test Stream (BETA)**.

Do NOT put manifest URLs or their bearer/config tokens in `NEXT_PUBLIC_` variables, React components, or GitHub. Do NOT commit `.env.local`. A sample template is in `.env.local.example`.

### Remove or disable the experiment

Set `ENABLE_TEST_STREAM=false` in Vercel Environment Variables and redeploy. This hides the button and disables the API and page. You can later remove `components/TestStreamPlayer.js`, `app/test-stream/`, `app/api/test-stream/`, and the test button from `lib/Detail.js` if permanently removing it.

### What it can play

The server requests `stream/movie/<IMDb-ID>.json` from the configured addons, falling back to `tmdb:<ID>` if no sources were found. Only direct HTTPS URLs are offered. Browser playback uses HTML5 video and hls.js for HLS where supported. The feature cannot transcode 4K MKV/HEVC, bypass DRM, play torrent hashes, or overcome source server CORS restrictions. Manifest availability and playback depend on source permissions, formats, and codecs. Only use content you have the rights to stream on your website.

### Local test

Copy `.env.local.example` to `.env.local`, fill the values, run `npm install` and `npm run dev`, then open `/movie/<tmdb-id>`.
