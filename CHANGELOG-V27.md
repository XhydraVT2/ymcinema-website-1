# V27 — Native smooth mouse wheel scrolling

- Removed the V26 global capture-phase wheel handler that prevented native scrolling and used instant `window.scrollBy` over carousels.
- Native browser vertical wheel scrolling now works uniformly over cards, posters, cast, genres, episodes, and empty page areas.
- Horizontal scrolling by arrows, trackpad horizontal gestures, and touch swipes remains available.
- Retains V25/V26 other features; V26 wheel workaround intentionally removed.
