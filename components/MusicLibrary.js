"use client";
import { useEffect, useMemo, useState } from "react";

const CATEGORIES = [
  { name:"Bollywood", subtitle:"Hindi hits & film soundtracks", term:"Bollywood Hindi music", icon:"✦", tone:"warm" },
  { name:"English", subtitle:"Pop, indie & chart favorites", term:"English pop music", icon:"♫", tone:"blue" },
  { name:"International", subtitle:"Music from around the world", term:"international world music", icon:"◎", tone:"violet" },
  { name:"Lo-fi", subtitle:"Chill, focus & late-night listening", term:"lofi chill beats", icon:"☾", tone:"green" },
  { name:"Electronic", subtitle:"Dance & electronic sounds", term:"electronic dance music", icon:"⌁", tone:"red" },
  { name:"Instrumental", subtitle:"Scores & instrumental pieces", term:"instrumental music", icon:"♬", tone:"gold" },
];
const STORAGE = "ymcinema.soundcloud.library.v1";
const soundcloudSearch = term => `https://soundcloud.com/search?q=${encodeURIComponent(term)}`;
function isValidSoundCloud(input) {
  try {
    const url = new URL(input.trim());
    return url.protocol === "https:" && ["soundcloud.com","www.soundcloud.com","m.soundcloud.com"].includes(url.hostname) && url.pathname.length > 1;
  } catch { return false; }
}
export default function MusicLibrary() {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("All");
  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE) || "[]"); if (Array.isArray(saved)) setItems(saved.filter(x => x && typeof x.url === "string").slice(0,100)); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem(STORAGE,JSON.stringify(items)); } catch {} } }, [items,ready]);
  const shown = useMemo(() => items.filter(x => (filter === "All" || x.category === filter) && `${x.title} ${x.author} ${x.category}`.toLowerCase().includes(query.toLowerCase())), [items,filter,query]);
  async function add(e) {
    e.preventDefault(); setError("");
    const url = input.trim();
    if (!isValidSoundCloud(url)) { setError("Paste a full HTTPS SoundCloud track or playlist link."); return; }
    if (items.some(x => x.url === url)) { setError("This link is already in your library."); return; }
    setBusy(true);
    try {
      const response = await fetch(`/api/soundcloud/oembed?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load audio.");
      setItems(old => [{...data, category:filter === "All" ? "Bollywood" : filter, added:Date.now()},...old].slice(0,100));
      setInput("");
    } catch(err) { setError(err.message || "Couldn't add this link."); }
    finally { setBusy(false); }
  }
  const selected = items.find(x => x.url === active);
  return <main className="ym-music-page">
    <div className="ym-music-hero">
      <div className="ym-music-orb" aria-hidden="true" />
      <span className="ym-music-kicker">YMCINEMA · MUSIC</span>
      <h1>Your music.<br/><span>One cinematic library.</span></h1>
      <p>Bollywood, English and international sounds, powered by official SoundCloud embeds. Discover tracks and save the ones you love.</p>
      <div className="ym-music-hero-actions">
        <a href="#music-library" className="ym-music-primary">Explore my library ↓</a>
        <a href={soundcloudSearch("Bollywood Hindi music")} target="_blank" rel="noopener noreferrer" className="ym-music-secondary">Discover on SoundCloud ↗</a>
      </div>
    </div>
    <section className="ym-music-section" aria-labelledby="music-discover">
      <div className="ym-music-section-heading"><div><span>FIND YOUR SOUND</span><h2 id="music-discover">Browse by mood & genre</h2></div></div>
      <div className="ym-music-categories">{CATEGORIES.map(cat=><a key={cat.name} className={`ym-music-category ${cat.tone}`} href={soundcloudSearch(cat.term)} target="_blank" rel="noopener noreferrer" aria-label={`Discover ${cat.name} on SoundCloud`}>
        <span className="ym-music-category-icon">{cat.icon}</span><strong>{cat.name}</strong><small>{cat.subtitle}</small><span className="ym-music-arrow">↗</span>
      </a>)}</div>
    </section>
    <section className="ym-music-section" id="music-library" aria-labelledby="my-music">
      <div className="ym-music-section-heading"><div><span>YOUR COLLECTION</span><h2 id="my-music">My music library <em>{items.length}</em></h2></div></div>
      <p className="ym-music-help">Find a public track or playlist on SoundCloud, copy its link, and add it here. Your collection is saved in this browser.</p>
      <form onSubmit={add} className="ym-music-add">
        <input aria-label="SoundCloud track or playlist URL" type="url" required placeholder="Paste SoundCloud track or playlist URL…" value={input} onChange={e=>setInput(e.target.value)} />
        <button type="submit" disabled={busy}>{busy ? "Checking…" : "+ Add to library"}</button>
      </form>
      {error && <p className="ym-music-error" role="alert">{error}</p>}
      <div className="ym-music-toolbar">
        <div className="ym-music-filters">{["All","Bollywood","English","International","Lo-fi","Electronic","Instrumental"].map(name=><button key={name} type="button" className={filter===name?"selected":""} onClick={()=>setFilter(name)}>{name}</button>)}</div>
        <input className="ym-music-search" type="search" aria-label="Filter saved music" placeholder="Search your library…" value={query} onChange={e=>setQuery(e.target.value)}/>
      </div>
      {!ready ? <p className="ym-music-help">Loading your library…</p> : shown.length === 0 ? <div className="ym-music-empty"><div>♫</div><h3>{items.length ? "No matches found" : "Your soundtrack starts here"}</h3><p>{items.length ? "Try another search or category." : "Add your first public SoundCloud track or playlist above. Browse the categories to find something worth saving."}</p></div> : <div className="ym-music-grid">{shown.map(item=><article key={item.url} className={`ym-music-card ${active===item.url?"active":""}`}>
        <button type="button" className="ym-music-card-main" onClick={()=>setActive(active===item.url?null:item.url)}>
          {item.thumbnail ? <img src={item.thumbnail} alt="" loading="lazy" /> : <div className="ym-music-placeholder">♫</div>}
          <span className="ym-music-card-play">{active===item.url?"✕":"▶"}</span>
        </button>
        <div className="ym-music-card-info"><strong title={item.title}>{item.title}</strong><small>{item.author || "SoundCloud"} · {item.category}</small></div>
        <div className="ym-music-card-actions"><a href={item.url} target="_blank" rel="noopener noreferrer">SoundCloud ↗</a><button type="button" onClick={()=>{setItems(old=>old.filter(x=>x.url!==item.url));if(active===item.url)setActive(null)}} aria-label={`Remove ${item.title}`}>Remove</button></div>
      </article>)}</div>}
    </section>
    {selected && <div className="ym-music-player" role="region" aria-label="SoundCloud music player">
      <div className="ym-music-player-top"><strong>{selected.title}</strong><button type="button" onClick={()=>setActive(null)} aria-label="Close music player">✕</button></div>
      <iframe key={selected.url} title={`SoundCloud: ${selected.title}`} src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(selected.url)}&color=%23ff713d&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false`} allow="encrypted-media" loading="lazy" />
    </div>}
    <p className="ym-music-disclaimer">Playback is provided by SoundCloud. Availability depends on each creator's embed settings and regional restrictions. This library is stored locally on your device; it does not sync across accounts.</p>
  </main>;
}
