"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Episode {
  name: string;
  slug: string;
  link_embed: string | null;
}

interface Server {
  server_name: string;
  server_data: Episode[];
}

interface VideoPlayerProps {
  servers: Server[];
  movieTitle: string;
  initialEpisodeSlug?: string;
}

function buildHlsUrl(linkEmbed: string): string {
  const directUrl = linkEmbed.replace(/\/?$/, "") + "/master-b2.m3u8";
  return `/api/hls?url=${encodeURIComponent(directUrl)}`;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function VideoPlayer({ servers, movieTitle, initialEpisodeSlug }: VideoPlayerProps) {
  const allEpisodes = servers.flatMap((s) =>
    s.server_data.filter((ep) => ep.link_embed).map((ep) => ({ ...ep, serverName: s.server_name }))
  );

  const initialIdx = initialEpisodeSlug
    ? Math.max(0, allEpisodes.findIndex((e) => e.slug === initialEpisodeSlug))
    : 0;

  const [activeIdx, setActiveIdx]       = useState(initialIdx);
  const [activeServer, setActiveServer] = useState(servers[0]?.server_name ?? "");

  // Player state
  const [isPlaying, setIsPlaying]       = useState(false);
  const [currentTime, setCurrentTime]   = useState(0);
  const [duration, setDuration]         = useState(0);
  const [buffered, setBuffered]         = useState(0);
  const [isMuted, setIsMuted]           = useState(false);
  const [volume, setVolume]             = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [seekFeedback, setSeekFeedback] = useState<{ dir: "back" | "fwd"; visible: boolean }>({
    dir: "fwd",
    visible: false,
  });

  const videoRef      = useRef<HTMLVideoElement>(null);
  const hlsRef        = useRef<any>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const hideTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentEp = allEpisodes[activeIdx];
  const storageKey = `hfx:${currentEp?.slug ?? "ep"}`;

  // ── Load HLS ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentEp?.link_embed || !videoRef.current) return;
    const hlsUrl = buildHlsUrl(currentEp.link_embed);
    const video  = videoRef.current;

    async function loadHls() {
      const { default: Hls } = await import("hls.js");
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          backBufferLength: 90,
          xhrSetup: (xhr: XMLHttpRequest) => {
            xhr.setRequestHeader("ngrok-skip-browser-warning", "true");
            xhr.setRequestHeader("Bypass-Tunnel-Reminder", "true");
          },
        });
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // Khôi phục vị trí đã xem
          const saved = parseFloat(localStorage.getItem(storageKey) ?? "0");
          if (saved > 5) video.currentTime = saved;
          video.play().catch(() => {});
        });
        hlsRef.current = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
        const saved = parseFloat(localStorage.getItem(storageKey) ?? "0");
        if (saved > 5) video.currentTime = saved;
        video.play().catch(() => {});
      }
    }

    loadHls();
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEp]);

  // ── Video event listeners ──────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay     = () => setIsPlaying(true);
    const onPause    = () => setIsPlaying(false);
    const onDuration = () => setDuration(video.duration);
    const onTime     = () => {
      setCurrentTime(video.currentTime);
      // Lưu tiến độ mỗi 5s
      if (Math.floor(video.currentTime) % 5 === 0) {
        localStorage.setItem(storageKey, String(video.currentTime));
      }
      // Buffered
      if (video.buffered.length > 0) {
        setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100);
      }
    };
    const onVolume = () => {
      setIsMuted(video.muted);
      setVolume(video.volume);
    };

    video.addEventListener("play",           onPlay);
    video.addEventListener("pause",          onPause);
    video.addEventListener("durationchange", onDuration);
    video.addEventListener("timeupdate",     onTime);
    video.addEventListener("volumechange",   onVolume);

    return () => {
      video.removeEventListener("play",           onPlay);
      video.removeEventListener("pause",          onPause);
      video.removeEventListener("durationchange", onDuration);
      video.removeEventListener("timeupdate",     onTime);
      video.removeEventListener("volumechange",   onVolume);
    };
  }, [storageKey]);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!containerRef.current?.contains(document.activeElement) &&
          document.activeElement?.tagName !== "BODY") return;
      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case " ": case "k": e.preventDefault(); togglePlay(); break;
        case "ArrowLeft":   e.preventDefault(); seek(-10);     break;
        case "ArrowRight":  e.preventDefault(); seek(10);      break;
        case "ArrowUp":     e.preventDefault(); changeVolume(0.1);  break;
        case "ArrowDown":   e.preventDefault(); changeVolume(-0.1); break;
        case "m": case "M": toggleMute(); break;
        case "f": case "F": toggleFullscreen(); break;
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-hide controls ─────────────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 3000);
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────
  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  }

  function seek(delta: number) {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
    // Feedback animation
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setSeekFeedback({ dir: delta < 0 ? "back" : "fwd", visible: true });
    feedbackTimer.current = setTimeout(() => setSeekFeedback((s) => ({ ...s, visible: false })), 700);
  }

  function changeVolume(delta: number) {
    const v = videoRef.current;
    if (!v) return;
    v.volume = Math.max(0, Math.min(1, v.volume + delta));
    v.muted  = v.volume === 0;
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  }

  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  }

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.currentTime = ratio * duration;
  }

  function handleVolumeClick(e: React.MouseEvent<HTMLDivElement>) {
    const v = videoRef.current;
    if (!v) return;
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.volume = Math.max(0, Math.min(1, ratio));
    v.muted  = ratio === 0;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ── Empty state ────────────────────────────────────────────────────────────
  if (allEpisodes.length === 0) {
    return (
      <div className="flex items-center justify-center aspect-video bg-surface-container rounded-xl">
        <p className="text-on-surface-variant font-[Inter]">Chưa có link xem</p>
      </div>
    );
  }

  const serverEps = servers.find((s) => s.server_name === activeServer)
    ?.server_data.filter((ep) => ep.link_embed) ?? [];

  return (
    <div className="flex flex-col gap-4">

      {/* ── Player container ── */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group select-none"
        onMouseMove={resetHideTimer}
        onMouseLeave={() => {
          if (videoRef.current && !videoRef.current.paused) setShowControls(false);
        }}
        onClick={togglePlay}
        tabIndex={0}
      >
        <video
          ref={videoRef}
          className="w-full h-full"
          playsInline
          onClick={(e) => e.stopPropagation()}
        />

        {/* Seek feedback overlay */}
        {seekFeedback.visible && (
          <div className={`absolute inset-y-0 flex items-center justify-center w-1/3 pointer-events-none
            ${seekFeedback.dir === "back" ? "left-0" : "right-0"}`}>
            <div className="bg-black/50 rounded-full p-4 flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-white text-[36px]">
                {seekFeedback.dir === "back" ? "replay_10" : "forward_10"}
              </span>
              <span className="text-white text-[13px] font-[Inter] font-semibold">
                {seekFeedback.dir === "back" ? "-10s" : "+10s"}
              </span>
            </div>
          </div>
        )}

        {/* Controls overlay */}
        <div
          className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Control bar */}
          <div className="relative z-10 px-4 pb-3 flex flex-col gap-2">

            {/* Progress bar */}
            <div
              className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer group/pb hover:h-2.5 transition-all"
              onClick={handleProgressClick}
            >
              {/* Buffered */}
              <div
                className="absolute h-full bg-white/30 rounded-full pointer-events-none"
                style={{ width: `${buffered}%` }}
              />
              {/* Played */}
              <div
                className="h-full bg-primary-container rounded-full relative pointer-events-none"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/pb:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Buttons row */}
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-primary-container transition-colors"
                aria-label={isPlaying ? "Dừng" : "Phát"}
              >
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                  {isPlaying ? "pause" : "play_arrow"}
                </span>
              </button>

              {/* Tua lùi 10s */}
              <button
                onClick={() => seek(-10)}
                className="text-white hover:text-primary-container transition-colors"
                aria-label="Tua lùi 10 giây"
              >
                <span className="material-symbols-outlined text-[24px]">replay_10</span>
              </button>

              {/* Tua tới 10s */}
              <button
                onClick={() => seek(10)}
                className="text-white hover:text-primary-container transition-colors"
                aria-label="Tua tới 10 giây"
              >
                <span className="material-symbols-outlined text-[24px]">forward_10</span>
              </button>

              {/* Thời gian */}
              <span className="text-white text-[13px] font-[Inter] tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Volume */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-primary-container transition-colors"
                  aria-label={isMuted ? "Bật âm" : "Tắt âm"}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                    {isMuted || volume === 0 ? "volume_off" : volume < 0.5 ? "volume_down" : "volume_up"}
                  </span>
                </button>
                <div
                  className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-200 cursor-pointer"
                  onClick={handleVolumeClick}
                >
                  <div className="w-20 h-1.5 bg-white/30 rounded-full">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-primary-container transition-colors"
                aria-label="Toàn màn hình"
              >
                <span className="material-symbols-outlined text-[22px]">fullscreen</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Đang xem ── */}
      <p className="text-[14px] font-[Inter] text-tertiary px-1">
        Đang xem:{" "}
        <span className="text-on-surface font-semibold">
          {movieTitle}{currentEp ? ` — Tập ${currentEp.name}` : ""}
        </span>
        <span className="ml-2 text-[12px] text-tertiary/60">
          (Phím tắt: Space=Phát/Dừng, ←→=Tua 10s, ↑↓=Âm lượng, F=Toàn màn hình, M=Tắt tiếng)
        </span>
      </p>

      {/* ── Chọn Server ── */}
      {servers.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {servers.map((s) => (
            <button
              key={s.server_name}
              onClick={() => setActiveServer(s.server_name)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-[Inter] font-semibold border transition-colors ${
                activeServer === s.server_name
                  ? "bg-primary-container text-on-primary-container border-primary-container"
                  : "bg-surface-container text-tertiary border-white/10 hover:border-white/30"
              }`}
            >
              {s.server_name}
            </button>
          ))}
        </div>
      )}

      {/* ── Danh sách tập ── */}
      {serverEps.length > 0 && (
        <div>
          <h3 className="text-[16px] font-[Inter] font-semibold text-on-surface mb-3">
            Danh sách tập
          </h3>
          <div className="flex flex-wrap gap-2">
            {serverEps.map((ep) => {
              const epIdx  = allEpisodes.findIndex((e) => e.slug === ep.slug && e.link_embed === ep.link_embed);
              const isActive = epIdx === activeIdx;
              return (
                <button
                  key={ep.slug}
                  onClick={() => setActiveIdx(epIdx)}
                  className={`min-w-[52px] px-3 py-2 rounded-lg text-[14px] font-[Inter] font-semibold border transition-colors ${
                    isActive
                      ? "bg-primary-container text-on-primary-container border-primary-container"
                      : "bg-surface-container text-on-surface border-white/10 hover:bg-surface-container-high hover:border-white/30"
                  }`}
                >
                  {ep.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
