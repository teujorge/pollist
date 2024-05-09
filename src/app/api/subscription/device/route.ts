import { db } from "@/server/prisma";
import { NextResponse } from "next/server";
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

    const { key, userId, appleId, originalTransactionId } =
      (await req.json()) as {
        key?: string;
        userId?: string;
        appleId?: string;
        originalTransactionId?: string;
      };

    if (!key || key !== process.env.IAP_SUBSCRIPTION_KEY) {
      console.error("Invalid key:", key);
      return NextResponse.json({ error: "Invalid key" }, { status: 401 });
    }

    if (!userId || !originalTransactionId || !appleId) {
      console.error(
        "Missing required fields:",
        userId,
        appleId,
        originalTransactionId,
      );
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log(
      "Processing subscription status for:",
      userId,
      appleId,
      originalTransactionId,
    );

    // Check if the transaction already exists
    let dbTransaction = await db.appleTransaction.findUnique({
      where: { originalTransactionId: originalTransactionId },
    });

    // Update transaction it
    if (dbTransaction) {
      dbTransaction = await db.appleTransaction.update({
        where: { userId: userId },
        data: {
          userId: userId,
          appleId: appleId,
        },
      });
      console.log("AppleTransaction Updated:", dbTransaction);
    }

    // create it
    else {
      dbTransaction = await db.appleTransaction.create({
        data: {
          userId: userId,
          appleId: appleId,
          originalTransactionId: originalTransactionId,
        },
      });
      console.log("AppleTransaction Created:", dbTransaction);
    }

    await activateSubscription(userId, "PRO");
    // const { signedTransactionInfo } = await api.getTransactionInfo(
    //   originalTransactionId,
    // );
    // console.log("Signed Transaction Info:", signedTransactionInfo);
    // const transactionInfo = await decodeTransaction(signedTransactionInfo);
    // console.log("Decoded Transaction Info:", transactionInfo);

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
