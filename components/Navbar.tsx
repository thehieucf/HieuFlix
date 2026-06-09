"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SearchInput from "@/components/SearchInput";

const navLinks = [
  { href: "/",                  label: "Trang chủ", path: "/",       type: undefined   },
  { href: "/movies?type=single", label: "Phim lẻ",  path: "/movies", type: "single"    },
  { href: "/movies?type=series", label: "Phim bộ",  path: "/movies", type: "series"    },
  { href: "/genres",             label: "Thể loại", path: "/genres", type: undefined   },
];

function NavLinks() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const currentType  = searchParams.get("type");

  return (
    <div className="hidden md:flex items-center gap-8">
      {navLinks.map((link) => {
        let isActive: boolean;
        if (link.path === "/" ) {
          // Trang chủ chỉ active khi đúng /
          isActive = pathname === "/";
        } else if (link.type !== undefined) {
          // Phim lẻ / Phim bộ: phải khớp cả path lẫn type param
          isActive = pathname === link.path && currentType === link.type;
        } else {
          // Thể loại và các link không có type
          isActive = pathname === link.path;
        }

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
  );
}

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-[20px] md:px-[64px] h-20 bg-surface/70 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-12">
        <Link
          href="/"
          className="text-[24px] font-[Montserrat] font-bold tracking-tighter text-primary-container"
        >
          HieuFlix
        </Link>
        {/* NavLinks dùng useSearchParams nên cần bọc trong Suspense */}
        <Suspense
          fallback={
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <span key={l.href} className="text-on-surface-variant text-[24px] font-[Montserrat]">
                  {l.label}
                </span>
              ))}
            </div>
          }
        >
          <NavLinks />
        </Suspense>
      </div>

      <div className="flex items-center gap-4">
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
