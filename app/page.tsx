export const dynamic = "force-dynamic";
import Link from "next/link";
import MovieCard from "@/components/MovieCard";

const VSMOV = "https://vsmov.com";

const fetchOpts = (revalidate = 3600) => ({
  next: { revalidate },
});

// Lấy phim mới cập nhật (dùng cho Hero + row trending)
async function getNewMovies(page = 1) {
  const res = await fetch(
    `${VSMOV}/api/danh-sach/phim-moi-cap-nhat?page=${page}`,
    fetchOpts()
  );
  if (!res.ok) throw new Error("Không thể tải phim mới");
  return res.json();
}

// Lấy phim bộ mới nhất
async function getNewSeries(page = 1) {
  const res = await fetch(
    `${VSMOV}/api/danh-sach?type=series&page=${page}`,
    fetchOpts()
  );
  if (!res.ok) throw new Error("Không thể tải phim bộ");
  return res.json();
}

/** Lấy URL ảnh an toàn — poster_url đôi khi là {} rỗng
 * vsmov đặt tên NGƯỢC: thumb_url = poster dọc, poster_url = backdrop ngang
 */
function getImageUrl(item: any, role: "backdrop" | "poster" = "poster"): string {
  const posterVertical = typeof item.thumb_url  === "string" && item.thumb_url  ? item.thumb_url  : "";
  const backdropHoriz  = typeof item.poster_url === "string" && item.poster_url ? item.poster_url : "";
  if (role === "backdrop") return backdropHoriz || posterVertical || "https://via.placeholder.com/1280x720?text=No+Image";
  return posterVertical || backdropHoriz || "https://via.placeholder.com/500x750?text=No+Image";
}

export default async function HomePage() {
  const [newData, seriesData] = await Promise.all([
    getNewMovies(1),
    getNewSeries(1),
  ]);

  const allNew: any[] = newData.items ?? [];
  const hero = allNew[0];
  const trending = allNew.slice(1, 11);
  const series: any[] = (seriesData.items ?? []).slice(0, 10);

  const heroBackdrop = getImageUrl(hero, "backdrop");

  return (
    <>
      {/* ── Hero Section ── */}
      {hero && (
        <section className="relative w-full h-[870px] md:h-[921px] flex items-center">
          <div className="absolute inset-0 w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroBackdrop}
              alt={hero.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 hero-gradient" />
          </div>

          <div className="relative z-10 px-[20px] md:px-[64px] w-full max-w-[1440px] mx-auto mt-20 md:mt-0">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-surface-container rounded-full text-tertiary text-[12px] font-[Inter] border border-white/10">
                  {hero.year}
                </span>
                {hero.tmdb?.vote_average && Number(hero.tmdb.vote_average) > 0 && (
                  <span className="px-3 py-1 bg-surface-container rounded-full text-tertiary text-[12px] font-[Inter] border border-white/10">
                    ⭐ {Number(hero.tmdb.vote_average).toFixed(1)}
                  </span>
                )}
              </div>

              <h1 className="text-[40px] md:text-[64px] font-[Montserrat] font-bold leading-tight tracking-tight text-on-surface mb-6">
                {hero.name}
              </h1>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/movie/${hero.slug}`}
                  className="flex items-center justify-center gap-2 bg-primary-container text-on-primary-container px-8 py-4 rounded-xl hover:bg-inverse-primary transition-colors text-[14px] font-[Inter] font-semibold tracking-wider"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    play_arrow
                  </span>
                  Xem ngay
                </Link>
                <button className="flex items-center justify-center gap-2 glass-panel border border-white/20 text-on-surface px-8 py-4 rounded-xl hover:bg-surface-container transition-colors text-[14px] font-[Inter] font-semibold tracking-wider">
                  <span className="material-symbols-outlined">add</span>
                  Yêu thích
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Content Rows ── */}
      <main className="relative z-20 pb-24 -mt-16 bg-background">

        {/* Phim Mới Cập Nhật */}
        <section className="mb-[48px] px-[20px] md:px-[64px] max-w-[1440px] mx-auto overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[24px] font-[Montserrat] font-semibold text-on-surface">
              Phim Mới Cập Nhật
            </h2>
            <Link
              href="/movies"
              className="text-[14px] font-[Inter] text-tertiary hover:text-on-surface transition-colors"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-[16px] pb-4 -mx-[20px] px-[20px] md:mx-0 md:px-0">
            {trending.map((movie: any) => (
              <Link
                key={movie._id}
                href={`/movie/${movie.slug}`}
                className="group relative flex-none w-[160px] md:w-[220px] aspect-[2/3] rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 border border-white/10 hover:border-primary-container"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(movie)}
                  alt={movie.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-[14px] font-[Inter] font-semibold text-on-surface mb-1 truncate">
                    {movie.name}
                  </h3>
                  <p className="text-[12px] font-[Inter] text-tertiary">
                    {movie.year}
                    {movie.tmdb?.vote_average && Number(movie.tmdb.vote_average) > 0
                      ? ` • ⭐ ${Number(movie.tmdb.vote_average).toFixed(1)}`
                      : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Phim Bộ Nổi Bật */}
        <section className="mb-[48px] px-[20px] md:px-[64px] max-w-[1440px] mx-auto overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[24px] font-[Montserrat] font-semibold text-on-surface">
              Phim Bộ Nổi Bật
            </h2>
            <Link
              href="/series"
              className="text-[14px] font-[Inter] text-tertiary hover:text-on-surface transition-colors"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-[16px] pb-4 -mx-[20px] px-[20px] md:mx-0 md:px-0">
            {series.map((show: any) => (
              <Link
                key={show._id}
                href={`/movie/${show.slug}`}
                className="group relative flex-none w-[160px] md:w-[220px] aspect-[2/3] rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 border border-white/10 hover:border-primary-container"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(show)}
                  alt={show.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-[14px] font-[Inter] font-semibold text-on-surface mb-1 truncate">
                    {show.name}
                  </h3>
                  <p className="text-[12px] font-[Inter] text-tertiary">
                    {show.year}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </>
  );
}
