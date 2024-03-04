import { db } from "@/database/db";
import { NextResponse } from "next/server";

export async function GET() {
  const staticPages = ["/", "/welcome", "/privacy-policy"];
  const dynamicPages = [
    ...(await getPopularPollIds()).map((id) => `/polls/${id}`),
    ...(await getPopularUserIds()).map((id) => `/users/${id}`),
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

async function getPopularUserIds() {
  try {
    const usersCreators = await db.user.findMany({
      orderBy: {
        polls: {
          _count: "desc",
        },
      },
      take: 10,
    });

    const usersFollowers = await db.user.findMany({
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
      take: 10,
    });

    const combinedUsers = [...usersCreators, ...usersFollowers];

    const users = new Set(combinedUsers.map((user) => user.id));

    return Array.from(users);
  } catch (e) {
    console.error(e);
    return [];
  }
}
