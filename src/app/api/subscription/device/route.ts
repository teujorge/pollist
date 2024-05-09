import { db } from "@/server/prisma";
import { NextResponse } from "next/server";
import {
  Environment,
  AppStoreServerAPI,
  decodeRenewalInfo,
  decodeTransaction,
} from "app-store-server-api";
import type { SubTier } from "@prisma/client";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const KEY = Buffer.from(
      process.env.IAP_SUBSCRIPTION_KEY!,
      "base64",
    ).toString("ascii");
    const KEY_ID = process.env.IAP_KEY_ID!;
    const ISSUER_ID = process.env.IAP_ISSUER_ID!;
    const APP_BUNDLE_ID = process.env.APNS_BUNDLE_ID!;

    const api = new AppStoreServerAPI(
      KEY,
      KEY_ID,
      ISSUER_ID,
      APP_BUNDLE_ID,
      Environment.Production,
    );

    const { key, userId, originalTransactionId } = (await req.json()) as {
      key?: string;
      userId?: string;
      originalTransactionId?: string;
    };

    if (!key || key !== process.env.IAP_SUBSCRIPTION_KEY) {
      console.error("Invalid key:", key);
      return NextResponse.json({ error: "Invalid key" }, { status: 401 });
    }

    if (!userId || !originalTransactionId) {
      console.error("Missing required fields:", userId, originalTransactionId);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log(
      "Processing subscription status for:",
      userId,
      originalTransactionId,
    );

    // Check if the transaction already exists
    let dbTransaction = await db.appleTransaction.findUnique({
      where: { userId: userId },
    });
    // update it
    if (dbTransaction) {
      dbTransaction = await db.appleTransaction.update({
        where: { userId: userId },
        data: { originalTransactionId: originalTransactionId },
      });
      console.log("AppleTransaction Updated:", dbTransaction);
    }
    // create it
    else {
      dbTransaction = await db.appleTransaction.create({
        data: {
          userId: userId,
          originalTransactionId: originalTransactionId,
        },
      });
      console.log("AppleTransaction Created:", dbTransaction);
    }

    const subscriptionResponse = await api.getSubscriptionStatuses(
      originalTransactionId,
    );
    console.log("Subscription Response:", subscriptionResponse);

    if (subscriptionResponse.data && subscriptionResponse.data.length > 0) {
      const item = subscriptionResponse.data[0]?.lastTransactions.find(
        (item) => item.originalTransactionId === originalTransactionId,
      );

      if (item) {
        const transactionInfo = await decodeTransaction(
          item.signedTransactionInfo,
        );
        console.log("--Transaction Info:", transactionInfo);

        const renewalInfo = await decodeRenewalInfo(item.signedRenewalInfo);
        console.log("--Renewal Info:", renewalInfo);

        // Check if subscription is 'active' and update the database accordingly
        if (renewalInfo.autoRenewStatus) {
          await activateSubscription(userId, "PRO");
        } else {
          await deactivateSubscription(userId);
        }

        return NextResponse.json(
          { message: "Subscription status processed successfully" },
          { status: 200 },
        );
      }
    }

    return NextResponse.json(
      { error: "No subscription data found" },
      { status: 404 },
    );
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

async function deactivateSubscription(userId: string) {
  console.log("Deactivating Subscription:", userId);
  const user = await db.user.update({
    where: { id: userId },
    data: { tier: "FREE", ads: true, private: false },
  });

  console.log("Subscription Deactivated:", user.username, user.tier);
  return user;
}
