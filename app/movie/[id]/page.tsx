import Link from "next/link";

const VSMOV = "https://vsmov.com";

async function getMovieDetails(slug: string) {
  const res = await fetch(`${VSMOV}/api/phim/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Không thể tải chi tiết phim");
  return res.json();
}

function getImageUrl(movie: any, role: "backdrop" | "poster" = "poster"): string {
  // vsmov đặt tên field NGƯỢC:
  //   thumb_url  → thực ra chứa ảnh POSTER DỌC  (*-poster.jpg)
  //   poster_url → thực ra chứa ảnh BACKDROP NGANG (*-thumb.jpg)
  const posterVertical   = typeof movie.thumb_url  === "string" && movie.thumb_url  ? movie.thumb_url  : "";
  const backdropHoriz    = typeof movie.poster_url === "string" && movie.poster_url ? movie.poster_url : "";

  if (role === "backdrop") {
    return backdropHoriz || posterVertical || "https://via.placeholder.com/1280x720?text=No+Image";
  }
  // role === "poster"
  return posterVertical || backdropHoriz || "https://via.placeholder.com/500x750?text=No+Image";
}

// Dùng slug làm dynamic segment (thư mục vẫn là [id] cho tiện)
export default async function MovieDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const data = await getMovieDetails(slug);
  const movie = data.movie;
  const episodes: any[] = data.episodes ?? [];

  const backdropUrl = getImageUrl(movie, "backdrop");
  const posterUrl   = getImageUrl(movie, "poster");

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* ── Hero Banner ── */}
      <section className="relative w-full pt-20 min-h-[70vh] md:min-h-[80vh] flex items-end">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backdropUrl}
            alt={movie.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full pb-12 flex flex-col md:flex-row gap-8 items-end md:items-start">
          {/* Poster dọc */}
          <div className="hidden md:block w-56 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl self-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={posterUrl} alt={movie.name} className="w-full h-auto block" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface mb-1">
              {movie.name}
            </h1>
            {movie.origin_name && (
              <p className="text-[18px] font-[Inter] text-on-surface-variant italic mb-4">
                {movie.origin_name}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-6">
              {movie.tmdb?.vote_average && Number(movie.tmdb.vote_average) > 0 && (
                <span className="text-primary font-bold text-headline-sm">
                  ⭐ {Number(movie.tmdb.vote_average).toFixed(1)}
                </span>
              )}
              {movie.year && (
                <span className="px-3 py-1 bg-surface-container rounded-full text-tertiary text-caption border border-white/10">
                  {movie.year}
                </span>
              )}
              {movie.quality && (
                <span className="px-3 py-1 bg-surface-container rounded-full text-tertiary text-caption border border-white/10">
                  {movie.quality}
                </span>
              )}
              {movie.lang && (
                <span className="px-3 py-1 bg-surface-container rounded-full text-tertiary text-caption border border-white/10">
                  {movie.lang}
                </span>
              )}
              {movie.episode_current && (
                <span className="px-3 py-1 bg-primary-container/20 rounded-full text-primary text-caption border border-primary-container/30">
                  {movie.episode_current}
                </span>
              )}
              {movie.time && (
                <span className="text-tertiary text-caption">{movie.time}</span>
              )}
            </div>

            {/* Thể loại */}
            {movie.category?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.category.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/movies?category=${cat.slug}`}
                    className="px-3 py-1 bg-surface-container rounded-full text-tertiary text-caption border border-white/10 hover:border-primary-container hover:text-on-surface transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Quốc gia */}
            {movie.country?.length > 0 && (
              <p className="text-caption text-tertiary mb-6">
                Quốc gia:{" "}
                {movie.country.map((c: any) => c.name).join(", ")}
              </p>
            )}

            {/* Nội dung */}
            <div
              className="text-body-lg text-on-surface-variant mb-8 max-w-3xl leading-relaxed prose prose-invert prose-sm"
              dangerouslySetInnerHTML={{
                __html: movie.content || "Đang cập nhật nội dung...",
              }}
            />

            <div className="flex flex-wrap gap-4">
              <Link
                href={`/watch/${slug}`}
                className="flex items-center justify-center gap-2 bg-primary-container text-on-primary-container px-8 py-4 rounded-xl hover:bg-inverse-primary transition-colors font-label-md text-label-md"
              >
                <span className="material-symbols-outlined">play_arrow</span>
                Xem phim
              </Link>
              <button className="flex items-center justify-center gap-2 glass-panel border border-white/20 text-on-surface px-8 py-4 rounded-xl hover:bg-surface-container transition-colors font-label-md text-label-md">
                <span className="material-symbols-outlined">add</span>
                Yêu thích
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
