import Link from "next/link";
import Image from "next/image";
import { IMG } from "../lib/tmdb";
import { Card, Section } from "./Cards";

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
      <div className="prov-panel">
        <div className="tiles">
          {providers.map((p) => (
            <Link
              key={p.provider_id}
              href={mkHref({ ptype, p: String(p.provider_id) }) + "#providers"}
              className={`tile ${selected && p.provider_id === selected.provider_id ? "sel" : ""}`}
              scroll={false}
            >
              <div className="lb">
                {p.logo_path && <Image src={`${IMG}/w154${p.logo_path}`} alt={p.provider_name} fill sizes="70px" />}
              </div>
              {p.provider_name}
            </Link>
          ))}
        </div>

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
