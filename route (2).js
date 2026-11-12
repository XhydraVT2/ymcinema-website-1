import { NextResponse } from "next/server";
export async function GET(request) {
  const raw = new URL(request.url).searchParams.get("url") || "";
  let url;
  try {
    url = new URL(raw);
    if (url.protocol !== "https:" || !["soundcloud.com", "www.soundcloud.com", "m.soundcloud.com"].includes(url.hostname)) throw new Error("Invalid host");
    if (!url.pathname || url.pathname === "/") throw new Error("Track or playlist URL required");
  } catch { return NextResponse.json({ error: "Enter a public SoundCloud track or playlist URL." }, {status:400}); }
  try {
    const endpoint = "https://soundcloud.com/oembed?format=json&maxheight=450&url=" + encodeURIComponent(url.toString());
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } });
    if (!res.ok) return NextResponse.json({error:"SoundCloud couldn't find an embeddable track or playlist."},{status:404});
    const data = await res.json();
    return NextResponse.json({title:String(data.title || "SoundCloud audio").slice(0,200), thumbnail: /^https:\/\//.test(data.thumbnail_url || "") ? data.thumbnail_url : null, url:url.toString(), author:data.author_name || "", type: data.height > 200 ? "playlist" : "track" });
  } catch { return NextResponse.json({error:"SoundCloud is unavailable. Please try again."},{status:502}); }
}
