import { NextResponse } from "next/server";
import { getInfinitePolls } from "@/app/components/InfinitePolls/actions";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const cursor = searchParams.get("cursor") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const boostedId = searchParams.get("boostedId") ?? undefined;

  const polls = await getInfinitePolls({
    cursor,
    search,
    category,
    anonymous: "both",
    boostedId,
  });

  return NextResponse.json({
    status: 200,
    data: polls,
  });
}
