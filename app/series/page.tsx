import MovieCard from "@/components/MovieCard";
import FilterBar from "@/components/FilterBar";

const series = [
  {
    id: 1,
    title: "Chân Trời Cuối Cùng",
    meta: "2024 • Khoa học viễn tưởng • 2g 15ph",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_-eVGqTmk2VIOfsTauM1NnhmQktbYnkUel1c_7HTEXaMflmz8EKuyPIVywWxpKvu_jS0EyfTxrWtRER13Is1L1I5ip1hptqsRfWy9YE7UmzyitzNbsLwjPmI0Tz3tcy2X-ntwqcJQCXlIWo0qG3xB5eoXdlA6j982OPdWaY7QI00xV65wttddBqTKZo0-NX8FrE4Z68HcbxQrVKnUkJYJNFhGM3QkL7l42pwgp4xUKViEIZI8FgAYO6LvPgjzwAZpD87OHzbHzcyM",
  },
  {
    id: 2,
    title: "Đêm Neon",
    meta: "2023 • Tâm lý • 1g 58ph",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmpdXUq7Ol1n-sLOyVSHGVElgu6e7Rs1ooicst3dRLPJ5xjN2OrEAR8CkuD9bUr1tyHSoRxqgF0BVzoVWzOGGhFqdEpeaYCjY4OiR4HIJPMYSNDd9qrZIX7biw2G8TbHcdxzA9gWNkuqRrCY26wvFQINMc2FBnCv8xGMG_L-saqdQ92NY_uTbgMirNBJ_F5MpgSvp_LkO1uVR9KtVq5FMQWvk2kYmxCtQw5N4XAnaPH8_xxc3moZfyrTVCw31sJRuY53RkjSSB-WLU",
  },
  {
    id: 3,
    title: "Vang Vọng Thời Gian",
    meta: "2024 • Tình cảm • 2g 30ph",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDV1hDas0sZY6JH2Zs11-TDRu6lqme84MMtlCXZkfLf1INbvJrI4YpH2MfkM_bnnk3tk3bLQ9DoVfi-oDvYXUn85NfOUJQd0HYVPYGVYfcQOU9YNpzAyC84W-rVC4U6_ICoDng5Wt9nkJny0M7x-Opkyy9QG1t4WpJEbJ1BfkBf8F2z-C_5dpmF9rXTGFoVaiTUiEnTSXPCx-zQUhUuP0nRaQ8fhValFhjNw6zcuOcdx8nWU2PO38WpSsVBKKBUXJZAGRh2X91GMoPN",
  },
  {
    id: 4,
    title: "Rừng Thì Thầm",
    meta: "2022 • Kinh dị • 1g 45ph",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDNJmi8SoIaUiT43rbQ5a9-txiMUCOZ3iNAr9yZmfr6BjX9vx8mLEng_z4rykEeHVMsuXyJdzJLRLr7SQVv8kwBFqiHSXQJ_H81dD4jLXpvvXMLpI4AzRrl8lPtl5CDVJ1oGpDFwRUIdadT5sFi7sxgRG4oplRi-tfUm88G-kQWC3LXESfIGxSZfSfs8DYEEK_m88PGsnAgWud0hvKGHIralln0_Igfz-Sl7FtFAj4eKjBU7EPnG6FxLe7pAafbiITmt-LukUB9UW1q",
  },
  {
    id: 5,
    title: "Tốc Độ",
    meta: "2024 • Hành động • 2g 05ph",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDt6YaFokCGhf-dcSkllPlXfViQl56eNBgLREMPGcki1edEGA4MMGVahSNkuK52Pbn5dyYhevE5EvD8ZMApWzWqNT65gsY-Dk2Sp40bspl5UNO_WbX-wuGwUezwXOEIRXUFBlLUW4wn8wHEvvBYV9GQnNarvC17mj-6Ed3YBiXiJkM7-QDasu97sy3039nYLywS7pQreFfdixFjNnGMoxB9qR-IsVupWZmzhug_dHhYfsT_Z5-5dcM_s5aku7SMTAvcVjUQOgNZ5iPy",
  },
  {
    id: 6,
    title: "Vùng Nước Sâu",
    meta: "2023 • Chính kịch • 1g 50ph",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_CUo_h7bCCR2KBrmhEzK707qth68Kz-dKctTGaVKPT5U3ch5gqP_5fNbDfM8ZnyjuXrKDac_bD0rCyNKeRh-iOGa3MsLkzm3-dxT0BTeGaGzMFa8_y7neGzgUCF8LKTdoaJX7rG6SwLks0gxe4o300NEgx8X11fb04L4MZpeCcHhMVIE7gX4yamo48ol0B1mXkeIausFBVkb0InPY-gKOg1aVoy0TmbbL4tkaNtszEvGzX3zBzEoZ7Q7AXtj20Dxr-bRWtl0HOX-z",
  },
  {
    id: 7,
    title: "Ares Một",
    meta: "2025 • Khoa học viễn tưởng • 2g 20ph",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDz9xzAk6UcxL698JFrg0Ry78fCC7UC1imJY8UCE1x80-FsYmdQ8vCEStZdDJ3VNX2USHgfjigCrH97VY6fqDTy34lbcmt0ifsvrzeogfAb0cuJ_xc0jSNy_CVGgwjRhgNpaXxRinBZCovrCchbXlvklKdzGH1LawwPSX0w7nEwUhJYXFKsxtkfC6EuOb_ovmRbHtRF3s6ObDgyygXPP6dY3xzLN2wzKkjpVUobVueNUVWz-cUjQSYwiAlK12fArDACfWXP75b1m1PX",
  },
  {
    id: 8,
    title: "Tiếng Gọi Đỉnh Núi",
    meta: "2024 • Phiêu lưu • 1g 40ph",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkv4izX0LZdCxuoR6K9Qtxgsc4tGmBrqUwrrjJxA1lna0OEBw1dgUYgqo9Ita5K8YqqUINjjaTpRk_OxqQCd4kcvrX4FKO83j6SUwzoe-5ieM4r8Bu-RF3a0CJ4EVdR71q29aiwxS3f74f6r_fEqgvbdpel0y7-1OkASEP9cYnzJEQLtUUvtrT9y2x2kiHwJ0TpvBxLZ5KX8oW-y5Rlzdr2vbaFPsIib980oS_G0fjcLomt1udote-Zr4fzJd6GS7M2CQG0-zbqgW3",
  },
];

export default function SeriesPage() {
  return (
    <main className="w-full max-w-[1440px] mx-auto px-[20px] md:px-[64px] py-[48px] flex flex-col gap-12 mt-20">
      {/* Header & Filter */}
      <section className="flex flex-col gap-6">
        <h1 className="text-[40px] md:text-[64px] font-[Montserrat] font-bold leading-tight tracking-tight text-on-surface">
          Khám phá Phim bộ
        </h1>
        <FilterBar searchPlaceholder="Tìm phim bộ, diễn viên, mùa phim..." />
      </section>

      {/* Series Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[16px] md:gap-[24px]">
        {series.map((item) => (
          <MovieCard
            key={item.id}
            title={item.title}
            meta={item.meta}
            posterUrl={item.posterUrl}
            href={`/series/${item.id}`}
          />
        ))}
      </section>

      <div className="flex justify-center mt-8">
        <button className="px-8 py-3 rounded-full border border-white/20 text-on-surface text-[14px] font-[Inter] font-semibold tracking-wider hover:bg-white/5 transition-colors glass-panel">
          Tải thêm
        </button>
      </div>
    </main>
  );
}
