"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

interface SearchResult {
  id: number;
  slug: string;
  title: string;
  year?: number | string;
  poster_path?: string | null;
  vote_average?: number | string | null;
}

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();

  const [value, setValue] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Đóng dropdown khi navigate sang trang khác
  useEffect(() => {
    setValue("");
    setResults([]);
    setIsOpen(false);
  }, [pathname]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dọn timeout khi unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const fetchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query.trim())}`
      );
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setResults(data.results?.slice(0, 8) ?? []);
      setIsOpen(true);
      setActiveIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setValue(q);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(() => fetchResults(q), 500);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        router.push(`/movie/${results[activeIndex].slug}`);
        closeDropdown();
      } else if (value.trim()) {
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
        closeDropdown();
      }
    } else if (e.key === "Escape") {
      closeDropdown();
      inputRef.current?.blur();
    }
  }

  function closeDropdown() {
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleClear() {
    setValue("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }

  const showDropdown = isOpen && value.trim().length > 0;

  return (
    <div ref={wrapperRef} className="relative hidden md:block">
      {/* Input */}
      <div className="relative">
        <span
          className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] transition-colors pointer-events-none ${
            showDropdown ? "text-primary-container" : "text-on-surface-variant"
          }`}
        >
          {isLoading ? "hourglass_empty" : "search"}
        </span>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Tìm kiếm phim..."
          autoComplete="off"
          className={`bg-surface-container border text-[14px] font-[Inter] text-on-surface placeholder:text-on-surface-variant outline-none transition-all w-56 focus:w-80 py-2 pl-10 pr-8 ${
            showDropdown
              ? "border-primary-container ring-1 ring-primary-container rounded-t-2xl rounded-b-none border-b-transparent"
              : "border-white/10 rounded-full focus:border-primary-container focus:ring-1 focus:ring-primary-container"
          }`}
        />

        {/* Nút xoá */}
        {value && (
          <button
            onMouseDown={(e) => { e.preventDefault(); handleClear(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Xoá tìm kiếm"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 bg-surface-container border border-primary-container border-t-0 rounded-b-2xl overflow-hidden shadow-2xl z-50">

          {/* Loading skeleton */}
          {isLoading && results.length === 0 && (
            <div className="flex flex-col gap-1 p-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl animate-pulse">
                  <div className="w-9 h-12 rounded-md bg-surface-container-high flex-shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-3 bg-surface-container-high rounded w-3/4" />
                    <div className="h-2.5 bg-surface-container-high rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Kết quả */}
          {!isLoading && results.length > 0 && (
            <ul role="listbox">
              {results.map((movie, idx) => (
                <li key={movie.id} role="option" aria-selected={idx === activeIndex}>
                  <Link
                    href={`/movie/${movie.slug}`}
                    onClick={closeDropdown}
                    className={`flex items-center gap-3 px-3 py-2 mx-1 my-0.5 rounded-xl transition-colors ${
                      idx === activeIndex
                        ? "bg-surface-container-high"
                        : "hover:bg-surface-container-high"
                    }`}
                  >
                    {/* Poster nhỏ */}
                    <div className="w-9 h-12 rounded-md overflow-hidden flex-shrink-0 bg-surface-container-high">
                      {movie.poster_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={movie.poster_path}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-tertiary text-[18px]">movie</span>
                        </div>
                      )}
                    </div>

                    {/* Thông tin */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-[Inter] font-semibold text-on-surface truncate">
                        {movie.title}
                      </span>
                      <span className="text-[12px] font-[Inter] text-tertiary">
                        {movie.year ?? "—"}
                        {movie.vote_average && Number(movie.vote_average) > 0
                          ? ` • ⭐ ${Number(movie.vote_average).toFixed(1)}`
                          : ""}
                      </span>
                    </div>

                    {/* Arrow icon */}
                    <span className="material-symbols-outlined text-tertiary text-[18px] ml-auto flex-shrink-0">
                      arrow_forward
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Không có kết quả */}
          {!isLoading && results.length === 0 && (
            <div className="flex items-center gap-3 px-4 py-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">search_off</span>
              <span className="text-[14px] font-[Inter]">
                Không tìm thấy kết quả cho "{value}"
              </span>
            </div>
          )}

          {/* Footer: Xem tất cả kết quả */}
          {results.length > 0 && (
            <Link
              href={`/search?q=${encodeURIComponent(value.trim())}`}
              onClick={closeDropdown}
              className="flex items-center justify-center gap-2 py-2.5 border-t border-white/10 text-[13px] font-[Inter] font-semibold text-primary hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              Xem tất cả kết quả cho "{value}"
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
