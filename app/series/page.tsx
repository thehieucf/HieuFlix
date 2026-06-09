import MovieCard from "@/components/MovieCard";

const VSMOV = "https://vsmov.com";

function getImageUrl(item: any): string {
  const url =
    typeof item.thumb_url === "string" && item.thumb_url
      ? item.thumb_url
      : typeof item.poster_url === "string" && item.poster_url
      ? item.poster_url
      : "";
  return url || "https://via.placeholder.com/500x750?text=No+Image";
}

async function getSeriesList(page = 1) {
  const res = await fetch(
    `${VSMOV}/api/danh-sach?type=series&page=${page}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error("Không thể tải phim bộ");
  return res.json();
}

export default async function SeriesPage() {
  const data = await getSeriesList(1);
  const series: any[] = data.items ?? [];

  return (
    <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-[64px] py-8 md:py-[48px] flex flex-col gap-8 md:gap-12 mt-16 md:mt-20">
      {/* Header */}
      <section className="flex flex-col gap-2">
        <h1 className="text-[28px] sm:text-[40px] md:text-[56px] font-[Montserrat] font-bold leading-tight tracking-tight text-on-surface">
          Phim Bộ
        </h1>
        <p className="text-[15px] md:text-[18px] font-[Inter] text-on-surface-variant">
          {data.pagination?.totalItems?.toLocaleString("vi-VN") ?? ""} bộ phim đang có
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-[24px]">
        {series.map((show: any) => (
          <MovieCard
            key={show._id}
            title={show.name}
            meta={`${show.year ?? "—"}${
              show.tmdb?.vote_average && Number(show.tmdb.vote_average) > 0
                ? ` • ⭐ ${Number(show.tmdb.vote_average).toFixed(1)}`
                : ""
            }`}
            posterUrl={getImageUrl(show)}
            href={`/movie/${show.slug}`}
          />
        ))}
      </section>
    </main>
  );
}
