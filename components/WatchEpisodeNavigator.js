'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';

export default function WatchEpisodeNavigator({id,seasons,initialSeason,initialEpisode}) {
  const router=useRouter();
  const [season,setSeason]=useState(initialSeason);
  const [episodes,setEpisodes]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{
    const controller=new AbortController();
    setLoading(true);setError('');
    fetch(`/api/tv/${id}/season/${season}`,{signal:controller.signal})
      .then(r=>{if(!r.ok)throw Error('Unable to load episodes');return r.json()})
      .then(d=>setEpisodes((d.episodes||[]).filter(e=>e.number>0)))
      .catch(e=>{if(e.name!=='AbortError')setError('Episode information is temporarily unavailable.')})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false)});
    return ()=>controller.abort();
  },[id,season]);
  const active=season===initialSeason?initialEpisode:null;
  const nextIndex=episodes.findIndex(e=>e.number===active)+1;
  const next=active!=null&&nextIndex>0?episodes[nextIndex]:null;
  const go=(s,e)=>router.push(`/watch/tv/${id}?season=${s}&episode=${e}`);
  return <section className="watch-episode-navigator" aria-label="Episodes and seasons">
    <div className="watch-episodes-header"><div><span className="watch-episodes-eyebrow">CONTINUE WATCHING</span><h2>Episodes & Seasons</h2><p>Choose an episode without returning to the show page.</p></div><div className="watch-episodes-actions"><label htmlFor="watch-season-select">Season</label><select id="watch-season-select" value={season} onChange={e=>setSeason(Number(e.target.value))}>{Array.from({length:seasons},(_,i)=><option key={i} value={i+1}>Season {i+1}</option>)}</select>{next&&<button className="watch-next-episode" onClick={()=>go(season,next.number)}>Next episode →</button>}</div></div>
    {loading?<p className="watch-episode-status">Loading episodes…</p>:error?<p className="watch-episode-status">{error}</p>:episodes.length===0?<p className="watch-episode-status">No episodes are listed for this season.</p>:<div className="watch-episode-rail">{episodes.map(e=><button key={e.number} className={`watch-episode-tile ${active===e.number?'is-current':''}`} onClick={()=>go(season,e.number)} aria-current={active===e.number?'true':undefined}><div className="watch-episode-art">{e.still?<img src={`https://image.tmdb.org/t/p/w500${e.still}`} alt="" loading="lazy"/>:<div className="watch-episode-placeholder">Episode {e.number}</div>}<span className="watch-episode-index">E{e.number}</span>{active===e.number&&<span className="watch-now-playing">NOW PLAYING</span>}</div><strong>{e.name||`Episode ${e.number}`}</strong><span className="watch-episode-sub">Episode {e.number}{e.runtime?` · ${e.runtime} min`:''}</span>{e.overview&&<p>{e.overview}</p>}</button>)}</div>}
  </section>;
}
