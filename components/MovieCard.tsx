import Link from "next/link";
import Image from "next/image";

interface MovieCardProps {
  title: string;
  meta: string;
  posterUrl: string;
  href?: string;
}

export default function MovieCard({
  title,
  meta,
  posterUrl,
  href = "#",
}: MovieCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-2 cursor-pointer rounded-sm border border-transparent transition-colors duration-300 overflow-hidden"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm bg-surface-container">
        <Image
          src={posterUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 17vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <button className="bg-primary-container text-on-primary-container rounded-lg py-2 px-4 flex items-center justify-center gap-2 text-[14px] font-[Inter] font-semibold hover:bg-inverse-primary transition-colors">
            <span className="material-symbols-outlined">play_arrow</span>
            Xem
          </button>
        </div>
      </div>
      <div className="flex flex-col px-1">
        <h3 className="text-[16px] font-[Inter] font-semibold text-on-surface truncate">
          {title}
        </h3>
        <p className="text-[12px] font-[Inter] text-tertiary">{meta}</p>
      </div>
    </Link>
  );
}
