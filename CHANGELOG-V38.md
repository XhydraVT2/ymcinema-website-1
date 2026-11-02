# V38 — Vercel prerender build fix
Fixed a React state destructuring typo in components/MusicLibrary.js: `const [ytConfigured,setYtConfigured]=false` was changed to `useState(false)`. This caused `TypeError: false is not iterable` when Next.js prerendered /music. All V37 movie, TV and music features are preserved.
