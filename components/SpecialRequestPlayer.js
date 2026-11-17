"use client";

import { useEffect, useRef, useState } from "react";

// Only for browser-playable streams supplied by a separately operated,
// authorized HTTPS streaming gateway. This is NOT direct Telegram playback.
export default function SpecialRequestPlayer({ id }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [streams, setStreams] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [help, setHelp] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setStreams([]); setSelected(-1); setError(""); setLoading(true);
    fetch(`/api/special-requests?type=movie&id=${encodeURIComponent(id)}`, { cache: "no-store", signal: controller.signal })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error("Special requests are unavailable.");
        setStreams(Array.isArray(data.streams) ? data.streams : []);
      })
      .catch((err) => { if (err.name !== "AbortError") setError("Unable to load special requests."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);

  useEffect(() => () => {
    hlsRef.current?.destroy();
    hlsRef.current = null;
  }, []);

  async function choose(item, index) {
    const video = videoRef.current;
    if (!video) return;
    hlsRef.current?.destroy(); hlsRef.current = null;
    video.pause(); video.removeAttribute("src"); video.load();
    setSelected(index); setError(""); setHelp("");
    const hls = item.format === "HLS" || /\.m3u8(?:[?#]|$)/i.test(item.url);
    if (!hls || video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = item.url;
      video.load();
      video.play().catch(() => setHelp("Press Play to begin this stream."));
      return;
    }
    try {
      const { default: Hls } = await import("hls.js");
      if (!Hls.isSupported()) throw new Error("Unsupported HLS");
      const player = new Hls({ enableWorker: true });
      hlsRef.current = player;
      player.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setError("This video could not be played in your browser.");
      });
      player.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => setHelp("Press Play to begin this stream.")));
      player.loadSource(item.url);
      player.attachMedia(video);
    } catch {
      setError("This stream is not compatible with your browser.");
    }
  }

  return (
    <section className="test-stream-layout" aria-label="Special request streaming player">
      <div className="test-stream-main">
        <div className="test-stream-video-wrap">
          {selected < 0 && <div className="test-stream-idle"><span className="test-stream-idle-icon">▶</span><h2>Select an available source</h2><p>Choose an additional Watch option when available.</p></div>}
          <video ref={videoRef} className={selected < 0 ? "test-stream-video-hidden" : "test-stream-video"} controls playsInline preload="metadata" aria-label="YMCINEMA special request video" onError={() => setError("This video could not be played. Try another option.")} />
        </div>
        {error && <p className="test-stream-alert" role="alert">{error}</p>}
        {help && !error && <p className="test-stream-help">{help}</p>}
      </div>
      <aside className="test-stream-aside">
        <div className="test-stream-sources-heading"><small>ADDITIONAL OPTIONS</small><h2>Special Requests</h2><p>Available Watch options for this movie.</p></div>
        {loading && <p className="test-stream-help">Checking available options…</p>}
        {!loading && streams.length === 0 && !error && <p className="test-stream-help">No special-request streams available for this title right now.</p>}
        <div className="test-stream-source-list">
          {streams.map((item, index) => <button type="button" key={`${index}-${item.url}`} className={`test-stream-source ${selected === index ? "is-selected" : ""}`} onClick={() => choose(item,index)} aria-pressed={selected === index}>
            <span className="test-stream-source-play">▶</span>
            <span><strong>{item.label}</strong><small>{item.quality} · {item.format}</small></span>
            <span className="test-stream-source-arrow">›</span>
          </button>)}
        </div>
        <p className="test-stream-caveat">Availability and playback depend on the stream provider and browser support. Some MKV and HEVC files require conversion to HLS or MP4.</p>
      </aside>
    </section>
  );
}
