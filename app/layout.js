import "./globals.css";
import { Outfit } from "next/font/google";
import Navbar from "../components/Navbar";

const font = Outfit({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "YMCINEMA – Bollywood & Hollywood Movie Discovery",
  description: "Discover the latest and classic Bollywood movies, plus Hollywood films and TV series. Data from TMDB.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Navbar />
        {children}
        <footer className="glass">
          YMCINEMA is a movie &amp; TV discovery site.
          <br />
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </footer>
      </body>
    </html>
  );
}
