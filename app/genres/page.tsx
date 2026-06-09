import Link from "next/link";

const VSMOV = "https://vsmov.com";

// Map slug → icon Material Symbols
const GENRE_ICONS: Record<string, string> = {
  "hanh-dong":                    "bolt",
  "phim-hanh-dong":               "bolt",
  "hanh-dong-phieu-luu":          "bolt",
  "action-adventure":             "bolt",
  "kinh-di":                      "skull",
  "phim-kinh-di":                 "skull",
  "khoa-hoc-vien-tuong":          "rocket_launch",
  "phim-khoa-hoc-vien-tuong":     "rocket_launch",
  "sci-fi-fantasy":               "rocket_launch",
  "khoa-hoc-vien-tuong-gia-tuong":"rocket_launch",
  "lang-man":                     "favorite",
  "lang-mang":                    "favorite",
  "phim-lang-man":                "favorite",
  "tinh-yeu-ngot-ngao":           "favorite",
  "phieu-luu":                    "explore",
  "phim-phieu-luu":               "explore",
  "hai":                          "sentiment_very_satisfied",
  "phim-hai":                     "sentiment_very_satisfied",
  "tam-ly":                       "psychology",
  "giat-gan":                     "crisis_alert",
  "phim-gay-can":                 "crisis_alert",
  "hoat-hinh":                    "animation",
  "phim-hoat-hinh":               "animation",
  "lich-su":                      "history_edu",
  "phim-lich-su":                 "history_edu",
  "chien-tranh":                  "military_tech",
  "phim-chien-tranh":             "military_tech",
  "chinh-tri-chien-tranh":        "military_tech",
  "am-nhac":                      "music_note",
  "phim-nhac":                    "music_note",
  "toi-pham":                     "gavel",
  "hinh-su":                      "gavel",
  "phim-hinh-su":                 "gavel",
  "bi-an":                        "search",
  "phim-bi-an":                   "search",
  "gia-dinh":                     "family_restroom",
  "phim-gia-dinh":                "family_restroom",
  "gia-tuong":                    "auto_fix_high",
  "phim-gia-tuong":               "auto_fix_high",
  "phim-gia-tuong":               "auto_fix_high",
  "vien-tuong":                   "auto_fix_high",
  "co-trang":                     "castle",
  "tien-hiep":                    "castle",
  "vo-thuat":                     "sports_martial_arts",
  "vo-hiep":                      "sports_martial_arts",
  "chinh-kich":                   "theater_comedy",
  "phim-chinh-kich":              "theater_comedy",
  "drama":                        "theater_comedy",
  "tai-lieu":                     "videocam",
  "phim-tai-lieu":                "videocam",
  "thieu-nhi":                    "child_care",
  "hoat-hinh":                    "animation",
  "lgbt":                         "diversity_3",
  "sieu-nhien":                   "whatshot",
  "dao-si":                       "auto_fix_high",
  "xa-hoi-den":                   "security",
  "tra-thu":                      "gavel",
  "thanh-xuan":                   "school",
  "hoc-duong":                    "school",
  "tinh-ban":                     "people",
  "hon-nhan":                     "favorite_border",
};

// Map slug → màu fallback
const GENRE_COLORS: Record<string, string> = {
  "hanh-dong":              "#c0392b",
  "phim-hanh-dong":         "#c0392b",
  "action-adventure":       "#c0392b",
  "kinh-di":                "#1a1a2e",
  "phim-kinh-di":           "#1a1a2e",
  "khoa-hoc-vien-tuong":    "#1565c0",
  "sci-fi-fantasy":         "#1565c0",
  "lang-man":               "#e84393",
  "phim-lang-man":          "#e84393",
  "phieu-luu":              "#d35400",
  "hai":                    "#f39c12",
  "phim-hai":               "#f39c12",
  "hoat-hinh":              "#8e44ad",
  "phim-hoat-hinh":         "#8e44ad",
  "chinh-kich":             "#2980b9",
  "drama":                  "#2980b9",
  "toi-pham":               "#2c3e50",
  "hinh-su":                "#2c3e50",
  "am-nhac":                "#e74c3c",
  "lich-su":                "#7f8c8d",
  "chien-tranh":            "#4e342e",
  "co-trang":               "#5d4037",
  "vo-thuat":               "#b71c1c",
  "gia-dinh":               "#27ae60",
  "tai-lieu":               "#16a085",
  "sieu-nhien":             "#6a1b9a",
  "lgbt":                   "#e91e63",
};

interface Genre {
  _id: number;
  name: string;
  slug: string;
}

async function getGenres(): Promise<Genre[]> {
  const res = await fetch(`${VSMOV}/api/the-loai`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Không thể tải thể loại");
  const data = await res.json();
  return data.data?.items ?? [];
}

// Lấy ảnh cover từ phim đầu tiên của thể loại
async function getCover(slug: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${VSMOV}/api/danh-sach?category=${slug}&page=1&limit=1`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const item = data.items?.[0];
    if (!item) return null;
    // thumb_url = poster dọc (dùng cho card), poster_url = backdrop ngang
    return (typeof item.thumb_url === "string" && item.thumb_url)
      ? item.thumb_url
      : (typeof item.poster_url === "string" && item.poster_url)
      ? item.poster_url
      : null;
  } catch {
    return null;
  }
}

export default async function GenresPage() {
  const genres = await getGenres();

  // Lọc bỏ thể loại trùng lặp dựa theo slug, và chỉ giữ thể loại có tên tiếng Việt/thông dụng
  // (bỏ các slug kiểu "tieng-han", "tieng-pho-thong" vì đó là ngôn ngữ, không phải thể loại)
  const skipSlugs = new Set([
    "han-quoc", "hong-kong", "trung-quoc-dai-luc",
    "tieng-han", "tieng-pho-thong", "tieng-quang-dong",
    "news", "talk-show", "chu-de-thuc-te", "chuong-trinh-truyen-hinh",
    "truyen-hinh-thuc-te", "phim-truyen-hinh",
  ]);
  const filtered = genres.filter((g) => !skipSlugs.has(g.slug));

  // Fetch covers song song
  const covers = await Promise.all(filtered.map((g) => getCover(g.slug)));

  return (
    <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-[64px] py-8 md:py-[48px] flex flex-col gap-8 md:gap-12 mt-16 md:mt-20">
      <section className="flex flex-col gap-2">
        <h1 className="text-[28px] sm:text-[40px] md:text-[56px] font-[Montserrat] font-bold leading-tight tracking-tight text-on-surface">
          Thể Loại
        </h1>
        <p className="text-[15px] md:text-[18px] font-[Inter] leading-relaxed text-on-surface-variant">
          Khám phá phim theo thể loại yêu thích của bạn • {filtered.length} thể loại
        </p>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-[24px]">
        {filtered.map((genre, idx) => {
          const icon  = GENRE_ICONS[genre.slug]  ?? "movie";
          const color = GENRE_COLORS[genre.slug] ?? "#1a1a2e";
          const imageUrl = covers[idx];

          return (
            <Link
              key={genre._id}
              href={`/movies?category=${genre.slug}`}
              className="genre-card group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-primary-container transition-colors duration-300"
            >
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={genre.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: color }} />
              )}

              {/* Hover overlay */}
              <div className="genre-overlay absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-background via-background/60 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300">
                <span
                  className="material-symbols-outlined text-primary-container mb-1"
                  style={{ fontSize: "28px" }}
                >
                  {icon}
                </span>
                <h3 className="text-[18px] font-[Montserrat] font-semibold text-on-surface leading-tight">
                  {genre.name}
                </h3>
              </div>

              {/* Default overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-[18px] font-[Montserrat] font-semibold text-on-surface leading-tight">
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
