import Link from "next/link";
import MovieCard from "@/components/MovieCard";

const VSMOV = "https://vsmov.com";

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

function getImageUrl(item: any): string {
  const url =
    typeof item.thumb_url === "string" && item.thumb_url
      ? item.thumb_url
      : typeof item.poster_url === "string" && item.poster_url
      ? item.poster_url
      : "";
  return url || "https://via.placeholder.com/500x750?text=No+Image";
}

async function getMovies(category: string | undefined, page: number) {
  let url: string;
  if (category) {
    url = `${VSMOV}/api/danh-sach?category=${encodeURIComponent(category)}&page=${page}`;
  } else {
    url = `${VSMOV}/api/danh-sach/phim-moi-cap-nhat?page=${page}`;
  }
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Không thể tải danh sách phim");
  return res.json();
}

export default async function MoviesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.category;
  const currentPage = Math.max(1, Number(params.page ?? 1));

  const data = await getMovies(category, currentPage);
  const movies: any[] = data.items ?? [];
  const pagination = data.pagination ?? {};
  const totalPages: number = pagination.totalPages ?? 1;
  const totalItems: number = pagination.totalItems ?? 0;

  function pageUrl(p: number) {
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    qs.set("page", String(p));
    return `/movies?${qs.toString()}`;
  }

  function getPageRange() {
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);
    return Array.from({ length: right - left + 1 }, (_, i) => left + i);
  }

  const pageRange = getPageRange();

  return (
    <main className="relative z-20 pt-24 pb-24 bg-background min-h-screen">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-2">
          {category && (
            <>
              <Link
                href="/genres"
                className="text-tertiary hover:text-on-surface transition-colors text-[14px] font-[Inter] flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Thể loại
              </Link>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface text-[14px] font-[Inter] capitalize">
                {category.replace(/-/g, " ")}
              </span>
            </>
          )}
        </div>

        <h1 className="text-headline-lg font-headline-lg text-on-surface mb-1">
          {category
            ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            : "Phim Mới Cập Nhật"}
        </h1>
        <p className="text-[14px] font-[Inter] text-tertiary mb-8">
          {totalItems.toLocaleString("vi-VN")} bộ phim • Trang {currentPage}/{totalPages}
        </p>

        {/* ── Grid ── */}
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-card-gap md:gap-gutter">
            {movies.map((movie: any) => (
              <MovieCard
                key={movie._id}
                title={movie.name}
                meta={`${movie.year ?? "—"}${
                  movie.tmdb?.vote_average && Number(movie.tmdb.vote_average) > 0
                    ? ` • ⭐ ${Number(movie.tmdb.vote_average).toFixed(1)}`
                    : ""
                }`}
                posterUrl={getImageUrl(movie)}
                href={`/movie/${movie.slug}`}
              />
            ))}
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
