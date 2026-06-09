"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import SearchInput from "@/components/SearchInput";

const navLinks = [
  { href: "/",                   label: "Trang chủ", path: "/",       type: undefined },
  { href: "/movies?type=single", label: "Phim lẻ",   path: "/movies", type: "single"  },
  { href: "/movies?type=series", label: "Phim bộ",   path: "/movies", type: "series"  },
  { href: "/genres",             label: "Thể loại",  path: "/genres", type: undefined },
];

function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const currentType  = searchParams.get("type");

  return (
    <>
      {navLinks.map((link) => {
        let isActive: boolean;
        if (link.path === "/") {
          isActive = pathname === "/";
        } else if (link.type !== undefined) {
          isActive = pathname === link.path && currentType === link.type;
        } else {
          isActive = pathname === link.path;
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={
              isActive
                ? "text-primary border-b-2 border-primary-container pb-1 text-[15px] lg:text-[18px] font-[Montserrat] whitespace-nowrap"
                : "text-on-surface-variant hover:text-on-surface transition-colors text-[15px] lg:text-[18px] font-[Montserrat] whitespace-nowrap"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  // Đóng menu khi navigate
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Khoá scroll body khi menu mở
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 lg:px-[64px] h-16 md:h-20 bg-surface/70 backdrop-blur-xl border-b border-white/10">
        {/* Left: Logo + Desktop nav */}
        <div className="flex items-center gap-4 md:gap-6 lg:gap-12">
          <Link
            href="/"
            className="text-[20px] md:text-[22px] lg:text-[24px] font-[Montserrat] font-bold tracking-tighter text-primary-container shrink-0"
          >
            HieuFlix
          </Link>
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <Suspense
              fallback={navLinks.map((l) => (
                <span key={l.href} className="text-on-surface-variant text-[15px] font-[Montserrat] whitespace-nowrap">
                  {l.label}
                </span>
              ))}
            >
              <NavLinks />
            </Suspense>
          </div>
        </div>

        {/* Right: Search + mobile icons */}
        <div className="flex items-center gap-2 md:gap-3 lg:gap-4 min-w-0">
          {/* Desktop search */}
          <Suspense
            fallback={
              <div className="relative hidden md:block">
                <div className="bg-surface-container border border-white/10 rounded-full py-2 pl-10 pr-4 w-56 h-[38px]" />
              </div>
            }
          >
            <SearchInput />
          </Suspense>

          {/* Mobile search toggle */}
          <button
            aria-label="Tìm kiếm"
            className="md:hidden text-on-surface hover:text-primary transition-colors p-1"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          {/* Hamburger */}
          <button
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            className="md:hidden text-on-surface hover:text-primary transition-colors p-1"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="material-symbols-outlined">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile search bar (below navbar) */}
      {searchOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 md:hidden">
          <MobileSearchInput onClose={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Drawer panel */}
          <div
            className="absolute top-16 left-0 right-0 bg-surface border-b border-white/10 px-6 py-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <Suspense fallback={null}>
              <NavLinks onLinkClick={() => setMenuOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
}

// Tách riêng để tránh circular import
function MobileSearchInput({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      onClose();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
        search
      </span>
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm kiếm phim..."
        className="w-full bg-surface-container border border-white/10 rounded-full py-2.5 pl-10 pr-10 text-[15px] font-[Inter] text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </form>
  );
}
