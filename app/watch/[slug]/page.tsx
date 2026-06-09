import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";

const VSMOV = "https://vsmov.com";

async function getMovieDetails(slug: string) {
  const res = await fetch(`${VSMOV}/api/phim/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Không thể tải phim");
  return res.json();
}

function getImageUrl(movie: any): string {
  // thumb_url = poster dọc, poster_url = backdrop ngang
  const backdrop = typeof movie.poster_url === "string" && movie.poster_url ? movie.poster_url : "";
  const poster   = typeof movie.thumb_url  === "string" && movie.thumb_url  ? movie.thumb_url  : "";
  return backdrop || poster || "";
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ep?: string }>;
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { ep: epSlug } = await searchParams;

  const data = await getMovieDetails(slug);
  const movie = data.movie;
  const episodes: any[] = data.episodes ?? [];

  const backdropUrl = getImageUrl(movie);

  return (
    <main className="min-h-screen bg-background pb-16 pt-16 md:pt-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-[40px]">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 mb-4 text-[13px] md:text-[14px] font-[Inter] text-tertiary flex-wrap">
          <Link href="/" className="hover:text-on-surface transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href={`/movie/${slug}`} className="hover:text-on-surface transition-colors truncate max-w-[150px] md:max-w-[200px]">
            {movie.name}
          </Link>
          <span>/</span>
          <span className="text-on-surface">Xem phim</span>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 md:gap-8">

          {/* ── Cột chính: Player ── */}
          <div className="flex-1 min-w-0">
            <VideoPlayer
              servers={episodes}
              movieTitle={movie.name}
              initialEpisodeSlug={epSlug}
            />
          </div>

          {/* ── Cột phụ: Thông tin phim ── */}
          <aside className="xl:w-80 flex-shrink-0">
            <div className="xl:sticky xl:top-24 flex flex-col gap-4">

              {/* Ảnh + tên */}
              <div className="flex gap-3 items-start">
                {backdropUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={backdropUrl}
                    alt={movie.name}
                    className="w-16 md:w-20 flex-shrink-0 rounded-lg object-cover aspect-[2/3]"
                  />
                )}
                <div className="flex flex-col gap-1 min-w-0">
                  <h1 className="text-[15px] md:text-[18px] font-[Montserrat] font-bold text-on-surface leading-tight">
                    {movie.name}
                  </h1>
                  {movie.origin_name && (
                    <p className="text-[12px] md:text-[13px] font-[Inter] text-tertiary italic truncate">
                      {movie.origin_name}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {movie.year && (
                      <span className="px-2 py-0.5 bg-surface-container rounded-full text-tertiary text-[11px] border border-white/10">
                        {movie.year}
                      </span>
                    )}
                    {movie.quality && (
                      <span className="px-2 py-0.5 bg-surface-container rounded-full text-tertiary text-[11px] border border-white/10">
                        {movie.quality}
                      </span>
                    )}
                    {movie.lang && (
                      <span className="px-2 py-0.5 bg-surface-container rounded-full text-tertiary text-[11px] border border-white/10">
                        {movie.lang}
                      </span>
                    )}
                    {movie.episode_current && (
                      <span className="px-2 py-0.5 bg-primary-container/20 rounded-full text-primary text-[11px] border border-primary-container/30">
                        {movie.episode_current}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Thể loại */}
              {movie.category?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {movie.category.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/movies?category=${cat.slug}`}
                      className="px-2 py-0.5 bg-surface-container rounded-full text-tertiary text-[11px] md:text-[12px] border border-white/10 hover:border-primary-container hover:text-on-surface transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Nội dung — ẩn trên mobile nhỏ */}
              {movie.content && (
                <div
                  className="hidden sm:block text-[13px] font-[Inter] text-on-surface-variant leading-relaxed line-clamp-6"
                  dangerouslySetInnerHTML={{ __html: movie.content }}
                />
              )}

              {/* Link chi tiết */}
              <Link
                href={`/movie/${slug}`}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 text-on-surface text-[13px] md:text-[14px] font-[Inter] hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">info</span>
                Xem chi tiết phim
              </Link>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}
