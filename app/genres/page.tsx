import Image from "next/image";
import Link from "next/link";

const genres = [
  {
    id: "hanh-dong",
    name: "Hành động",
    count: "245 bộ phim",
    icon: "bolt",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDt6YaFokCGhf-dcSkllPlXfViQl56eNBgLREMPGcki1edEGA4MMGVahSNkuK52Pbn5dyYhevE5EvD8ZMApWzWqNT65gsY-Dk2Sp40bspl5UNO_WbX-wuGwUezwXOEIRXUFBlLUW4wn8wHEvvBYV9GQnNarvC17mj-6Ed3YBiXiJkM7-QDasu97sy3039nYLywS7pQreFfdixFjNnGMoxB9qR-IsVupWZmzhug_dHhYfsT_Z5-5dcM_s5aku7SMTAvcVjUQOgNZ5iPy",
  },
  {
    id: "kinh-di",
    name: "Kinh dị",
    count: "132 bộ phim",
    icon: "skull",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDNJmi8SoIaUiT43rbQ5a9-txiMUCOZ3iNAr9yZmfr6BjX9vx8mLEng_z4rykEeHVMsuXyJdzJLRLr7SQVv8kwBFqiHSXQJ_H81dD4jLXpvvXMLpI4AzRrl8lPtl5CDVJ1oGpDFwRUIdadT5sFi7sxgRG4oplRi-tfUm88G-kQWC3LXESfIGxSZfSfs8DYEEK_m88PGsnAgWud0hvKGHIralln0_Igfz-Sl7FtFAj4eKjBU7EPnG6FxLe7pAafbiITmt-LukUB9UW1q",
  },
  {
    id: "khoa-hoc-vien-tuong",
    name: "Khoa học viễn tưởng",
    count: "189 bộ phim",
    icon: "rocket_launch",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDz9xzAk6UcxL698JFrg0Ry78fCC7UC1imJY8UCE1x80-FsYmdQ8vCEStZdDJ3VNX2USHgfjigCrH97VY6fqDTy34lbcmt0ifsvrzeogfAb0cuJ_xc0jSNy_CVGgwjRhgNpaXxRinBZCovrCchbXlvklKdzGH1LawwPSX0w7nEwUhJYXFKsxtkfC6EuOb_ovmRbHtRF3s6ObDgyygXPP6dY3xzLN2wzKkjpVUobVueNUVWz-cUjQSYwiAlK12fArDACfWXP75b1m1PX",
  },
  {
    id: "tinh-cam",
    name: "Tình cảm",
    count: "178 bộ phim",
    icon: "favorite",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDV1hDas0sZY6JH2Zs11-TDRu6lqme84MMtlCXZkfLf1INbvJrI4YpH2MfkM_bnnk3tk3bLQ9DoVfi-oDvYXUn85NfOUJQd0HYVPYGVYfcQOU9YNpzAyC84W-rVC4U6_ICoDng5Wt9nkJny0M7x-Opkyy9QG1t4WpJEbJ1BfkBf8F2z-C_5dpmF9rXTGFoVaiTUiEnTSXPCx-zQUhUuP0nRaQ8fhValFhjNw6zcuOcdx8nWU2PO38WpSsVBKKBUXJZAGRh2X91GMoPN",
  },
  {
    id: "phieu-luu",
    name: "Phiêu lưu",
    count: "156 bộ phim",
    icon: "explore",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkv4izX0LZdCxuoR6K9Qtxgsc4tGmBrqUwrrjJxA1lna0OEBw1dgUYgqo9Ita5K8YqqUINjjaTpRk_OxqQCd4kcvrX4FKO83j6SUwzoe-5ieM4r8Bu-RF3a0CJ4EVdR71q29aiwxS3f74f6r_fEqgvbdpel0y7-1OkASEP9cYnzJEQLtUUvtrT9y2x2kiHwJ0TpvBxLZ5KX8oW-y5Rlzdr2vbaFPsIib980oS_G0fjcLomt1udote-Zr4fzJd6GS7M2CQG0-zbqgW3",
  },
  {
    id: "hai-huoc",
    name: "Hài hước",
    count: "203 bộ phim",
    icon: "sentiment_very_satisfied",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmpdXUq7Ol1n-sLOyVSHGVElgu6e7Rs1ooicst3dRLPJ5xjN2OrEAR8CkuD9bUr1tyHSoRxqgF0BVzoVWzOGGhFqdEpeaYCjY4OiR4HIJPMYSNDd9qrZIX7biw2G8TbHcdxzA9gWNkuqRrCY26wvFQINMc2FBnCv8xGMG_L-saqdQ92NY_uTbgMirNBJ_F5MpgSvp_LkO1uVR9KtVq5FMQWvk2kYmxCtQw5N4XAnaPH8_xxc3moZfyrTVCw31sJRuY53RkjSSB-WLU",
  },
  {
    id: "tam-ly",
    name: "Tâm lý",
    count: "97 bộ phim",
    icon: "psychology",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjnqBKrnlO_zTsX9uQlYTejPhymJv2a61X4psv2ji81zdLlIJcDeL0EEx_gXMajjf9GeYAQZZCo1tvVFqyHkDXz1FfnzMK5XTkTZjmq5uozBecPHDeQzzAD8l-jg9_0zO_scVnLCoie54l7y3LRt4ovRNZuPMLnpnPNy0G55MYq0UtF6-9QabC5KQro7ETAMQpOW7rNhjgAEF0o2ruW3TL1VRyiqfkMbit1e2LpB62FOZoI2PHgd42BdNWRV_RdjZMWpUaJHmIFX_Z",
  },
  {
    id: "tai-lieu",
    name: "Tài liệu",
    count: "74 bộ phim",
    icon: "videocam",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDoi6GkyRYjjQPi07nEot9YpjLq-jKsF4sPXeqiiqWKs0etUABYeg1srfWeHBYmPNGUmQcBoq9YnCQ3laNANXK81X6_WbfQO8wHflGhgtkG4WBoObrqALf_NzHWEZyS-VkSvFySSzMwU6Ky3os_MOy_DiwyMFflOfVq_rFi1UFHotzVeuEkHK6s5Uh_WPPimYLDSYrH6GieBO18KAgjunu-z7YZtgQ4DEtxw9oqZu6FAC-7YjXCuI7RpMxRRtSBvSGig4lxl2HFfEtu",
  },
  {
    id: "chinh-kich",
    name: "Chính kịch",
    count: "211 bộ phim",
    icon: "theater_comedy",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_CUo_h7bCCR2KBrmhEzK707qth68Kz-dKctTGaVKPT5U3ch5gqP_5fNbDfM8ZnyjuXrKDac_bD0rCyNKeRh-iOGa3MsLkzm3-dxT0BTeGaGzMFa8_y7neGzgUCF8LKTdoaJX7rG6SwLks0gxe4o300NEgx8X11fb04L4MZpeCcHhMVIE7gX4yamo48ol0B1mXkeIausFBVkb0InPY-gKOg1aVoy0TmbbL4tkaNtszEvGzX3zBzEoZ7Q7AXtj20Dxr-bRWtl0HOX-z",
  },
  {
    id: "hoat-hinh",
    name: "Hoạt hình",
    count: "88 bộ phim",
    icon: "animation",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_-eVGqTmk2VIOfsTauM1NnhmQktbYnkUel1c_7HTEXaMflmz8EKuyPIVywWxpKvu_jS0EyfTxrWtRER13Is1L1I5ip1hptqsRfWy9YE7UmzyitzNbsLwjPmI0Tz3tcy2X-ntwqcJQCXlIWo0qG3xB5eoXdlA6j982OPdWaY7QI00xV65wttddBqTKZo0-NX8FrE4Z68HcbxQrVKnUkJYJNFhGM3QkL7l42pwgp4xUKViEIZI8FgAYO6LvPgjzwAZpD87OHzbHzcyM",
  },
];

export default function GenresPage() {
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
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/movies?genre=${genre.id}`}
            className="genre-card group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-primary-container transition-colors duration-300"
          >
            <Image
              src={genre.imageUrl}
              alt={genre.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
            {/* Hover overlay with icon + count */}
            <div className="genre-overlay absolute inset-0 opacity-0 bg-gradient-to-t from-background via-background/60 to-transparent flex flex-col justify-end p-4">
              <span
                className="material-symbols-outlined text-primary-container mb-1"
                style={{ fontSize: "28px" }}
              >
                {genre.icon}
              </span>
              <h3 className="text-[24px] font-[Montserrat] font-semibold text-on-surface">
                {genre.name}
              </h3>
              <p className="text-[12px] font-[Inter] text-tertiary">{genre.count}</p>
            </div>
            {/* Default overlay with name */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-[24px] font-[Montserrat] font-semibold text-on-surface">
                {genre.name}
              </h3>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
