# V39 — Remove inaccurate previews and misleading KING matches
- Removed Apple iTunes preview catalog and audio preview player.
- Music page displays only YouTube Data API results when configured, with an official visible embed player.
- Without YOUTUBE_API_KEY, shows setup guidance and a YouTube search link, rather than unrelated preview songs.
- KING is a search category, NOT a verified movie soundtrack; removed false Tu Mil Jaaye claim.
- Favorites now save YouTube videos locally in browser.
- Existing movies and TV sections are unchanged.
- Setup: Vercel project Settings → Environment Variables → YOUTUBE_API_KEY; redeploy.
