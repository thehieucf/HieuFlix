"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import SearchInput from "@/components/SearchInput";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/movies?type=single", label: "Phim lẻ" },
  { href: "/movies?type=series", label: "Phim bộ" },
  { href: "/genres", label: "Thể loại" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-[20px] md:px-[64px] h-20 bg-surface/70 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-12">
        <Link
          href="/"
          className="text-[24px] font-[Montserrat] font-bold tracking-tighter text-primary-container"
        >
          HieuFlix
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const linkPath = link.href.split("?")[0];
            const isActive = pathname === link.href || pathname === linkPath;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "text-primary border-b-2 border-primary-container pb-1 text-[24px] font-[Montserrat]"
                    : "text-on-surface-variant hover:text-on-surface transition-colors hover:scale-105 duration-300 text-[24px] font-[Montserrat]"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Suspense bắt buộc vì SearchInput dùng useSearchParams() */}
        <Suspense
          fallback={
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <div className="bg-surface-container border border-white/10 rounded-full py-2 pl-10 pr-4 w-56 h-[38px]" />
            </div>
          }
        >
          <SearchInput />
        </Suspense>

        <button
          aria-label="Thông báo"
          className="text-on-surface hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </nav>
  );
}
