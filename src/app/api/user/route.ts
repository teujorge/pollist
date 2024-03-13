import { db } from "@/database/prisma";
import { Webhook } from "svix";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { UserWebhookEvent } from "@clerk/clerk-sdk-node";

export async function POST(req: NextRequest) {
  try {
    const headersObject: Record<string, string> = {};
    for (const [key, value] of req.headers.entries()) {
      headersObject[key] = value;
    }

    const payloadBuffer = await streamToBuffer(req.body);

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY ?? "");
    let msg;
    try {
      msg = wh.verify(payloadBuffer, headersObject);
    } catch (err) {
      console.error("Error verifying webhook:", msg, "Error:", err);
      return NextResponse.json({
        status: 400,
        body: { error: "Invalid Signature" },
      });
    }

    // Convert buffer to JSON
    const event = JSON.parse(payloadBuffer.toString()) as UserWebhookEvent;
    console.log("Clerk User Event:", event);

    // Ensure the request body is a valid event object
    if (event.object !== "event") {
      console.log("Invalid event object:");
      return NextResponse.json({
        status: 400,
        body: { error: "Invalid event object" },
      });
    }

    switch (event.type) {
      case "user.created": {
        const data = event.data;

        const user = await db.user.create({
          data: {
            id: data.id,
            username: data.username ?? data.first_name ?? data.last_name,
            imageUrl: data.image_url,
          },
        });

        console.log("User Created:", user);
        break;
      }
      case "user.deleted": {
        const data = event.data;

        if (data.deleted) {
          const user = await db.user.delete({ where: { id: data.id } });
          console.log("User Deleted:", user);
        }

        break;
      }
      case "user.updated": {
        const data = event.data;
        const user = await db.user.update({
          where: { id: data.id },
          data: {
            username: data.username ?? data.first_name ?? data.last_name,
            imageUrl: data.image_url,
          },
        });

        console.log("User Updated:", user);
        break;
      }
      default: {
        console.log("Unknown event type");
        return NextResponse.json({
          status: 400,
          body: { error: "Invalid event type" },
        });
      }
    }

    // Respond to the request indicating success
    return NextResponse.json({
      status: 200,
      body: { message: "Webhook received and processed" },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({
      status: 500,
      body: { error: "Internal Server Error" },
    });
  }
}

async function streamToBuffer(
  stream: ReadableStream<Uint8Array> | null,
): Promise<Buffer> {
  if (!stream) {
    throw new Error("No request body");
  }
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
