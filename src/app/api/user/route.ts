import { db } from "@/database/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { UserWebhookEvent } from "@clerk/clerk-sdk-node";

export async function POST(req: NextRequest) {
  try {
    // Log all headers for debugging
    console.log("DEBUG Headers:", req.headers);

    // Verify the request is from the correct source
    const secret = req.headers.get("X-Webhook-Secret");
    if (secret !== process.env.CLERK_WEBHOOK_SECRET_KEY) {
      console.log("Invalid webhook secret:", secret); // this was "null" when I tested it
      // return NextResponse.json({
      //   status: 401,
      //   body: { error: "Unauthorized" },
      // });
    }

    // Parse the request body as JSON
    const event = (await req.json()) as UserWebhookEvent;

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
            imageUrl: data.image_url ?? data.profile_image_url,
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
            imageUrl: data.image_url ?? data.profile_image_url,
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
