# V37 — Bollywood music with official YouTube full-video embeds
- Preserves movie/TV pages from V36.
- Adds YouTube full music video discovery to the Hindi Music page (YouTube Data API v3).
- Uses YouTube search + videos API to check public and embeddable status, prioritizing recognized official channels.
- Songs in the Apple music catalog have a Find full song action that searches for a playable video.
- Embedded video player is fully visible, uses YouTube's official privacy-enhanced embed, no autoplay.
- No audio extraction or video hiding. No guarantee of full playback in all regions.
- YouTube API key required for automatic results. Set YOUTUBE_API_KEY in .env.local or hosting secrets.
- Existing Apple preview and favorites remain as fallback; SoundCloud section removed from Music page.
- To eliminate music entirely later, revert to V34 or remove /music page, music navbar link, and /api/music routes.
