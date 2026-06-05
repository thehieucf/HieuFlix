import Link from "next/link";

const VSMOV = "https://vsmov.com";

// Danh sách thể loại tĩnh từ vsmov (slug dùng cho ?category=)
const GENRES = [
  { slug: "hanh-dong",            name: "Hành Động",              icon: "bolt",                     color: "#c0392b" },
  { slug: "kinh-di",              name: "Kinh Dị",                icon: "skull",                    color: "#1a1a2e" },
  { slug: "khoa-hoc-vien-tuong",  name: "Khoa Học Viễn Tưởng",   icon: "rocket_launch",            color: "#1565c0" },
  { slug: "tinh-cam",             name: "Tình Cảm",               icon: "favorite",                 color: "#e84393" },
  { slug: "phieu-luu",            name: "Phiêu Lưu",              icon: "explore",                  color: "#d35400" },
  { slug: "hai-huoc",             name: "Hài Hước",               icon: "sentiment_very_satisfied", color: "#f39c12" },
  { slug: "tam-ly",               name: "Tâm Lý",                 icon: "psychology",               color: "#6a1b9a" },
  { slug: "vo-thuat",             name: "Võ Thuật",               icon: "sports_martial_arts",      color: "#b71c1c" },
  { slug: "chien-tranh",          name: "Chiến Tranh",            icon: "military_tech",            color: "#4e342e" },
  { slug: "lich-su",              name: "Lịch Sử",                icon: "history_edu",              color: "#7f8c8d" },
  { slug: "hoat-hinh",            name: "Hoạt Hình",              icon: "animation",                color: "#8e44ad" },
  { slug: "am-nhac",              name: "Âm Nhạc",                icon: "music_note",               color: "#e74c3c" },
  { slug: "the-thao",             name: "Thể Thao",               icon: "sports_soccer",            color: "#1b5e20" },
  { slug: "tai-lieu",             name: "Tài Liệu",               icon: "videocam",                 color: "#16a085" },
  { slug: "bi-an",                name: "Bí Ẩn",                  icon: "search",                   color: "#2c3e50" },
  { slug: "co-trang",             name: "Cổ Trang",               icon: "castle",                   color: "#5d4037" },
  { slug: "than-thoai",           name: "Thần Thoại",             icon: "auto_fix_high",            color: "#6c3483" },
  { slug: "gia-dinh",             name: "Gia Đình",               icon: "family_restroom",          color: "#27ae60" },
];

// Lấy ảnh cover từ phim đầu tiên trong thể loại đó
async function getCoverForGenre(slug: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${VSMOV}/api/danh-sach?category=${slug}&page=1&limit=1`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const item = data.items?.[0];
    if (!item) return null;
    if (typeof item.thumb_url === "string" && item.thumb_url) return item.thumb_url;
    if (typeof item.poster_url === "string" && item.poster_url) return item.poster_url;
    return null;
  } catch {
    return null;
  }
}

export default async function GenresPage() {
  // Fetch ảnh cover tất cả thể loại song song
  const covers = await Promise.all(
    GENRES.map((g) => getCoverForGenre(g.slug))
  );

  return (
    <main className="w-full max-w-[1440px] mx-auto px-[20px] md:px-[64px] py-[48px] flex flex-col gap-12 mt-20">
      {/* Header */}
      <section className="flex flex-col gap-3">
        <h1 className="text-[40px] md:text-[64px] font-[Montserrat] font-bold leading-tight tracking-tight text-on-surface">
          Thể Loại
        </h1>
        <p className="text-[18px] font-[Inter] leading-relaxed text-on-surface-variant">
          Khám phá phim theo thể loại yêu thích của bạn
        </p>
      </section>

      {/* Genre Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[16px] md:gap-[24px]">
        {GENRES.map((genre, idx) => {
          const imageUrl = covers[idx];

          return (
            <Link
              key={genre.slug}
              href={`/movies?category=${genre.slug}`}
              className="genre-card group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-primary-container transition-colors duration-300"
            >
              {/* Ảnh nền */}
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={genre.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: genre.color }}
                />
              )}

              {/* Hover overlay */}
              <div className="genre-overlay absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-background via-background/60 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300">
                <span
                  className="material-symbols-outlined text-primary-container mb-1"
                  style={{ fontSize: "28px" }}
                >
                  {genre.icon}
                </span>
                <h3 className="text-[20px] font-[Montserrat] font-semibold text-on-surface">
                  {genre.name}
                </h3>
              </div>

              {/* Default overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-[20px] font-[Montserrat] font-semibold text-on-surface">
                  {genre.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
