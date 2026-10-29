import Link from "next/link";
import Image from "next/image";
import { IMG } from "../lib/tmdb";

export function Providers({ providers }) {
  if (!providers?.length) return null;
  return (
    <section className="section">
      <p className="eyebrow">Where to watch · India</p>
      <h2>Streaming providers</h2>
      <div className="row providers">
        {providers.map((p) => (
          <Link key={p.provider_id} href={`/provider/${p.provider_id}`} className="prov">
            <div className="logo-box">
              {p.logo_path && (
                <Image src={`${IMG}/w154${p.logo_path}`} alt={p.provider_name} fill sizes="72px" />
              )}
            </div>
            <span>{p.provider_name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
