import { db } from "@/server/prisma";
import { NextResponse } from "next/server";
import { analyticsServerClient } from "@/server/analytics";
import { updateActiveSubscription, updateInactiveSubscription } from "../utils";
// import {
// Environment,
// AppStoreServerAPI,
// decodeRenewalInfo,
// decodeTransaction,
// } from "app-store-server-api";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const event = (await req.json()) as {
      key?: string;
      userId?: string;
      eventType?: string;
      originalTransactionId?: string;
    };

    if (!event.key || event.key !== process.env.IAP_SUBSCRIPTION_KEY) {
      console.error("Invalid key:", event.key);
      return NextResponse.json({ error: "Invalid key" }, { status: 401 });
    }

    if (!event.userId || !event.eventType || !event.originalTransactionId) {
      console.error(
        "Missing required fields:",
        event.userId,
        event.eventType,
        event.originalTransactionId,
      );
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log(
      "Processing subscription status for:",
      event.userId,
      event.eventType,
      event.originalTransactionId,
    );

    // Handle if subscribe event
    if (event.eventType === "subscribe") {
      // Check if the transaction already exists
      let dbTransaction = await db.appleTransaction.findUnique({
        where: { userId: event.userId },
      });

      // Update transaction if it exists (originalTransactionId may change with new transactions)
      if (dbTransaction) {
        dbTransaction = await db.appleTransaction.update({
          where: { userId: event.userId },
          data: { originalTransactionId: event.originalTransactionId },
        });
        console.log("AppleTransaction Updated:", dbTransaction);
      }

      // Create transaction if it doesn't exist
      else {
        dbTransaction = await db.appleTransaction.create({
          data: {
            userId: event.userId,
            originalTransactionId: event.originalTransactionId,
          },
        });
        console.log("AppleTransaction Created:", dbTransaction);
      }

      await updateActiveSubscription(event.userId, "PRO");

      try {
        analyticsServerClient.capture({
          distinctId: dbTransaction.userId,
          event: "Subscription Enabled",
          properties: {
            tier: "PRO",
            source: "SwiftUI API",
            originalTransactionId: dbTransaction.originalTransactionId,
          },
        });
      } catch (error) {
        console.error("Error capturing analytics event:", error);
      }
    }
    // Handle if revoke, expire, etc events
    else {
      const dbTransaction = await db.appleTransaction.findUnique({
        where: { userId: event.userId },
      });

      if (!dbTransaction) {
        console.error("Transaction not found in database");
        return NextResponse.json(
          { error: "Transaction not found" },
          { status: 404 },
        );
      }

      await updateInactiveSubscription(event.userId);

      try {
        analyticsServerClient.capture({
          distinctId: dbTransaction.userId,
          event: "Subscription Disabled",
          properties: {
            tier: "FREE",
            source: "SwiftUI API",
            originalTransactionId: dbTransaction.originalTransactionId,
          },
        });
      } catch (error) {
        console.error("Error capturing analytics event:", error);
      }
    }

    return NextResponse.json({ status: 200 });
  } catch (e) {
    console.error("Error processing notification:", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: `Failed to process the notification: ${errorMessage}` },
      { status: 500 },
    );
  }
}
