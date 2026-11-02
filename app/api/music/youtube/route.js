import { NextResponse } from "next/server";
const official = /t.series|sony music|zee music|saregama|tips official|yrf|eros now|times music|universal music|music india|official/i;
const reject = /reaction|review|cover|karaoke|fanmade|fan made|slowed|reverb|remix|trailer|teaser|interview|shorts|status|8d audio/i;
const terms = { trending:"latest Hindi Bollywood official music video 2026", new:"new Bollywood songs official music video 2026", king:"Shah Rukh Khan KING movie official song", romantic:"new Hindi romantic official songs", dance:"Bollywood dance official songs", classics:"classic Bollywood songs official" };
const validId = id => /^[a-zA-Z0-9_-]{11}$/.test(id || "");
async function youtube(path,params,key){const url=new URL(`https://www.googleapis.com/youtube/v3/${path}`);Object.entries({...params,key}).forEach(([k,v])=>url.searchParams.set(k,String(v)));const r=await fetch(url,{next:{revalidate:1800}});if(!r.ok)throw new Error(`YouTube API ${r.status}`);return r.json()}
export async function GET(req){
 const key=process.env.YOUTUBE_API_KEY;
 if(!key)return NextResponse.json({videos:[],configured:false,message:"Add YOUTUBE_API_KEY to enable verified YouTube song discovery."});
 const p=new URL(req.url).searchParams;const category=p.get("category")||"trending";
 const query=(p.get("q")||"").trim().slice(0,100);
 const q=query?`${query} official song Hindi Bollywood`:(terms[category]||terms.trending);
 try{
  const found=await youtube("search",{part:"snippet",q,type:"video",videoEmbeddable:"true",videoSyndicated:"true",maxResults:25,regionCode:"IN",relevanceLanguage:"hi",order:category==="new"&&!query?"date":"relevance",safeSearch:"moderate"},key);
  const candidates=(found.items||[]).filter(x=>validId(x.id?.videoId)&&!reject.test(x.snippet?.title||""));
  if(!candidates.length)return NextResponse.json({videos:[],configured:true});
  const details=await youtube("videos",{part:"status,snippet,contentDetails",id:candidates.map(x=>x.id.videoId).join(",")},key);
  const verified=new Map((details.items||[]).filter(x=>x.status?.embeddable&&x.status?.privacyStatus==="public"&&x.contentDetails?.duration!=="PT0S").map(x=>[x.id,x]));
  const videos=candidates.filter(x=>verified.has(x.id.videoId)).map(x=>{
   const v=verified.get(x.id.videoId),sn=v.snippet||x.snippet;
   return {id:x.id.videoId,title:sn.title||"Official song",channel:sn.channelTitle||"YouTube",thumbnail:sn.thumbnails?.high?.url||sn.thumbnails?.medium?.url||"",publishedAt:sn.publishedAt||"",official:official.test(sn.channelTitle||"")};
  }).filter(x=>!reject.test(x.title) && (category!=="king" || /\bKING\b/i.test(x.title))).sort((a,b)=>Number(b.official)-Number(a.official));
  return NextResponse.json({videos:videos.slice(0,20),configured:true,notice:"Search results are not an official popularity chart. Embedding may still be restricted by region or owner."});
 }catch(e){return NextResponse.json({videos:[],configured:true,error:"YouTube search unavailable. Check API key and quota."},{status:502})}
}
