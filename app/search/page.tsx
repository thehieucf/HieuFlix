import Link from "next/link";
import MovieCard from "@/components/MovieCard";

const VSMOV = "https://vsmov.com";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
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

async function searchMovies(query: string, page: number) {
  const res = await fetch(
    `${VSMOV}/api/tim-kiem?keyword=${encodeURIComponent(query)}&page=${page}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Không thể tìm kiếm");
  return res.json();
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const currentPage = Math.max(1, Number(params.page ?? 1));

  if (!query) {
    return (
      <main className="relative z-20 pt-20 md:pt-24 pb-16 md:pb-24 bg-background min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 72 }}>
            search
          </span>
          <h2 className="text-[24px] font-[Montserrat] font-semibold text-on-surface">
            Tìm kiếm phim
          </h2>
          <p className="text-on-surface-variant font-[Inter] text-[16px] max-w-sm">
            Nhập tên phim vào ô tìm kiếm trên thanh điều hướng để bắt đầu
          </p>
        </div>
      </main>
    );
  }

  const data = await searchMovies(query, currentPage);
  const movies: any[] = data.items ?? [];
  const pagination = data.pagination ?? {};
  const totalPages: number = Math.min(pagination.totalPages ?? 1, 500);
  const totalItems: number = pagination.totalItems ?? 0;

  function pageUrl(p: number) {
    return `/search?q=${encodeURIComponent(query)}&page=${p}`;
  }

  function getPageRange() {
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);
    return Array.from({ length: right - left + 1 }, (_, i) => left + i);
  }

  const pageRange = getPageRange();

  return (
    <main className="relative z-20 pt-20 md:pt-24 pb-16 md:pb-24 bg-background min-h-screen">
      <div className="max-w-container-max mx-auto px-4 sm:px-8 md:px-margin-desktop">

        <div className="mb-8">
          <h1 className="text-headline-lg font-headline-lg text-on-surface mb-1">
            Kết quả cho <span className="text-primary-container">"{query}"</span>
          </h1>
          <p className="text-[14px] font-[Inter] text-tertiary">
            {totalItems > 0
              ? `${totalItems.toLocaleString("vi-VN")} bộ phim`
              : "Không tìm thấy kết quả"}
          </p>
        </div>

        {movies.length > 0 ? (
          <>
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

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14 flex-wrap">
                {currentPage > 1 ? (
                  <Link href={pageUrl(currentPage - 1)} className="flex items-center gap-1 px-4 py-2 rounded-full border border-white/20 text-on-surface text-[14px] font-[Inter] hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>Trước
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 px-4 py-2 rounded-full border border-white/10 text-tertiary opacity-40 cursor-not-allowed text-[14px] font-[Inter]">
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>Trước
                  </span>
                )}

                {pageRange[0] > 1 && (
                  <>
                    <Link href={pageUrl(1)} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-on-surface text-[14px] font-[Inter] hover:bg-surface-container">1</Link>
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
                    <Link href={pageUrl(totalPages)} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-on-surface text-[14px] font-[Inter] hover:bg-surface-container">{totalPages}</Link>
                  </>
                )}

                {currentPage < totalPages ? (
                  <Link href={pageUrl(currentPage + 1)} className="flex items-center gap-1 px-4 py-2 rounded-full border border-white/20 text-on-surface text-[14px] font-[Inter] hover:bg-surface-container transition-colors">
                    Sau<span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 px-4 py-2 rounded-full border border-white/10 text-tertiary opacity-40 cursor-not-allowed text-[14px] font-[Inter]">
                    Sau<span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 64 }}>movie_off</span>
            <p className="text-on-surface text-[20px] font-[Montserrat] font-semibold">Không tìm thấy kết quả</p>
            <p className="text-on-surface-variant font-[Inter] text-[16px] max-w-sm">
              Thử tìm với từ khoá khác hoặc kiểm tra lại chính tả
            </p>
            <Link href="/" className="mt-2 px-6 py-3 rounded-full bg-primary-container text-on-primary-container text-[14px] font-[Inter] font-semibold hover:bg-inverse-primary transition-colors">
              Về trang chủ
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
