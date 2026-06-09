export default function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-white/5 py-8 md:py-[48px] px-4 sm:px-8 md:px-[64px] mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <div className="text-[20px] md:text-[24px] font-[Montserrat] text-on-surface font-bold tracking-tighter">
          HieuFlix
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[13px] md:text-[14px] font-[Inter]">
          <a href="#" className="text-on-tertiary-fixed-variant hover:text-primary transition-colors">
            Chính sách bảo mật
          </a>
          <a href="#" className="text-on-tertiary-fixed-variant hover:text-primary transition-colors">
            Điều khoản sử dụng
          </a>
          <a href="#" className="text-on-tertiary-fixed-variant hover:text-primary transition-colors">
            Trung tâm hỗ trợ
          </a>
          <a href="#" className="text-on-tertiary-fixed-variant hover:text-primary transition-colors">
            Liên hệ
          </a>
        </div>
        <div className="text-[11px] md:text-[12px] font-[Inter] text-on-tertiary-fixed-variant text-center md:text-right">
          © 2024 HieuFlix. Bảo lưu mọi quyền.
        </div>
      </div>
      {/* Credit */}
      <div className="max-w-[1440px] mx-auto mt-5 md:mt-6 pt-5 md:pt-6 border-t border-white/5 text-center">
        <p className="text-[11px] md:text-[12px] font-[Inter] text-tertiary">
          Dự án được build bởi{" "}
          <span className="text-primary font-semibold">Phạm Trần Thế Hiếu</span>
        </p>
      </div>
    </footer>
  );
}
