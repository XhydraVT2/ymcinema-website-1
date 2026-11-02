import { NextResponse } from "next/server";
export const revalidate = 3600;
const terms = {
 trending: "latest bollywood hindi 2026",
 new: "bollywood 2026",
 romantic: "hindi romantic",
 dance: "bollywood dance",
 classics: "bollywood classics",
 king: "Tu Mil Jaaye King Shah Rukh Khan"
};
const isHindi = s => /hindi|bollywood|indian pop|soundtrack|film|king|arijit|shreya|pritam|t.series|saregama|sachin.jigar/i.test(s);
function normalize(t) {
  return { id: String(t.trackId || t.collectionId || t.trackName), title: t.trackName || t.collectionName || "Untitled", artist: t.artistName || "", album: t.collectionName || "", artwork: (t.artworkUrl100 || "").replace(/100x100bb/g,"600x600bb"), preview: t.previewUrl || "", url: t.trackViewUrl || t.collectionViewUrl || "", genre: t.primaryGenreName || "", date: t.releaseDate || "", source:"Apple Music" };
}
export async function GET(req) {
  const category = new URL(req.url).searchParams.get("category") || "trending";
  const term = terms[category] || terms.trending;
  try {
    const queries = category === "trending" ? ["latest bollywood hindi 2026","hindi film songs 2026","Tu Mil Jaaye King"] : [term];
    const responses = await Promise.all(queries.map(q => fetch("https://itunes.apple.com/search?" + new URLSearchParams({term:q,country:"IN",media:"music",entity:"song",limit:"50",explicit:"No"}),{next:{revalidate:3600}})));
    const payloads = await Promise.all(responses.map(r=>r.ok?r.json():{results:[]}));
    const seen = new Set();
    const tracks = payloads.flatMap(p=>p.results||[]).filter(t=>{
      if (!t.trackName || !t.artistName) return false;
      if (category !== "king" && !isHindi([t.primaryGenreName,t.collectionName,t.trackName,t.artistName].join(" "))) return false;
      if (seen.has(t.trackId)) return false; seen.add(t.trackId); return true;
    }).map(normalize);
    tracks.sort((a,b)=> category==="classics" ? 0 : (b.date||"").localeCompare(a.date||""));
    return NextResponse.json({tracks:tracks.slice(0,75),category,updated:new Date().toISOString(),source:"iTunes Search API",note:"Search results ordered by release date; not an official real-time popularity chart."});
  } catch {
    return NextResponse.json({tracks:[],error:"Music discovery is temporarily unavailable."},{status:503});
  }
}
