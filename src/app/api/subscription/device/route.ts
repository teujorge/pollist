import { db } from "@/server/prisma";
import { NextResponse } from "next/server";
import { analyticsServerClient } from "@/server/analytics";
// import {
// Environment,
// AppStoreServerAPI,
// decodeRenewalInfo,
// decodeTransaction,
// } from "app-store-server-api";
import type { SubTier } from "@prisma/client";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // const KEY = Buffer.from(
    //   process.env.IAP_SUBSCRIPTION_KEY!,
    //   "base64",
    // ).toString("ascii");
    // const KEY_ID = process.env.IAP_KEY_ID!;
    // const ISSUER_ID = process.env.IAP_ISSUER_ID!;
    // const APP_BUNDLE_ID = process.env.APNS_BUNDLE_ID!;

    // const api = new AppStoreServerAPI(
    //   KEY,
    //   KEY_ID,
    //   ISSUER_ID,
    //   APP_BUNDLE_ID,
    //   Environment.Production,
    // );

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

    await activateSubscription(event.userId, "PRO");

    // const { signedTransactionInfo } = await api.getTransactionInfo(
    //   originalTransactionId,
    // );
    // console.log("Signed Transaction Info:", signedTransactionInfo);
    // const transactionInfo = await decodeTransaction(signedTransactionInfo);
    // console.log("Decoded Transaction Info:", transactionInfo);

    analyticsServerClient.capture({
      distinctId: event.userId,
      event: "Subscription Enabled",
      properties: {
        tier: "PRO",
        source: "iOS Device Action",
        originalTransactionId: event.originalTransactionId,
      },
    });

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

async function activateSubscription(userId: string, tier: SubTier) {
  console.log("Activating Subscription:", userId, tier);
  const user = await db.user.update({
    where: { id: userId },
    data: { tier: tier, ads: false },
  });

  console.log("Subscription Activated:", user.username, user.tier);
  return user;
}

// async function deactivateSubscription(userId: string) {
//   console.log("Deactivating Subscription:", userId);
//   const user = await db.user.update({
//     where: { id: userId },
//     data: { tier: "FREE", ads: true, private: false },
//   });

//   console.log("Subscription Deactivated:", user.username, user.tier);
//   return user;
// }
