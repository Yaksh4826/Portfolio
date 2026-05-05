import { NextResponse } from "next/server";
import {
  getProjectCardsAll,
  getProjectCardsLimited,
  getProjectCardsPaged,
} from "@/app/lib/projectQueries";

const cacheHeaders = { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" };

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  try {
    if (searchParams.has("limit")) {
      const raw = Number(searchParams.get("limit"));
      const lim = Number.isFinite(raw) ? raw : 4;
      const { projects, total } = await getProjectCardsLimited(lim);
      return NextResponse.json(
        { success: true, projects, total },
        { headers: cacheHeaders },
      );
    }

    if (searchParams.has("page") || searchParams.has("pageSize")) {
      const rp = Number(searchParams.get("page"));
      const rps = Number(searchParams.get("pageSize"));
      const data = await getProjectCardsPaged(
        Number.isFinite(rp) ? rp : 1,
        Number.isFinite(rps) ? rps : 12,
      );
      return NextResponse.json({ success: true, ...data }, { headers: cacheHeaders });
    }

    const { projects, total } = await getProjectCardsAll();
    return NextResponse.json(
      { success: true, projects, total },
      { headers: cacheHeaders },
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e) },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
