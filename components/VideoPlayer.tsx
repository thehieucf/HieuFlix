"use client";

import { useEffect, useRef, useState } from "react";

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

/** Tạo URL HLS qua proxy để bypass CORS */
function buildHlsUrl(linkEmbed: string): string {
  const directUrl = linkEmbed.replace(/\/?$/, "") + "/master-b2.m3u8";
  return `/api/hls?url=${encodeURIComponent(directUrl)}`;
}

export default function VideoPlayer({
  servers,
  movieTitle,
  initialEpisodeSlug,
}: VideoPlayerProps) {
  // Flatten tất cả tập có link
  const allEpisodes = servers.flatMap((s) =>
    s.server_data
      .filter((ep) => ep.link_embed)
      .map((ep) => ({ ...ep, serverName: s.server_name }))
  );

  const initialIdx = initialEpisodeSlug
    ? Math.max(0, allEpisodes.findIndex((e) => e.slug === initialEpisodeSlug))
    : 0;

  const [activeIdx, setActiveIdx] = useState(initialIdx);
  const [activeServer, setActiveServer] = useState(servers[0]?.server_name ?? "");
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);

  const currentEp = allEpisodes[activeIdx];

  // Load hls.js lazily (không có sẵn ở server)
  useEffect(() => {
    if (!currentEp?.link_embed || !videoRef.current) return;

    const hlsUrl = buildHlsUrl(currentEp.link_embed);
    const video = videoRef.current;

    async function loadHls() {
      const { default: Hls } = await import("hls.js");

      // Dọn instance cũ
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90,
          // --- BẮT ĐẦU: ĐOẠN CODE FIX LỖI NGROK ---
          xhrSetup: function (xhr, url) {
            // Gắn header để báo cho ngrok biết đây là request nội bộ, bỏ qua màn hình cảnh báo
            xhr.setRequestHeader("ngrok-skip-browser-warning", "true");
            xhr.setRequestHeader("Bypass-Tunnel-Reminder", "true");
          },
          // --- KẾT THÚC ---
        });
        
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
        hlsRef.current = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS
        video.src = hlsUrl;
        video.play().catch(() => {});
      }
    }

    loadHls();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentEp]);

  if (allEpisodes.length === 0) {
    return (
      <div className="flex items-center justify-center aspect-video bg-surface-container rounded-xl">
        <p className="text-on-surface-variant font-[Inter]">Chưa có link xem</p>
      </div>
    );
  }

  // Tập theo server đang chọn
  const serverEps =
    servers
      .find((s) => s.server_name === activeServer)
      ?.server_data.filter((ep) => ep.link_embed) ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* ── Video Player ── */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          playsInline
          title={`${movieTitle} - Tập ${currentEp?.name}`}
        />
      </div>

      {/* ── Đang xem ── */}
      <p className="text-[14px] font-[Inter] text-tertiary px-1">
        Đang xem:{" "}
        <span className="text-on-surface font-semibold">
          {movieTitle}{currentEp ? ` — Tập ${currentEp.name}` : ""}
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
              const epIdx = allEpisodes.findIndex((e) => e.slug === ep.slug && e.link_embed === ep.link_embed);
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