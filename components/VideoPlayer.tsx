"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

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
  return `/api/hls?url=${encodeURIComponent(linkEmbed.replace(/\/?$/, "") + "/master-b2.m3u8")}`;
}

function fmt(s: number): string {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
    : `${m}:${String(sec).padStart(2,"0")}`;
}

export default function VideoPlayer({ servers, movieTitle, initialEpisodeSlug }: VideoPlayerProps) {
  // useMemo để allEps không tạo mới mỗi render → tránh useEffect chạy lại không cần thiết
  const allEps = useMemo(() =>
    servers.flatMap((s) =>
      s.server_data.filter((e) => e.link_embed).map((e) => ({ ...e, serverName: s.server_name }))
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // servers prop không thay đổi sau khi mount
  );

  const initIdx = initialEpisodeSlug
    ? Math.max(0, allEps.findIndex((e) => e.slug === initialEpisodeSlug))
    : 0;

  const [activeIdx,    setActiveIdx]    = useState(initIdx);
  const [activeServer, setActiveServer] = useState(servers[0]?.server_name ?? "");
  const [playing,      setPlaying]      = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [buffered,     setBuffered]     = useState(0);
  const [muted,        setMuted]        = useState(false);
  const [volume,       setVolume]       = useState(1);
  const [showCtrl,     setShowCtrl]     = useState(true);
  const [seekAnim,     setSeekAnim]     = useState<"back"|"fwd"|null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef     = useRef<HTMLVideoElement>(null);
  const hlsRef       = useRef<any>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const hideRef      = useRef<ReturnType<typeof setTimeout>|null>(null);
  const animRef      = useRef<ReturnType<typeof setTimeout>|null>(null);

  const currentEp   = allEps[activeIdx];
  const currentLink = currentEp?.link_embed ?? null;

  // ── Load HLS ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentLink || !videoRef.current) return;
    const video = videoRef.current;
    const url   = buildHlsUrl(currentLink);

    (async () => {
      const { default: Hls } = await import("hls.js");
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

      const play = () => video.play().catch(() => {});

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          backBufferLength: 60,
          manifestLoadingMaxRetry: 2,
          levelLoadingMaxRetry: 2,
          fragLoadingMaxRetry: 3,
          xhrSetup: (xhr: XMLHttpRequest) => {
            xhr.setRequestHeader("ngrok-skip-browser-warning", "true");
            xhr.setRequestHeader("Bypass-Tunnel-Reminder", "true");
          },
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.once(Hls.Events.MANIFEST_PARSED, play);
        hlsRef.current = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        video.addEventListener("loadedmetadata", play, { once: true });
      }
    })();

    return () => {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    };
  }, [currentLink]); // chỉ re-load khi link_embed thực sự thay đổi

  // ── Video events ───────────────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay  = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onDur   = () => setDuration(v.duration);
    const onTime  = () => {
      setCurrentTime(v.currentTime);
      if (v.buffered.length > 0 && v.duration > 0)
        setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    };
    const onVol = () => { setMuted(v.muted); setVolume(v.volume); };
    v.addEventListener("play",           onPlay);
    v.addEventListener("pause",          onPause);
    v.addEventListener("durationchange", onDur);
    v.addEventListener("timeupdate",     onTime);
    v.addEventListener("volumechange",   onVol);
    return () => {
      v.removeEventListener("play",           onPlay);
      v.removeEventListener("pause",          onPause);
      v.removeEventListener("durationchange", onDur);
      v.removeEventListener("timeupdate",     onTime);
      v.removeEventListener("volumechange",   onVol);
    };
  }, []);

  // ── Fullscreen change ──────────────────────────────────────────────────────
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // ── Auto-hide controls ─────────────────────────────────────────────────────
  const bumpControls = useCallback(() => {
    setShowCtrl(true);
    if (hideRef.current) clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowCtrl(false);
    }, 3000);
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  }, []);

  const seek = useCallback((delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
    if (animRef.current) clearTimeout(animRef.current);
    setSeekAnim(delta < 0 ? "back" : "fwd");
    animRef.current = setTimeout(() => setSeekAnim(null), 700);
    bumpControls();
  }, [bumpControls]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  }, [duration]);

  const handleVolumeChange = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const val  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.volume = val;
    v.muted  = val === 0;
  }, []);

  const toggleMute       = useCallback(() => { const v = videoRef.current; if (v) v.muted = !v.muted; }, []);
  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
  }, []);

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Chỉ xử lý khi focus vào player hoặc không có input nào đang focus
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (!wrapRef.current) return;
      switch (e.key) {
        case " ": case "k": e.preventDefault(); togglePlay();  break;
        case "ArrowLeft":   e.preventDefault(); seek(-10);     break;
        case "ArrowRight":  e.preventDefault(); seek(10);      break;
        case "ArrowUp":     e.preventDefault(); { const v = videoRef.current; if (v) { v.volume = Math.min(1, v.volume + 0.1); v.muted = false; } break; }
        case "ArrowDown":   e.preventDefault(); { const v = videoRef.current; if (v) v.volume = Math.max(0, v.volume - 0.1); break; }
        case "m": case "M": toggleMute(); break;
        case "f": case "F": toggleFullscreen(); break;
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [togglePlay, seek, toggleMute, toggleFullscreen]);

  if (allEps.length === 0) {
    return (
      <div className="flex items-center justify-center aspect-video bg-surface-container rounded-xl">
        <p className="text-on-surface-variant font-[Inter]">Chưa có link xem</p>
      </div>
    );
  }

  const serverEps = servers.find((s) => s.server_name === activeServer)
    ?.server_data.filter((ep) => ep.link_embed) ?? [];
  const progress  = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Player ── */}
      <div
        ref={wrapRef}
        className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl cursor-pointer"
        onMouseMove={bumpControls}
        onMouseLeave={() => { if (!videoRef.current?.paused) setShowCtrl(false); }}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          className="w-full h-full"
          playsInline
        />

        {/* Seek feedback */}
        {seekAnim && (
          <div className={`absolute inset-y-0 w-1/3 flex items-center justify-center pointer-events-none
            ${seekAnim === "back" ? "left-0" : "right-0"}`}
          >
            <div className="bg-black/60 rounded-full p-3 flex flex-col items-center">
              <span className="material-symbols-outlined text-white text-[32px]">
                {seekAnim === "back" ? "replay_10" : "forward_10"}
              </span>
              <span className="text-white text-[12px] font-semibold">
                {seekAnim === "back" ? "-10s" : "+10s"}
              </span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div
          className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${showCtrl ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

          <div className="relative z-10 px-3 pb-2 flex flex-col gap-1.5">
            {/* Progress */}
            <div
              className="w-full h-2 bg-white/20 rounded-full cursor-pointer relative hover:h-3 transition-all"
              onClick={handleProgressClick}
            >
              <div className="absolute inset-y-0 left-0 bg-white/30 rounded-full" style={{ width: `${buffered}%` }} />
              <div className="absolute inset-y-0 left-0 bg-primary-container rounded-full" style={{ width: `${progress}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md" />
              </div>
            </div>

            {/* Button row */}
            <div className="flex items-center gap-2 text-white">
              {/* Play/Pause */}
              <button onClick={togglePlay} aria-label={playing ? "Dừng" : "Phát"} className="hover:text-primary-container transition-colors">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                  {playing ? "pause" : "play_arrow"}
                </span>
              </button>

              {/* Tua lùi */}
              <button onClick={() => seek(-10)} aria-label="Tua lùi 10s" className="hover:text-primary-container transition-colors">
                <span className="material-symbols-outlined text-[22px]">replay_10</span>
              </button>

              {/* Tua tới */}
              <button onClick={() => seek(10)} aria-label="Tua tới 10s" className="hover:text-primary-container transition-colors">
                <span className="material-symbols-outlined text-[22px]">forward_10</span>
              </button>

              {/* Time */}
              <span className="text-[12px] font-[Inter] tabular-nums text-white/90 select-none">
                {fmt(currentTime)} / {fmt(duration)}
              </span>

              <div className="flex-1" />

              {/* Volume */}
              <div className="flex items-center gap-1 group/vol">
                <button onClick={toggleMute} aria-label={muted ? "Bật âm" : "Tắt âm"} className="hover:text-primary-container transition-colors">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                    {muted || volume === 0 ? "volume_off" : volume < 0.5 ? "volume_down" : "volume_up"}
                  </span>
                </button>
                <div
                  className="w-0 group-hover/vol:w-16 overflow-hidden transition-all duration-200 cursor-pointer"
                  onClick={handleVolumeChange}
                >
                  <div className="w-16 h-1.5 bg-white/30 rounded-full">
                    <div className="h-full bg-white rounded-full" style={{ width: `${muted ? 0 : volume * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} aria-label="Toàn màn hình" className="hover:text-primary-container transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  {isFullscreen ? "fullscreen_exit" : "fullscreen"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <p className="text-[13px] font-[Inter] text-tertiary px-1">
        Đang xem: <span className="text-on-surface font-semibold">{movieTitle}{currentEp ? ` — Tập ${currentEp.name}` : ""}</span>
        <span className="ml-2 opacity-50">Space/K=Phát, ←→=±10s, ↑↓=Âm lượng, M=Mute, F=Full</span>
      </p>

      {/* Server tabs */}
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

      {/* Episode list */}
      {serverEps.length > 0 && (
        <div>
          <h3 className="text-[16px] font-[Inter] font-semibold text-on-surface mb-3">Danh sách tập</h3>
          <div className="flex flex-wrap gap-2">
            {serverEps.map((ep) => {
              const idx = allEps.findIndex((e) => e.slug === ep.slug && e.link_embed === ep.link_embed);
              return (
                <button
                  key={ep.slug}
                  onClick={() => setActiveIdx(idx)}
                  className={`min-w-[52px] px-3 py-2 rounded-lg text-[14px] font-[Inter] font-semibold border transition-colors ${
                    idx === activeIdx
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
