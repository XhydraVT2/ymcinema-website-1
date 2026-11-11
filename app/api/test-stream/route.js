import { NextResponse } from "next/server";
import { tmdb } from "../../../lib/tmdb";

// This endpoint only looks up streams for a validated TMDB movie ID using
// addon URLs configured by the site owner. It is not a general-purpose proxy.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const NO_STORE = { "Cache-Control": "no-store, private" };

function json(payload, status = 200) {
  return NextResponse.json(payload, { status, headers: NO_STORE });
}

function manifests() {
  return [
    process.env.STREMIO_CLOUD_MANIFEST,
    process.env.STREMIO_PENGU_MANIFEST,
  ].filter(Boolean).map(v => v.trim());
}

function addonEndpoint(manifest, mediaId) {
  const u = new URL(manifest);
  if (u.protocol !== "https:" || !u.pathname.endsWith("/manifest.json") || u.username || u.password) {
    throw new Error("Manifest configuration must be an HTTPS manifest.json URL");
  }
  // Preserve the encoded addon configuration segment (e.g. Pengu's JSON config).
  // Never place it in client-side JavaScript or any API response.
  u.pathname = `${u.pathname.slice(0, -"/manifest.json".length)}/stream/movie/${encodeURIComponent(mediaId)}.json`;
  u.search = "";
  return u.toString();
}

function qualityOf(value) {
  const match = String(value || "").match(/(?:2160p|4k|1080p|720p|480p|360p)/i);
  return match ? match[0].toUpperCase().replace("2160P", "4K") : "Video";
}

function formatOf(url) {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    if (pathname.endsWith(".m3u8")) return "HLS";
    if (pathname.endsWith(".mp4") || pathname.endsWith(".m4v")) return "MP4";
    if (pathname.endsWith(".webm")) return "WebM";
    if (pathname.endsWith(".mkv")) return "MKV";
  } catch {}
  return "Stream";
}

function usableStream(value) {
  if (!value || typeof value.url !== "string") return null;
  let parsed;
  try { parsed = new URL(value.url); } catch { return null; }
  // No torrent/infohash sources, localhost URLs, browser scripts, or mixed content.
  if (parsed.protocol !== "https:" || parsed.username || parsed.password ||
    /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|\[?::1\]?)$/i.test(parsed.hostname)) return null;
  const info = [value.name, value.title, value.description].filter(Boolean).join(" ");
  return { url: parsed.toString(), quality: qualityOf(info), format: formatOf(parsed.toString()) };
}

async function requestStreams(manifest, mediaId) {
  try {
    const response = await fetch(addonEndpoint(manifest, mediaId), {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(6500),
    });
    if (!response.ok) return [];
    // Avoid attempting to process unbounded provider responses.
    const raw = await response.text();
    if (raw.length > 1_000_000) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data.streams) ? data.streams.slice(0, 40).map(usableStream).filter(Boolean) : [];
  } catch { return []; }
}

export async function GET(request) {
  if (process.env.ENABLE_TEST_STREAM === "false") return json({ error: "Test feature disabled" }, 404);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  const type = searchParams.get("type") || "movie";
  if (type !== "movie" || !/^[1-9]\d{0,8}$/.test(id)) return json({ error: "Invalid movie ID" }, 400);
  const configured = manifests();
  if (!configured.length) return json({ error: "No test addons configured. Add STREMIO_CLOUD_MANIFEST and/or STREMIO_PENGU_MANIFEST in Vercel Environment Variables." }, 503);

  let externalId = null;
  try {
    const details = await tmdb(`/movie/${id}/external_ids`);
    if (typeof details.imdb_id === "string" && /^tt\d+$/.test(details.imdb_id)) externalId = details.imdb_id;
  } catch { /* Some films only have a TMDB ID. */ }

  // Standard Stremio addons expect IMDb IDs. Use TMDB-prefixed ID as fallback.
  const ids = externalId ? [externalId, `tmdb:${id}`] : [`tmdb:${id}`];
  let results = [];
  for (const mediaId of ids) {
    const fetched = await Promise.all(configured.map(m => requestStreams(m, mediaId)));
    results = fetched.flat();
    if (results.length) break;
  }
  const unique = [...new Map(results.map(entry => [entry.url, entry])).values()].slice(0, 24);
  // Stream URLs are necessarily sent to the browser for playback. Manifest URLs
  // and their private config tokens are never included in these responses.
  return json({ streams: unique.map((entry, index) => ({ ...entry, label: `Watch ${String(index + 1).padStart(2, "0")}` })), note: unique.length ? null : "No directly playable HTTPS streams were returned for this movie." });
}
