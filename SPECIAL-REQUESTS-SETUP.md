# YMCINEMA special requests — optional web integration

## What changed
- **Cloud and PenguPlay remain the only Stremio manifests used by the website** (`app/api/test-stream/route.js`). If Vercel still has obsolete `STREMIO_TG_MANIFEST` or `STREMIO_VFLIX_MANIFEST`, delete them; the current code does not use either.
- Adds a **separate Special Requests (BETA)** movie-detail button and player page, disabled by default. The original Play, Test Stream, Cloud and Pengu flows are untouched.
- Special-request sources are displayed as `Telegram 01`, `Telegram 02`, etc., and never expose filenames/channel names in the UI.

## Important limitation — no direct Telegram video yet

Unlike the native Android TV app, web browsers cannot directly run the TV app's TDLib byte-range player. This ZIP **does not** directly stream large files from your private Telegram channels. The regular Telegram Bot API limits downloads to 20 MB. You would first need a reliable, authorized HTTPS streaming gateway that provides browser-playable HLS (`.m3u8`) or MP4, supports HTTP Range requests, and allows cross-origin playback. Vercel serverless functions are not suitable as an always-on multi-hour 4 GB video relay. Do not put your bot token or `TELEGRAM_API_HASH` into website source code or browser environment variables.

## When such a gateway is available

In Vercel > your project > Settings > Environment Variables, set:

- `ENABLE_SPECIAL_REQUESTS` = `true`
- `YMCINEMA_SPECIAL_REQUESTS_JSON` = a JSON object mapping each movie's TMDB ID to one or more authorized HTTPS stream URLs. For example (fictional URL):

```json
{
  "movie:862": [
    {"url": "https://YOUR-AUTHORIZED-GATEWAY.example/toy-story/stream1.m3u8", "quality": "1080p"},
    {"url": "https://YOUR-AUTHORIZED-GATEWAY.example/toy-story/stream2.mp4", "quality": "720p"}
  ]
}
```

This yields **Telegram 01** and **Telegram 02** for *Toy Story* (TMDB `862`) in the new page. These entries work only if the URLs actually provide properly encoded, authorized, browser-compatible video. The label does not make the URLs Telegram streams. Do not use the sample URL literally.

Set `ENABLE_SPECIAL_REQUESTS=false` (or remove it) and redeploy to hide the button and disable the API/page.

### Security and capacity
- Source URLs must be accessible to the browser, so **they are not secret** once playback starts. Don't expose durable sensitive Telegram links, tokens, or third-party credentials in the catalog.
- Any access-control, signed URL issuing, bandwidth limits, HTTPS TLS, CORS and transcoding belong in your gateway. The API shown here is a simple owner-managed **catalog**, not an access-control or media hosting service.
- Use this only for videos you are authorized to distribute.

### Test steps
1. Keep all current Vercel variables for Cloud and Pengu.
2. Delete obsolete VFlix/TG manifest environment keys if present.
3. Keep the new Special Requests flag `false` until a proper HTTPS gateway exists.
4. Once configured and redeployed, visit `/movie/862`, open **Special Requests (BETA)** and verify browser playback.
