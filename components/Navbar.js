"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home", on: (p) => p === "/" },
  { href: "/browse/bollywood-latest", label: "Bollywood", on: (p) => p.startsWith("/browse/bollywood") },
  { href: "/browse/hollywood-trending", label: "Hollywood", on: (p) => p.startsWith("/browse/hollywood") },
  { href: "/browse/hindi-series", label: "Series", on: (p) => p.startsWith("/browse/hindi-series") },
  { href: "/browse/tv-trending", label: "TV Shows", on: (p) => p.startsWith("/browse/tv") || p.startsWith("/tv/") },
  { href: "/#providers", label: "Streaming", on: (p) => p.startsWith("/provider") },
];

export default function Navbar() {
  const path = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  function submit(e) {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    router.push(`/search?q=${encodeURIComponent(v)}`);
    setOpen(false);
    setQ("");
  }

  return (
    <header className="nav glass">
      <Link href="/" className="nav-logo" aria-label="YMCINEMA home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9Z" />
          <path d="m3 9 2.5-5 3 .6L6 9.6M9.5 4.6l3 .6L10 10.2M13.5 5.4l3 .6L14 11M17.5 6.2l3 .6" />
        </svg>
        <span>YMCINEMA</span>
      </Link>
      <nav className="nav-links">
        {LINKS.map((l) => (
          <Link key={l.label} href={l.href} className={l.on(path) ? "on" : ""}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="nav-right">
        {open && (
          <form onSubmit={submit}>
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search movies & shows…" />
          </form>
        )}
        <button className="icon-btn" aria-label="Search" onClick={() => setOpen((o) => !o)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}
