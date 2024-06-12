import { NextResponse } from "next/server";
import { getInfiniteUsers } from "@/app/components/InfiniteUsers/actions";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const cursor = searchParams.get("cursor") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const users = await getInfiniteUsers({
    cursor,
    username: search,
  });

  return NextResponse.json({
    status: 200,
    data: users,
  });
}
