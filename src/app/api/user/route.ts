import Stripe from "stripe";
import { db } from "@/server/prisma";
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
      return NextResponse.json(
        {
          error: err instanceof Error ? err : "Invalid Signature",
          message: msg,
        },
        { status: 401 },
      );
    }

    // Convert buffer to JSON
    const event = JSON.parse(payloadBuffer.toString()) as UserWebhookEvent;

    // Ensure the request body is a valid event object
    if (event.object !== "event") {
      return NextResponse.json(
        { error: "Invalid event object" },
        { status: 400 },
      );
    }

    switch (event.type) {
      case "user.created": {
        const data = event.data;

        try {
          await db.user.create({
            data: {
              id: data.id,
              username:
                data.username ?? data.first_name ?? data.last_name ?? data.id,
              imageUrl: data.image_url,
            },
          });
        } catch (e) {
          let logMessage = "⚠️  Error creating user: ";
          if (e instanceof Error) {
            logMessage += `${e.message}`;
          } else {
            logMessage += "Internal Server Error";
          }
          console.error(logMessage);
          return NextResponse.json({ error: logMessage }, { status: 500 });
        }

        break;
      }
      case "user.deleted": {
        const data = event.data;

        try {
          if (data.deleted) {
            const user = await db.user.findUnique({ where: { id: data.id } });

            // Cancel user subscription (stripe)
            if (user?.clerkId) {
              const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
              await stripe.customers.del(user.clerkId);
            }

            // Delete the user from the database
            await db.user.delete({ where: { id: data.id } });
          }
        } catch (e) {
          let logMessage = "⚠️  Error deleting user: ";
          if (e instanceof Error) {
            logMessage += `${e.message}`;
          } else {
            logMessage += "Internal Server Error";
          }
          console.error(logMessage);
          return NextResponse.json({ error: logMessage }, { status: 500 });
        }

        break;
      }
      case "user.updated": {
        const data = event.data;

        try {
          await db.user.update({
            where: { id: data.id },
            data: {
              username:
                data.username ?? data.first_name ?? data.last_name ?? data.id,
              imageUrl: data.image_url,
            },
          });
        } catch (e) {
          let logMessage = "⚠️  Error updating user: ";
          if (e instanceof Error) {
            logMessage += `${e.message}`;
          } else {
            logMessage += "Internal Server Error";
          }
          console.error(logMessage);
          return NextResponse.json({ error: logMessage }, { status: 500 });
        }

        break;
      }
      default: {
        return NextResponse.json(
          { error: "Invalid event type" },
          { status: 400 },
        );
      }
    }

    // Respond to the request indicating success
    return NextResponse.json({ message: "Webhook received and processed" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error : "Internal Server Error" },
      { status: 500 },
    );
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
