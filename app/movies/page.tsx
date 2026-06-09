export const dynamic = "force-dynamic";
import Link from "next/link";
import MovieCard from "@/components/MovieCard";

const VSMOV = "https://vsmov.com";

interface PageProps {
  searchParams: Promise<{ category?: string; type?: string; page?: string }>;
}

function getImageUrl(item: any): string {
  // thumb_url = poster dọc (đúng cho card)
  const url =
    typeof item.thumb_url === "string" && item.thumb_url
      ? item.thumb_url
      : typeof item.poster_url === "string" && item.poster_url
      ? item.poster_url
      : "";
  return url || "https://via.placeholder.com/500x750?text=No+Image";
}

/** Lấy nhãn loại phim để hiển thị ở badge */
function typeLabel(type?: string) {
  if (type === "single") return "Phim Lẻ";
  if (type === "series") return "Phim Bộ";
  return null;
}

async function getMovies(
  category: string | undefined,
  type: string | undefined,
  page: number
) {
  const qs = new URLSearchParams();
  if (category) qs.set("category", category);
  // type=single → phim lẻ (1 tập), type=series → phim bộ (nhiều tập)
  if (type === "single" || type === "series") qs.set("type", type);
  qs.set("page", String(page));

  const url = `${VSMOV}/api/danh-sach?${qs.toString()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Không thể tải danh sách phim");
  return res.json();
}

async function getCategoryName(slug: string): Promise<string> {
  try {
    const res = await fetch(`${VSMOV}/api/the-loai`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return slug;
    const data = await res.json();
    const found = (data.data?.items ?? []).find((g: any) => g.slug === slug);
    return found?.name ?? slug.replace(/-/g, " ");
  } catch {
    return slug.replace(/-/g, " ");
  }
}

export default async function MoviesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.category;
  const type     = params.type;     // "single" | "series" | undefined
  const currentPage = Math.max(1, Number(params.page ?? 1));

  const [data, categoryName] = await Promise.all([
    getMovies(category, type, currentPage),
    category ? getCategoryName(category) : Promise.resolve(null),
  ]);

  const movies: any[] = data.items ?? [];
  const pagination = data.pagination ?? {};
  const totalPages: number = pagination.totalPages ?? 1;
  const totalItems: number = pagination.totalItems ?? 0;

  // Tiêu đề trang
  const pageTitle = categoryName
    ? categoryName
    : type === "single"
    ? "Phim Lẻ"
    : type === "series"
    ? "Phim Bộ"
    : "Phim Mới Cập Nhật";

  function pageUrl(p: number) {
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    if (type) qs.set("type", type);
    qs.set("page", String(p));
    return `/movies?${qs.toString()}`;
  }

  function getPageRange() {
    const delta = 2;
    const left  = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);
    return Array.from({ length: right - left + 1 }, (_, i) => left + i);
  }

  const pageRange = getPageRange();

  return (
    <main className="relative z-20 pt-20 md:pt-24 pb-16 md:pb-24 bg-background min-h-screen">
      <div className="max-w-container-max mx-auto px-4 sm:px-8 md:px-margin-desktop">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 mb-2 text-[13px] md:text-[14px] font-[Inter] text-tertiary flex-wrap">
          <Link href="/" className="hover:text-on-surface transition-colors">Trang chủ</Link>
          {category && (
            <>
              <span>/</span>
              <Link href="/genres" className="hover:text-on-surface transition-colors">Thể loại</Link>
            </>
          )}
          {(type === "single" || type === "series") && !category && (
            <>
              <span>/</span>
            </>
          )}
          <span>/</span>
          <span className="text-on-surface">{pageTitle}</span>
        </div>

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-2 gap-4 flex-wrap">
          <h1 className="text-headline-lg font-headline-lg text-on-surface">
            {pageTitle}
          </h1>
          {/* Badge loại phim */}
          {typeLabel(type) && (
            <span className="px-3 py-1 bg-primary-container/20 text-primary rounded-full text-[13px] font-[Inter] border border-primary-container/30">
              {typeLabel(type)}
            </span>
          )}
        </div>

        <p className="text-[14px] font-[Inter] text-tertiary mb-8">
          {totalItems.toLocaleString("vi-VN")} bộ phim • Trang {currentPage}/{totalPages}
        </p>

        {/* ── Filter nhanh: Phim lẻ / Phim bộ ── */}
        {category && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { label: "Tất cả", value: undefined },
              { label: "Phim lẻ",  value: "single" },
              { label: "Phim bộ",  value: "series" },
            ].map((opt) => {
              const active = type === opt.value || (!type && !opt.value);
              const qs = new URLSearchParams();
              if (category) qs.set("category", category);
              if (opt.value) qs.set("type", opt.value);
              return (
                <Link
                  key={opt.label}
                  href={`/movies?${qs.toString()}`}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-[Inter] font-semibold border transition-colors ${
                    active
                      ? "bg-primary-container text-on-primary-container border-primary-container"
                      : "bg-surface-container text-tertiary border-white/10 hover:border-white/30"
                  }`}
                >
                  {opt.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Grid ── */}
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-card-gap md:gap-gutter">
            {movies.map((movie: any) => {
              // Xác định loại: single=phim lẻ, series/tv=phim bộ
              const isMovie = movie.type === "single" || movie.tmdb?.type === "movie";
              const badge = isMovie ? null : movie.episode_current;

              return (
                <div key={movie._id} className="relative">
                  <MovieCard
                    title={movie.name}
                    meta={`${movie.year ?? "—"}${
                      movie.tmdb?.vote_average && Number(movie.tmdb.vote_average) > 0
                        ? ` • ⭐ ${Number(movie.tmdb.vote_average).toFixed(1)}`
                        : ""
                    }`}
                    posterUrl={getImageUrl(movie)}
                    href={`/movie/${movie.slug}`}
                  />
                  {/* Badge số tập cho phim bộ */}
                  {badge && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-primary-container text-on-primary-container text-[10px] font-[Inter] font-semibold rounded-md leading-tight z-10 pointer-events-none">
                      {badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 64 }}>
              movie_off
            </span>
            <p className="text-on-surface-variant text-[18px] font-[Inter]">
              Không tìm thấy phim nào
            </p>
            <Link
              href="/genres"
              className="mt-2 px-6 py-3 rounded-full bg-primary-container text-on-primary-container text-[14px] font-[Inter] font-semibold hover:bg-inverse-primary transition-colors"
            >
              Quay lại thể loại
            </Link>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14 flex-wrap">
            {currentPage > 1 ? (
              <Link href={pageUrl(currentPage - 1)} className="flex items-center gap-1 px-4 py-2 rounded-full border border-white/20 text-on-surface text-[14px] font-[Inter] hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>Trước
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-4 py-2 rounded-full border border-white/10 text-tertiary text-[14px] font-[Inter] opacity-40 cursor-not-allowed">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>Trước
              </span>
            )}

            {pageRange[0] > 1 && (
              <>
                <Link href={pageUrl(1)} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-on-surface text-[14px] font-[Inter] hover:bg-surface-container transition-colors">1</Link>
                {pageRange[0] > 2 && <span className="w-10 h-10 flex items-center justify-center text-tertiary">...</span>}
              </>
            )}

            {pageRange.map((p) => (
              <Link key={p} href={pageUrl(p)} className={`w-10 h-10 flex items-center justify-center rounded-full text-[14px] font-[Inter] font-semibold transition-colors ${p === currentPage ? "bg-primary-container text-on-primary-container border border-primary-container" : "border border-white/20 text-on-surface hover:bg-surface-container"}`}>
                {p}
              </Link>
            ))}

            {pageRange[pageRange.length - 1] < totalPages && (
              <>
                {pageRange[pageRange.length - 1] < totalPages - 1 && <span className="w-10 h-10 flex items-center justify-center text-tertiary">...</span>}
                <Link href={pageUrl(totalPages)} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-on-surface text-[14px] font-[Inter] hover:bg-surface-container transition-colors">{totalPages}</Link>
              </>
            )}

            {currentPage < totalPages ? (
              <Link href={pageUrl(currentPage + 1)} className="flex items-center gap-1 px-4 py-2 rounded-full border border-white/20 text-on-surface text-[14px] font-[Inter] hover:bg-surface-container transition-colors">
                Sau<span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-4 py-2 rounded-full border border-white/10 text-tertiary text-[14px] font-[Inter] opacity-40 cursor-not-allowed">
                Sau<span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </span>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
