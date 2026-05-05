import { NextResponse } from "next/server";
import { isValidTechStackIconName, searchTechStackIconNames } from "@/app/lib/techStackIcons";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";
  const list = searchTechStackIconNames(query, 24);
  const exact = isValidTechStackIconName(query);

  return NextResponse.json({
    success: true,
    query,
    exactMatch: exact,
    icons: list,
  });
}
