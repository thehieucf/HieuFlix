import { NextRequest, NextResponse } from "next/server";

const VSMOV = "https://vsmov.com";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const res = await fetch(
    `${VSMOV}/api/tim-kiem?keyword=${encodeURIComponent(q)}&limit=8`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    return NextResponse.json({ results: [] }, { status: res.status });
  }

  const data = await res.json();

  // Chuẩn hoá sang format SearchInput mong đợi
  const results = (data.items ?? []).map((item: any) => ({
    id: item._id,
    slug: item.slug,
    title: item.name,
    year: item.year,
    vote_average: item.tmdb?.vote_average ?? null,
    poster_path: typeof item.thumb_url === "string" ? item.thumb_url : null,
  }));

  return NextResponse.json({ results });
}
