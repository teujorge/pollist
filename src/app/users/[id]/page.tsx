/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TcpY2hkdR17
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { Card } from "@/app/components/Card";
import { db } from "@/database/db";
import Image from "next/image";

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!user) return { notFound: true };

  return (
    <Card className="flex flex-col">
      {user.imageUrl && (
        <Image
          src={user.imageUrl}
          alt={user.username ?? "Users's avatar"}
          width={100}
          height={100}
          className="rounded-full"
        />
      )}
      <h1 className=" flex items-center  justify-center">{user.username}</h1>
      {/* <p>{user.id}</p> */}
    </Card>
  );
}
