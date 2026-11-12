"use client";
import {useRef} from "react";
import Link from "next/link";
import Image from "next/image";
export default function ProviderRail({providers,selectedId,ptype,hrefs,imgBase}){
 const rail=useRef(null);
 const move=(direction)=>rail.current?.scrollBy({left:direction*420,behavior:"smooth"});
 return <div className="v14-provider-shell"><div className="v14-rail" ref={rail} aria-label="Choose a streaming provider">
 {providers.map((p,i)=><Link key={p.provider_id} href={hrefs[i]} scroll={false} className={'v14-provider '+(p.provider_id===selectedId?'active':'')} title={'Show '+p.provider_name+' titles'}><span className="v14-provider-logo">{p.logo_path?<Image src={`${imgBase}/w154${p.logo_path}`} alt="" fill sizes="72px"/>:<span>{p.provider_name.slice(0,2)}</span>}</span><span className="v14-provider-name">{p.provider_name}</span></Link>)}
 </div><div className="v14-rail-controls"><button type="button" aria-label="Scroll providers left" onClick={()=>move(-1)}>‹</button><button type="button" aria-label="Scroll providers right" onClick={()=>move(1)}>›</button></div></div>
}
