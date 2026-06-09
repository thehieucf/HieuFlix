import { NextRequest, NextResponse } from "next/server";

/**
 * HLS Proxy — bypass CORS từ streamvsmov.com
 * Sử dụng: /api/hls?url=https://s1.streamvsmov.com/video/.../master-b2.m3u8
 *
 * - Với .m3u8: rewrite các URL segment thành /api/hls?url=... để tiếp tục proxy
 * - Với .png (segment giả): trả về binary thẳng với Content-Type video/MP2T
 */

const ALLOWED_HOSTS = [
  "streamvsmov.com",
  "streamvsphim.com",
  "p24.streamvsmov.com",
];

function isAllowed(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const targetUrl = req.nextUrl.searchParams.get("url");

  if (!targetUrl || !isAllowed(targetUrl)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://vsmov.com/",
        Origin: "https://vsmov.com",
      },
      // Manifest không cache để luôn fresh, segment cache ở upstream
      cache: "no-store",
    });

    if (!upstream.ok) {
      return new NextResponse(`Upstream error: ${upstream.status}`, {
        status: upstream.status,
      });
    }

    const contentType = upstream.headers.get("content-type") ?? "";

    // ── M3U8 manifest: rewrite URLs ──────────────────────────────────────────
    if (
      targetUrl.includes(".m3u8") ||
      contentType.includes("mpegurl") ||
      contentType.includes("x-mpegurl")
    ) {
      const text = await upstream.text();
      const base = new URL(targetUrl);

      const rewritten = text
        .split("\n")
        .map((line) => {
          const trimmed = line.trim();
          // Sửa dòng trống hoặc comment thì giữ nguyên
          if (!trimmed || trimmed.startsWith("#")) return line;

          // Resolve relative hoặc absolute URL về dạng tuyệt đối
          let absUrl: string;
          try {
            absUrl = new URL(trimmed, base).toString();
          } catch {
            return line;
          }

          // Chỉ proxy các host được cho phép
          if (!isAllowed(absUrl)) return line;

          return `/api/hls?url=${encodeURIComponent(absUrl)}`;
        })
        .join("\n");

      return new NextResponse(rewritten, {
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*",
          // Manifest VOD không đổi — cache 5 phút ở browser để giảm re-fetch
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    // ── Video segment (.png giả hoặc binary) ─────────────────────────────────
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "video/MP2T",
        "Access-Control-Allow-Origin": "*",
        // Segment VOD bất biến — cache 1 giờ ở browser
        "Cache-Control": "public, max-age=3600, immutable",
      },
    });
  } catch (err) {
    console.error("[HLS proxy error]", err);
    return new NextResponse("Proxy error", { status: 502 });
  }
}
