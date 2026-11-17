import { NextResponse } from "next/server";

// Optional, owner-managed special-request streams.
// This endpoint does NOT fetch Telegram files or implement TDLib: the website
// needs an independently hosted, authorized HTTPS HLS/MP4 streaming gateway.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store" };
function response(value, status = 200) {
  return NextResponse.json(value, { status, headers: HEADERS });
}
function formatOf(url) {
  try {
    const path = new URL(url).pathname.toLowerCase();
    if (path.endsWith(".m3u8")) return "HLS";
    if (path.endsWith(".mp4") || path.endsWith(".m4v")) return "MP4";
    if (path.endsWith(".webm")) return "WebM";
  } catch {}
  return "Video";
}
function isPublicHttpsUrl(raw) {
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    // The browser needs a public HTTPS URL; this is not a network proxy.
    return url.protocol === "https:" && !url.username && !url.password &&
      host !== "localhost" && host !== "[::1]" && !host.endsWith(".local") &&
      !/^\d+\.\d+\.\d+\.\d+$/.test(host) &&
      !host.startsWith("127.") && !host.startsWith("10.") &&
      !host.startsWith("192.168.") &&
      !/^172\.(1[6-9]|2\d|3[01])\./.test(host);
  } catch { return false; }
}

export async function GET(request) {
  if (process.env.ENABLE_SPECIAL_REQUESTS !== "true") return response({ error: "Feature unavailable" }, 404);
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "movie";
  const id = searchParams.get("id") || "";
  if (type !== "movie" || !/^[1-9]\d{0,8}$/.test(id)) return response({ error: "Invalid title" }, 400);

  let catalog = {};
  try {
    const raw = process.env.YMCINEMA_SPECIAL_REQUESTS_JSON || "{}";
    if (raw.length > 100000) throw new Error("Catalog is too large");
    const parsed = JSON.parse(raw);
    if (parsed && !Array.isArray(parsed) && typeof parsed === "object") catalog = parsed;
  } catch {
    // Bad configuration should never expose credentials or stack traces.
    return response({ streams: [], note: "No special-request streams available." });
  }
  const items = catalog[`movie:${id}`];
  const seen = new Set();
  const streams = [];
  for (const item of Array.isArray(items) ? items.slice(0, 12) : []) {
    const url = typeof item?.url === "string" ? item.url.trim() : "";
    if (!isPublicHttpsUrl(url) || seen.has(url)) continue;
    seen.add(url);
    const quality = typeof item.quality === "string" && /^(4K|2160p|1080p|720p|480p|360p)$/i.test(item.quality.trim())
      ? item.quality.trim().toUpperCase().replace("2160P", "4K") : "Video";
    streams.push({ url, quality, format: formatOf(url), label: `Telegram ${String(streams.length + 1).padStart(2, "0")}` });
  }
  return response({ streams, note: streams.length ? null : "No special-request streams available for this title." });
}
