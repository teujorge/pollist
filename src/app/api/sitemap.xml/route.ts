import { db } from "@/database/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const staticPages = ["/", "/welcome", "/privacy", "/tos"];
  const dynamicPages = [
    ...(await getPopularPollIds()).map((id) => `/polls/${id}`),
    ...(await getPopularUserUsernames()).map(
      (username) => `/users/${username}`,
    ),
  ];

  const pages = [...staticPages, ...dynamicPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(
          (path) =>
            `<url>
              <loc>${`https://pollist.org${path}`}</loc>
            </url>`,
        )
        .join("")}
    </urlset>
  `;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

async function getPopularPollIds() {
  try {
    const polls = await db.poll.findMany({
      orderBy: {
        votes: {
          _count: "desc",
        },
      },
      take: 20,
    });

    return polls.map((poll) => poll.id);
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getPopularUserUsernames() {
  try {
    const usersCreators = await db.user.findMany({
      orderBy: {
        polls: {
          _count: "desc",
        },
      },
      take: 10,
      select: { username: true },
    });

    const usersFollowers = await db.user.findMany({
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
      take: 10,
      select: { username: true },
    });

    const combinedUsers = [...usersCreators, ...usersFollowers];

    const users = new Set(combinedUsers.map((user) => user.username));

    return Array.from(users);
  } catch (e) {
    console.error(e);
    return [];
  }
}
