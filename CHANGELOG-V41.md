# V41 — Real song search and curated hero
- Music search now calls YouTube Data API with the typed query; it is not limited to loaded cards.
- Search results appear in existing cinematic rails; Play opens the existing modal.
- Search results are YouTube matches, not guaranteed official uploads.
- Trending page hero features the video ID supplied by the user (BPZkZpGMpXA) if publicly embeddable.
- Set YOUTUBE_FEATURED_VIDEO_ID in Vercel to change the hero; otherwise it uses that example. This is a manually featured video, not an automatic verified trending chart.
- Keeps movies and TV pages unchanged.
