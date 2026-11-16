import Link from "next/link";
import Image from "next/image";
import { IMG } from "../lib/tmdb";
import { Card, Section } from "./Cards";
import ProviderRail from "./ProviderRail";

// Same visual design as the main Home provider row, but the titles and links
// are filtered to anime instead of Hindi cinema.
export default function AnimeProviders({ providers, selected, ptype, titles, mkHref }) {
  if (!providers?.length) return null;
  return (
    <Section
      id="anime-providers"
      eyebrow="Where to watch · India"
      title="Anime streaming providers"
      right={
        <div className="toggle glass">
          <Link className={ptype === "tv" ? "on" : ""} href={mkHref({ ptype: "tv", p: "" }) + "#anime-providers"}>Series</Link>
          <Link className={ptype === "movie" ? "on" : ""} href={mkHref({ ptype: "movie", p: "" }) + "#anime-providers"}>Movies</Link>
        </div>
      }
      href={selected ? `/anime/provider/${selected.provider_id}?type=${ptype}` : undefined}
      hrefLabel="All ↗"
    >
      <div className="prov-panel v14-discovery">
        <ProviderRail
          providers={providers}
          selectedId={selected?.provider_id}
          ptype={ptype}
          imgBase={IMG}
          hrefs={providers.map((p) => mkHref({ ptype, p: String(p.provider_id) }) + "#anime-providers")}
        />
        {selected && (
          <>
            <div className="pbanner glass">
              <div className="lg">
                {selected.logo_path && <Image src={`${IMG}/w154${selected.logo_path}`} alt="" fill sizes="46px" />}
              </div>
              <div className="tx"><small>Popular Japanese anime {ptype === "tv" ? "series" : "movies"} on</small><b>{selected.provider_name}</b></div>
              <Link className="btn primary" href={`/anime/provider/${selected.provider_id}?type=${ptype}`}>View all ↗</Link>
            </div>
            {titles?.length ? (
              <div className="hrow">
                {titles.map((item) => <Card key={item.id} item={item} type={ptype} />)}
              </div>
            ) : (
              <p style={{ color: "var(--muted)", padding: "18px 4px" }}>No anime titles listed for {selected.provider_name} right now.</p>
            )}
          </>
        )}
      </div>
    </Section>
  );
}
