const platforms = [
  {name:'Netflix',mark:'NETFLIX',style:'netflix'},
  {name:'Prime Video',mark:'prime video',style:'prime'},
  {name:'JioHotstar',mark:'JioHotstar',style:'hotstar'},
  {name:'ZEE5',mark:'ZEE5',style:'zee'},
  {name:'SonyLIV',mark:'SonyLIV',style:'sony'},
  {name:'Sun NXT',mark:'SUN NXT',style:'sun'},
  {name:'aha',mark:'aha',style:'aha'},
  {name:'Apple TV+',mark:'tv+',style:'apple'},
  {name:'Disney+',mark:'Disney+',style:'disney'},
  {name:'Hulu',mark:'hulu',style:'hulu'},
  {name:'Max',mark:'max',style:'max'},
  {name:'YouTube',mark:'YouTube',style:'youtube'},
  {name:'Tubi',mark:'tubi',style:'tubi'},
];
export default function PlatformCarousel(){
 return <section className="platform-showcase" aria-labelledby="platform-showcase-title">
  <h2 id="platform-showcase-title">All Your Favorite Platforms In One Place</h2>
  <p>Discover movies and shows from the streaming services you know.</p>
  <div className="platform-window" aria-label="Streaming platforms">
   <div className="platform-track">
    {[0,1].map(copy=><div className="platform-set" key={copy} aria-hidden={copy===1 ? 'true':undefined}>
     {platforms.map(p=><div key={p.name} className={'platform-tile platform-'+p.style} title={p.name}><span>{p.mark}</span></div>)}
    </div>)}
   </div>
  </div>
 </section>
}
