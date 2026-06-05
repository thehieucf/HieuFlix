import Link from "next/link";
import dynamic from "next/dynamic";

const MovieDescription = dynamic(() => import("@/components/MovieDescription"), {
  ssr: false,
  loading: () => (
    <div className="text-[16px] font-[Inter] text-on-surface-variant leading-relaxed max-w-3xl line-clamp-5" />
  ),
});

const VSMOV = "https://vsmov.com";

async function getMovieDetails(slug: string) {
  const res = await fetch(`${VSMOV}/api/phim/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Không thể tải chi tiết phim");
  return res.json();
}

function getImageUrl(movie: any, role: "backdrop" | "poster" = "poster"): string {
  const posterVertical = typeof movie.thumb_url  === "string" && movie.thumb_url  ? movie.thumb_url  : "";
  const backdropHoriz  = typeof movie.poster_url === "string" && movie.poster_url ? movie.poster_url : "";
  if (role === "backdrop") return backdropHoriz || posterVertical || "https://via.placeholder.com/1280x720?text=No+Image";
  return posterVertical || backdropHoriz || "https://via.placeholder.com/500x750?text=No+Image";
}

export default async function MovieDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const data = await getMovieDetails(slug);
  const movie = data.movie;

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

        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full pb-12 flex flex-col md:flex-row gap-8 items-start">
          {/* Poster dọc */}
          <div className="hidden md:block w-56 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl mt-4">
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

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
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
              <div className="flex flex-wrap gap-2 mb-3">
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
              <p className="text-caption text-tertiary mb-5">
                Quốc gia: {movie.country.map((c: any) => c.name).join(", ")}
              </p>
            )}

            {/* ── Nút hành động — ĐỂ TRÊN mô tả ── */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Link
                href={`/watch/${slug}`}
                className="flex items-center justify-center gap-2 bg-primary-container text-on-primary-container px-8 py-4 rounded-xl hover:bg-inverse-primary transition-colors font-label-md text-label-md"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                  play_arrow
                </span>
                Xem phim
              </Link>
              <button className="flex items-center justify-center gap-2 glass-panel border border-white/20 text-on-surface px-8 py-4 rounded-xl hover:bg-surface-container transition-colors font-label-md text-label-md">
                <span className="material-symbols-outlined">add</span>
                Yêu thích
              </button>
            </div>

            {/* ── Mô tả — có collapse nếu dài ── */}
            {movie.content && (
              <MovieDescription html={movie.content} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
