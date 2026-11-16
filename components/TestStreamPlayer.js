"use client";

import { useEffect, useRef, useState } from "react";

export default function TestStreamPlayer({ id }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(""); setOptions([]); setSelected(-1);
    fetch(`/api/test-stream?type=movie&id=${encodeURIComponent(id)}`, { signal: controller.signal, cache: "no-store" })
      .then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Unable to retrieve test streams");
        setOptions(data.streams || []);
        if (!(data.streams || []).length) setMessage(data.note || "No streams found.");
      })
      .catch(err => { if (err.name !== "AbortError") setError(err.message || "Unable to load sources"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    const video = videoRef.current;
    if (!video || selected < 0 || !options[selected]) return;
    const item = options[selected];
    setMessage(""); setError("");
    video.pause(); video.removeAttribute("src"); video.load();
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

    async function load() {
      try {
        const isHls = item.format === "HLS" || /\.m3u8(?:[?#]|$)/i.test(item.url);
        if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = item.url;
        } else if (isHls) {
          const { default: Hls } = await import("hls.js");
          if (cancelled) return;
          if (!Hls.isSupported()) { setError("HLS playback is not supported in this browser."); return; }
          const hls = new Hls({ enableWorker: true });
          hlsRef.current = hls;
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) setError("Unable to play this stream. The source may block browser access or use unsupported codecs.");
          });
          hls.loadSource(item.url);
          hls.attachMedia(video);
        } else {
          video.src = item.url;
        }
        setMessage("Press Play to start. If playback fails, try another source.");
      } catch {
        if (!cancelled) setError("Couldn't initialize this browser player.");
      }
    }
    load();
    return () => {
      cancelled = true;
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
      video.pause(); video.removeAttribute("src"); video.load();
    };
  }, [selected, options]);

  function onVideoError() {
    if (selected >= 0) setError("This stream isn't browser-compatible, can't be reached, or doesn't allow playback here. Try another Watch option.");
  }

  return (
    <section className="test-stream-layout" aria-label="Test streaming player">
      <div className="test-stream-main">
        <div className="test-stream-video-wrap">
          {selected < 0 ? (
            <div className="test-stream-idle"><span className="test-stream-idle-icon">▶</span><h2>Select a test source</h2><p>Your existing YMCINEMA player is unchanged.</p></div>
          ) : null}
          <video ref={videoRef} className={selected < 0 ? "test-stream-video-hidden" : "test-stream-video"} controls playsInline preload="metadata" onError={onVideoError} aria-label="YMCINEMA test video player" />
        </div>
        {error && <p className="test-stream-alert" role="alert">{error}</p>}
        {message && !error && <p className="test-stream-help">{message}</p>}
      </div>
      <aside className="test-stream-aside">
        <div className="test-stream-sources-heading"><small>EXPERIMENTAL</small><h2>Available streams</h2><p>Choose a Watch option to test playback in this page.</p></div>
        {loading && <p className="test-stream-help">Checking configured addons…</p>}
        {!loading && !options.length && !error && <p className="test-stream-help">No compatible HTTPS sources were returned.</p>}
        <div className="test-stream-source-list">
          {options.map((item, i) => <button type="button" key={`${i}-${item.url}`} onClick={() => setSelected(i)} className={`test-stream-source ${selected === i ? "is-selected" : ""}`} aria-pressed={selected === i}>
            <span className="test-stream-source-play">▶</span>
            <span><strong>{item.label}</strong><small>{item.quality} · {item.format}</small></span>
            <span className="test-stream-source-arrow">›</span>
          </button>)}
        </div>
        <p className="test-stream-caveat">Some 4K, MKV, HEVC and other streams require decoding or transcoding that browsers do not support. This test does not transcode video or bypass DRM.</p>
      </aside>
    </section>
  );
}
