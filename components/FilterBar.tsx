"use client";

interface FilterBarProps {
  searchPlaceholder?: string;
}

export default function FilterBar({
  searchPlaceholder = "Tìm phim, diễn viên, đạo diễn...",
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full bg-surface-container rounded-full py-3 pl-12 pr-4 text-[16px] font-[Inter] text-on-surface border border-white/10 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors"
          />
        </div>
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-3">
          {["Thể loại", "Năm", "Đánh giá"].map((label) => (
            <button
              key={label}
              className="px-4 py-2 rounded-full bg-surface-container border border-white/10 text-on-surface hover:bg-surface-bright transition-colors text-[14px] font-[Inter] font-semibold tracking-wider flex items-center gap-2"
            >
              <span>{label}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
            </button>
          ))}
        </div>
      </div>
      {/* Active filter chips */}
      <div className="flex flex-wrap gap-2">
        {["Hành động", "2024"].map((chip) => (
          <span
            key={chip}
            className="px-3 py-1 rounded-full bg-surface-container-high text-tertiary text-[12px] font-[Inter] flex items-center gap-1"
          >
            {chip}
            <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-on-surface">
              close
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
