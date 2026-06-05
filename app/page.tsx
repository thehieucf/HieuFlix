import Link from "next/link";

const trendingMovies = [
  {
    id: 1,
    title: "The Director's Cut",
    meta: "2023 • Thriller",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjnqBKrnlO_zTsX9uQlYTejPhymJv2a61X4psv2ji81zdLlIJcDeL0EEx_gXMajjf9GeYAQZZCo1tvVFqyHkDXz1FfnzMK5XTkTZjmq5uozBecPHDeQzzAD8l-jg9_0zO_scVnLCoie54l7y3LRt4ovRNZuPMLnpnPNy0G55MYq0UtF6-9QabC5KQro7ETAMQpOW7rNhjgAEF0o2ruW3TL1VRyiqfkMbit1e2LpB62FOZoI2PHgd42BdNWRV_RdjZMWpUaJHmIFX_Z",
  },
  {
    id: 2,
    title: "Neon Void",
    meta: "2024 • Sci-Fi",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdmWLqeRFmFynFd4Cg8OBaSw6FVHplUc_d1qhy1sPK-tWLeXX-LCoFw_inv249kWXtQpk97ii1p01p6-YMsWK7Uz-uYtHMs3MPkg_9WvzLvN1l3zwD5RnwQOiEdtIdvbyrB9r5P-ZmGBJabjRt_w9caA_BT5gz_SEfXEoMaA5oG22wyto4YIEvqvmY18RfvAp851jIJN3QF1vUT6yn19eqvZ0hXQaxjtgtazXK0kD4RBD0wk3nV8geEY6FJYbmGTm7ofaJACnTRPnG",
  },
  {
    id: 3,
    title: "Blood Moon Rising",
    meta: "2023 • Horror",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB5A3gDUNvlvHIvAgNwqO7we7pS0beuHc1BtTXokTXfe-6UuCI_8K6iOO3GIJqrRkelQfFfqrUm0h2CYu2g-cfZ956l-IIxbEUucMATKfPCJjvgdhu7QATCWxy2jAopCHIISx0B1nyAFOeBpMjsyJu5qz2FvP-r1qKHD4lmtOchQmeqmAXHjYwSN7Ab7qK2bj3KfJeVtXkTy_5RcBnDoJwv1YTX0bZYBVlYa82gtJSZVgwTH8cOrChfKp3mJ85hL4G_ObMs5SADbGmB",
  },
  {
    id: 4,
    title: "Action & Cut",
    meta: "2022 • Drama",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAy8q-uZi5P-z3tneCTfLPZ8RF13UMDjL17EzVg1pez-F3mtkjKtFDvc81RAP7KqliYw9dGdbbT55g0mrOfmrh1EZv_7U2X7hZ3gLwwglpwXwihElze79FeKdLx7t67NQxqSi8IS9dcbEVI-nUOvPSLQMC0m6IqA4MBRDbQaCjyfM8tCX8qsffesw6mdW_eLM0cSiba95zFttGxduuxTNsJwZ0VJj9U1vYRsxgHd-GZUUYnTn9d8iDqcgeDNcol8wb6VBiNLX44lUcA",
  },
  {
    id: 5,
    title: "The Celluloid Dream",
    meta: "2021 • Documentary",
    posterUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDoi6GkyRYjjQPi07nEot9YpjLq-jKsF4sPXeqiiqWKs0etUABYeg1srfWeHBYmPNGUmQcBoq9YnCQ3laNANXK81X6_WbfQO8wHflGhgtkG4WBoObrqALf_NzHWEZyS-VkSvFySSzMwU6Ky3os_MOy_DiwyMFflOfVq_rFi1UFHotzVeuEkHK6s5Uh_WPPimYLDSYrH6GieBO18KAgjunu-z7YZtgQ4DEtxw9oqZu6FAC-7YjXCuI7RpMxRRtSBvSGig4lxl2HFfEtu",
  },
];

const continueWatching = [
  {
    id: 1,
    title: "Desert Planet: Part 1",
    remaining: "Còn 1g 12ph",
    progress: 65,
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7qXSsNBzTI9rsxmxsvMNc6bmPEUfyUtR2JbnKYS_aaGJ-sVGSY05nkNj0t_dbeZ8YcgpxpjdLNJc6thZj7ABMnefHrjxxYA3-XF4PzWFVhreBKInvVAA-iSi3_6Q2ynuEpMjJ93FEO5yKdjqr8vYvWgksPvWkU66DlXWMadFXk3zTs3Oc_TkWsGJ8vqzhHN4w6PqDSKOg6lVujtk1qA_oJtXDLSdGl2H0t902KFeWIT2qO11P04QeXQ_YAVwjqKG9iBBFI2DT9Loc",
  },
  {
    id: 2,
    title: "The Silent Woods - S2:E4",
    remaining: "Còn 42ph",
    progress: 20,
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQDMG5bhDATcRKZJGnUa0zoiweKfaCw1BqxqM7UyWIaIzxcJY44eJIJMz9z9AOJKBN3_hmwsUsNtffxWeqqDumPG9KKrzBHbJc2P5GX6UaUxTfPFNeBmC00AelTzvMBGgkAfUVioXfIG3c_1G8tDmr2JrJY--9hn3PldySD4jleEcFmxuKpVAF65mZmgjyLnn6lJOhKKrUq0EUckJmY5XwOXA-bvy3ql-TTqTt9KetPAm_BprUStJmTSVLmE6TeorWKzTf9hrzArgK",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[870px] md:h-[921px] flex items-center">
        <div className="absolute inset-0 w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxGzEU5TEeGGirJOBiU8Z_qNAsMxEqn9q0gcEH_OpUwisxrSu6ePZyqvwmHgSNBQsdEgoBqh4eSUJlDs8YVswSeb3SoRBhfHZvxfqx0tSHNdfeK_N5d0ncmgd3_TZOjLIlx-SskDM_I2Xj0Zi8LHuYrbVyzBsVvv_7HJH2Kq0q-oV6rlJjU7l4zCOQAL0dr8gJ_n-hI49YL_eu3nHk3b6FUSYCkCKpFOGM4IC6QdFTtE30l0GHXMFmG5k4gjZqgFaXTMLcC4PVRaNM"
            alt="Hero Movie Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        <div className="relative z-10 px-[20px] md:px-[64px] w-full max-w-[1440px] mx-auto mt-20 md:mt-0">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-surface-container rounded-full text-tertiary text-[12px] font-[Inter] border border-white/10">
                KHOA HỌC VIỄN TƯỞNG
              </span>
              <span className="px-3 py-1 bg-surface-container rounded-full text-tertiary text-[12px] font-[Inter] border border-white/10">
                HÀNH ĐỘNG
              </span>
              <span className="text-tertiary text-[12px] font-[Inter]">2024 • 2h 45m</span>
            </div>
            <h1 className="text-[40px] md:text-[64px] font-[Montserrat] font-bold leading-tight tracking-tight text-on-surface mb-6">
              CHRONICLES OF ECHO
            </h1>
            <p className="text-[18px] font-[Inter] leading-relaxed text-on-surface-variant mb-8 line-clamp-3">
              Trong một thế giới mà các vết nứt thời gian bị vũ khí hóa, một điệp viên phản bội phải điều
              hướng qua những thực tại vang vọng để ngăn chặn sự sụp đổ thời gian sắp xảy ra. Cuộc đua tối
              thượng chống lại thời gian bắt đầu ngay bây giờ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 bg-primary-container text-on-primary-container px-8 py-4 rounded-xl hover:bg-inverse-primary transition-colors text-[14px] font-[Inter] font-semibold tracking-wider">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                  play_arrow
                </span>
                Xem ngay
              </button>
              <button className="flex items-center justify-center gap-2 glass-panel border border-white/20 text-on-surface px-8 py-4 rounded-xl hover:bg-surface-container transition-colors text-[14px] font-[Inter] font-semibold tracking-wider">
                <span className="material-symbols-outlined">add</span>
                Yêu thích
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Rows */}
      <main className="relative z-20 pb-24 -mt-16 bg-background">
        {/* Trending Now */}
        <section className="mb-[48px] px-[20px] md:px-[64px] max-w-[1440px] mx-auto overflow-hidden">
          <h2 className="text-[24px] font-[Montserrat] font-semibold text-on-surface mb-6">
            Đang thịnh hành
          </h2>
          <div className="flex overflow-x-auto hide-scrollbar gap-[16px] pb-4 -mx-[20px] px-[20px] md:mx-0 md:px-0">
            {trendingMovies.map((movie) => (
              <div
                key={movie.id}
                className="group relative flex-none w-[160px] md:w-[220px] aspect-[2/3] rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 border border-white/10 hover:border-primary-container"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-[14px] font-[Inter] font-semibold text-on-surface mb-1 truncate">
                    {movie.title}
                  </h3>
                  <p className="text-[12px] font-[Inter] text-tertiary">{movie.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Continue Watching */}
        <section className="mb-[48px] px-[20px] md:px-[64px] max-w-[1440px] mx-auto overflow-hidden">
          <h2 className="text-[24px] font-[Montserrat] font-semibold text-on-surface mb-6">
            Xem tiếp
          </h2>
          <div className="flex overflow-x-auto hide-scrollbar gap-[16px] pb-4 -mx-[20px] px-[20px] md:mx-0 md:px-0">
            {continueWatching.map((item) => (
              <div
                key={item.id}
                className="group relative flex-none w-[280px] md:w-[320px] aspect-video rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 border border-white/10 hover:border-white/30 bg-surface-container"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                  <button className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-lg">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      play_arrow
                    </span>
                  </button>
                </div>
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-surface-dim to-transparent p-4">
                  <h3 className="text-[14px] font-[Inter] font-semibold text-on-surface mb-2 truncate">
                    {item.title}
                  </h3>
                  <div className="w-full h-1 bg-[#333333] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary-container rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <p className="text-[12px] font-[Inter] text-tertiary mt-2">{item.remaining}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
