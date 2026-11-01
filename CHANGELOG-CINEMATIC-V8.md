# YMCINEMA Premium V6 — Cinematic Transition V8

Based on Premium V6 Cinematic Scene V7, informed by the supplied CinemaOS homepage recording.

- Removed the V7 duplicate hero image painted into `main::before`, which caused the repeated image and horizontal seam.
- Hero backdrop now fades out with a continuous alpha mask while the first row rises naturally into the fading area.
- Eliminated the extra hero/content padding that created the empty band.
- Replaced abrupt palette string switching with an interpolable registered CSS color (`--scene-glow`) for softer section and card-hover ambience.
- Retained existing homepage rows, TV episode browser, details, providers, and player routes.

The colors are curated and deterministic, not pixel-sampled from the movie images. An exact third-party design clone is not claimed. Verify responsive behavior and deployment environment before publishing.
