import { tmdb } from "../../../../lib/tmdb";
import { Grid } from "../../../../components/Cards";
import Link from "next/link";
const names={28:"Action",12:"Adventure",16:"Animation",35:"Comedy",80:"Crime",99:"Documentary",18:"Drama",10751:"Family",14:"Fantasy",27:"Horror",10749:"Romance",878:"Science Fiction",53:"Thriller",10759:"Action & Adventure",10765:"Sci-Fi & Fantasy",9648:"Mystery"};
export default async function GenrePage({params}){
 const {type,id}=await params;
 if(!["movie","tv"].includes(type)||!/^\d+$/.test(id)) return <main className="wrap genre-page"><h1>Genre not found</h1></main>;
 let results=[];let error=false;
 try{const data=await tmdb(`/discover/${type}`,{with_genres:id,sort_by:"popularity.desc",page:"1"});results=data.results||[];}catch{error=true;}
 return <main className="wrap genre-page"><Link className="pill-link glass" href="/#genres">← Back to genres</Link><p className="eyebrow">Explore {type==="tv"?"TV shows":"movies"}</p><h1>{names[id]||"Genre"}</h1>{error?<p>Titles are unavailable right now. Please try again later.</p>:results.length?<Grid items={results} type={type}/>:<p>No titles found for this genre.</p>}</main>
}
