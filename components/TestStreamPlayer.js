"use client";

import { useEffect, useRef, useState } from "react";

function isHlsSource(item) {
  return item.format === "HLS" || /\.m3u8(?:[?#]|$)/i.test(item.url);
}

function appleDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR/i.test(ua));
}

function formatHint(item) {
  if (isHlsSource(item)) return "HLS · Apple-friendly";
  if (item.format === "MP4") return "MP4 · Try on Safari";
  if (item.format === "MKV") return "MKV · May not play on Safari";
  if (item.format === "WebM") return "WebM · Support varies";
  return `${item.format || "Stream"} · Compatibility varies`;
}

function playbackErrorMessage(video, isApple) {
  const code = video?.error?.code;
  const detail = {
    1: "Playback was interrupted.",
    2: "The source could not be loaded. It may not allow access from this device or may not support HTTP range requests.",
    3: "This device could not decode the stream. Try another quality or format.",
    4: "The stream format is not supported, or its server is refusing playback.",
  }[code] || "This stream could not be played.";
  return isApple
    ? `${detail} Safari usually needs compatible HLS or MP4 (H.264/AAC) and a source server that supports video seeking. Try another Watch option. (Media error ${code || "unknown"})`
    : `${detail} Try another Watch option. (Media error ${code || "unknown"})`;
}

export default function TestStreamPlayer({ id }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const requestSeq = useRef(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isApple, setIsApple] = useState(false);

  function clearCurrentPlayback() {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
  }

  useEffect(() => {
    setIsApple(appleDevice());
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    ++requestSeq.current;
    clearCurrentPlayback();
    setLoading(true);
    setError("");
    setMessage("");
    setOptions([]);
    setSelected(-1);
    fetch(`/api/test-stream?type=movie&id=${encodeURIComponent(id)}`, { signal: controller.signal, cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to retrieve test streams");
        const streams = Array.isArray(data.streams) ? data.streams : [];
        setOptions(streams);
        if (!streams.length) setMessage(data.note || "No streams found.");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message || "Unable to load sources");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => {
      controller.abort();
      ++requestSeq.current;
      clearCurrentPlayback();
    };
  }, [id]);

  // Keep this in the actual button click rather than a React effect: on iPhone,
  // starting native media in a user gesture is considerably more reliable.
  async function chooseStream(item, index) {
    const video = videoRef.current;
    if (!video) return;
    const seq = ++requestSeq.current;
    clearCurrentPlayback();
    setSelected(index);
    setError("");
    setMessage("Preparing stream…");

    const nativeHls = isHlsSource(item) && Boolean(
      video.canPlayType("application/vnd.apple.mpegurl") ||
      video.canPlayType("application/x-mpegURL")
    );

    if (isHlsSource(item) && !nativeHls) {
      // HLS.js is for browsers without native HLS support. Safari uses its
      // native AVPlayer path above; preserve Chromium's already-working path.
      try {
        const { default: Hls } = await import("hls.js");
        if (seq !== requestSeq.current) return;
        if (!Hls.isSupported()) {
          setError("This browser cannot play HLS. Try a direct MP4 option.");
          return;
        }
        const hls = new Hls({ enableWorker: true });
        hlsRef.current = hls;
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          if (seq === requestSeq.current) hls.loadSource(item.url);
        });
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (seq === requestSeq.current) setMessage("Ready. Press Play to start.");
        });
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (!data.fatal || seq !== requestSeq.current) return;
          setError("This HLS source could not be loaded or decoded. Try another Watch option.");
        });
        hls.attachMedia(video);
      } catch {
        if (seq === requestSeq.current) setError("Could not initialize HLS playback in this browser.");
      }
      return;
    }

    // For MP4/direct streams and for native Safari HLS, assign the URL and
    // play *synchronously* with the remote/tap. A delayed effect can lose the
    // transient user activation which iOS requires for media playback.
    video.src = item.url;
    video.load();
    const playing = video.play();
    if (playing && typeof playing.then === "function") {
      playing.then(() => {
        if (seq === requestSeq.current) setMessage("");
      }).catch(() => {
        if (seq === requestSeq.current && !video.error) {
          setMessage("Stream selected. Press the video Play button to start.");
        }
      });
    }
  }

  function handleVideoError() {
    const video = videoRef.current;
    if (selected < 0 || !video?.error) return;
    setMessage("");
    setError(playbackErrorMessage(video, isApple));
  }

  return (
    <section className="test-stream-layout" aria-label="Test streaming player">
      <div className="test-stream-main">
        <div className="test-stream-video-wrap">
          {selected < 0 && (
            <div className="test-stream-idle">
              <span className="test-stream-idle-icon">▶</span>
              <h2>Select a test source</h2>
              <p>Your existing YMCINEMA player is unchanged.</p>
            </div>
          )}
          <video
            ref={videoRef}
            className="test-stream-video"
            controls
            playsInline
            preload="metadata"
            onPlaying={() => { setError(""); setMessage(""); }}
            onError={handleVideoError}
            aria-label="YMCINEMA test video player"
          />
        </div>
        {error && <p className="test-stream-alert" role="alert">{error}</p>}
        {message && !error && <p className="test-stream-help">{message}</p>}
        {isApple && (
          <p className="test-stream-apple-note">
            <strong>Safari playback:</strong> HLS streams are played using Safari’s native player. MP4 can also work when the video codec and server are compatible. MKV and some other streams may require conversion by the source provider.
          </p>
        )}
      </div>
      <aside className="test-stream-aside">
        <div className="test-stream-sources-heading">
          <small>EXPERIMENTAL</small>
          <h2>Available streams</h2>
          <p>Choose a Watch option to test playback in this page.</p>
        </div>
        {loading && <p className="test-stream-help">Checking configured addons…</p>}
        {!loading && !options.length && !error && <p className="test-stream-help">No compatible HTTPS sources were returned.</p>}
        <div className="test-stream-source-list">
          {options.map((item, i) => (
            <button
              type="button"
              key={`${i}-${item.url}`}
              onClick={() => chooseStream(item, i)}
              className={`test-stream-source ${selected === i ? "is-selected" : ""}`}
              aria-pressed={selected === i}
            >
              <span className="test-stream-source-play">▶</span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.quality} · {isApple ? formatHint(item) : item.format}</small>
              </span>
              <span className="test-stream-source-arrow">›</span>
            </button>
          ))}
        </div>
        <p className="test-stream-caveat">
          Some 4K, MKV, HEVC and other streams require decoding or transcoding that browsers do not support. This test does not transcode video or bypass DRM.
        </p>
      </aside>
    </section>
  );
}
