"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/movies", label: "Phim lẻ" },
  { href: "/series", label: "Phim bộ" },
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
            const isActive = pathname === link.href;
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
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm phim..."
            className="bg-surface-container border border-white/10 rounded-full py-2 pl-10 pr-4 text-[16px] font-[Inter] text-on-surface placeholder:text-on-surface-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors w-56"
          />
        </div>
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
