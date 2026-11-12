import Link from "next/link";
import Image from "next/image";
import { IMG } from "../lib/tmdb";
import { Card, Section } from "./Cards";
import ProviderRail from "./ProviderRail";

// Streaming providers (India), ordered Bollywood-first. Server-rendered: tiles are links
// that reload the home page with ?p=<providerId>&ptype=<movie|tv>.
export function Providers({ providers, selected, ptype, titles, mkHref }) {
  if (!providers?.length) return null;
  const word = ptype === "tv" ? "series" : "movies";
  return (
    <Section
      id="providers"
      eyebrow="Where to watch · India"
      title="Streaming providers"
      right={
        <div className="toggle glass">
          <Link className={ptype === "movie" ? "on" : ""} href={mkHref({ ptype: "movie", p: "" }) + "#providers"}>
            Movies
          </Link>
          <Link className={ptype === "tv" ? "on" : ""} href={mkHref({ ptype: "tv", p: "" }) + "#providers"}>
            TV Shows
          </Link>
        </div>
      }
      href={selected ? `/provider/${selected.provider_id}?type=${ptype}` : undefined}
      hrefLabel="All ↗"
    >
      <div className="prov-panel v14-discovery">
        <ProviderRail providers={providers} selectedId={selected?.provider_id} ptype={ptype} imgBase={IMG} hrefs={providers.map(p => mkHref({ ptype, p: String(p.provider_id) }) + "#providers")} />

        {selected && (
          <>
            <div className="pbanner glass">
              <div className="lg">
                {selected.logo_path && <Image src={`${IMG}/w154${selected.logo_path}`} alt="" fill sizes="46px" />}
              </div>
              <div className="tx">
                <small>Popular Hindi {word} on</small>
                <b>{selected.provider_name}</b>
              </div>
              <Link className="btn primary" href={`/provider/${selected.provider_id}?type=${ptype}`}>
                View all ↗
              </Link>
            </div>
            {titles?.length ? (
              <div className="hrow">
                {titles.map((m) => (
                  <Card key={m.id} item={m} type={ptype} />
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--muted)", padding: "18px 4px" }}>
                No Hindi titles listed for {selected.provider_name} right now.
              </p>
            )}
          </>
        )}
      </div>
    </Section>
  );
}
