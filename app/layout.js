import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "YMCINEMA – Bollywood & Hollywood Movie Discovery",
  description: "Discover the latest and classic Bollywood movies, plus Hollywood films and TV series. Data from TMDB.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <div className="wrap">
            <Link href="/" className="logo">YM<span>CINEMA</span></Link>
            <div className="links">
              <Link href="/browse/bollywood-latest">Latest</Link>
              <Link href="/browse/bollywood-trending">Trending</Link>
              <Link href="/browse/bollywood-top-rated">Top Rated</Link>
              <Link href="/browse/bollywood-classics">Classics</Link>
              <Link href="/browse/bollywood-upcoming">Upcoming</Link>
              <Link href="/browse/hindi-series">Hindi Series</Link>
              <Link href="/browse/hollywood-trending">Hollywood</Link>
              <Link href="/browse/tv-trending">TV</Link>
            </div>
            <form action="/search">
              <input name="q" placeholder="Search movies & shows…" />
            </form>
          </div>
        </nav>
        {children}
        <footer>
          YMCINEMA is a movie &amp; TV discovery site. This product uses the TMDB API but is not endorsed or certified by TMDB.
        </footer>
      </body>
    </html>
  );
}
