import { getPaginatedPolls } from "@/app/components/InfinitePolls/actions";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// recalculating the controversy score for all polls
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const _page = searchParams.get("page") ?? undefined;
  const page = _page ? parseInt(_page) : undefined;

  if (page === undefined || isNaN(page)) {
    return NextResponse.json({
      status: 400,
      error: "Invalid page number",
    });
  }

  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const authorId = searchParams.get("authorId") ?? undefined;
  const voterId = searchParams.get("voterId") ?? undefined;

  const polls = await getPaginatedPolls({
    page: page ?? 1,
    search,
    category,
    authorId,
    voterId,
  });

  return NextResponse.json({
    status: 200,
    data: polls,
  });
}
