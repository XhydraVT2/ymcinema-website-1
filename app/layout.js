import "./globals.css";
import { Outfit } from "next/font/google";
import Navbar from "../components/Navbar";
import AmbientBackdrop from "../components/AmbientBackdrop";

const font = Outfit({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "YMCINEMA – Bollywood & Hollywood Movie Discovery",
  description: "Discover the latest and classic Bollywood movies, plus Hollywood films and TV series. Data from TMDB.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <AmbientBackdrop />
        <Navbar />
        {children}
        <footer className="ymc-footer"><span>YMCINEMA</span></footer>
      </body>
    </html>
  );
}
