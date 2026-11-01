import Link from "next/link";
import { notFound } from "next/navigation";
import { tmdb, IMG } from "../../../../lib/tmdb";
import WatchExperience from "../../../../components/WatchExperience";
import WatchEpisodeNavigator from "../../../../components/WatchEpisodeNavigator";

export default async function Page({ params, searchParams }) {
  const { type, id } = await params;
  const sp = (await searchParams) || {};
  if (!["movie", "tv"].includes(type) || !/^\d+$/.test(id)) notFound();
  let movie;
  try { movie = await tmdb(`/${type}/${id}`); } catch { notFound(); }
  const title = movie.title || movie.name || "Untitled";
  const backdrop = movie.backdrop_path ? `${IMG}/original${movie.backdrop_path}` : null;
  return <main className="watch-screen" style={backdrop ? {backgroundImage: `linear-gradient(90deg,rgba(6,5,12,.94),rgba(6,5,12,.54)),linear-gradient(0deg,#09070d,transparent 70%),url('${backdrop}')`} : {}}>
    <Link className="watch-back" href={`/${type}/${id}`}>← Back to details</Link>
    <WatchExperience movieId={id} type={type} title={title} seasons={movie.number_of_seasons || 1} initialSeason={Math.max(1, Number(sp.season)||1)} initialEpisode={Math.max(1, Number(sp.episode)||1)} />
    {type === "tv" && <WatchEpisodeNavigator id={id} seasons={movie.number_of_seasons || 1} initialSeason={Math.max(1, Number(sp.season)||1)} initialEpisode={Math.max(1, Number(sp.episode)||1)} />}
  </main>;
}
