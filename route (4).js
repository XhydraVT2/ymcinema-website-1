import { tmdb } from '../../../../../../lib/tmdb';
export async function GET(_request,{params}) {
  const {id,season}=await params;
  if(!/^\d+$/.test(id)||!/^\d+$/.test(season)) return Response.json({error:'Invalid season'},{status:400});
  try {
    const data=await tmdb(`/tv/${id}/season/${season}`);
    return Response.json({season_number:data.season_number,episodes:(data.episodes||[]).map(e=>({number:e.episode_number,name:e.name,overview:e.overview,still:e.still_path,runtime:e.runtime,air_date:e.air_date}))});
  } catch { return Response.json({error:'Episodes unavailable'},{status:502}); }
}
