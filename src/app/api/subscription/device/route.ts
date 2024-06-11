import { dbAdmin } from "@/server/prisma";
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

    // if (!event.key || event.key !== process.env.IAP_SUBSCRIPTION_KEY) {
    //   console.error("Invalid key:", event.key);
    //   return NextResponse.json(
    //     {
    //       error: "Invalid key",
    //     },
    //     {
    //       status: 401,
    //     },
    //   );
    // }

    if (
      event.userId === undefined ||
      event.eventType === undefined ||
      event.originalTransactionId === undefined
    ) {
      console.error(
        "Missing required fields:",
        event.userId,
        event.eventType,
        event.originalTransactionId,
      );
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        },
      );
    }

    console.log(
      "Processing subscription status for:",
      event.userId,
      event.eventType,
      event.originalTransactionId,
    );

    // Handle if subscribed event
    if (event.eventType === "subscribed") {
      // Fetch transactions by userId and originalTransactionId in parallel
      const dbTransactionByUserP = dbAdmin.appleTransaction.findUnique({
        where: { userId: event.userId },
        include: { user: true },
      });
      const dbTransactionByTransactionIdP = dbAdmin.appleTransaction.findUnique(
        {
          where: { originalTransactionId: event.originalTransactionId },
          include: { user: true },
        },
      );

      const [dbTransactionByUser, dbTransactionByTransactionId] =
        await Promise.all([
          dbTransactionByUserP,
          dbTransactionByTransactionIdP,
        ]);

      let dbTransaction: typeof dbTransactionByUser = null;

      // If both transactions exist
      if (dbTransactionByUser && dbTransactionByTransactionId) {
        if (
          dbTransactionByUser.userId === dbTransactionByTransactionId.userId &&
          dbTransactionByUser.originalTransactionId ===
            dbTransactionByTransactionId.originalTransactionId
        ) {
          // If both userId and originalTransactionId match, use either transaction
          dbTransaction = dbTransactionByUser;
        } else {
          // If the userId and originalTransactionId do not match, ignore this request
          console.log(
            "User has a transaction, but userId or transactionId is different. Ignoring request.",
          );
          return NextResponse.json(
            {
              state: "subscribed",
              userId: dbTransactionByTransactionId.userId,
              username: dbTransactionByTransactionId.user.username,
            },
            {
              status: 200,
            },
          );
        }
      }
      // Only transaction by user id exists
      else if (dbTransactionByUser) {
        // originalTransactionId may change with new transactions
        dbTransaction = await dbAdmin.appleTransaction.update({
          where: { userId: event.userId },
          data: { originalTransactionId: event.originalTransactionId },
          include: { user: true },
        });
        console.log("AppleTransaction Updated:", dbTransaction);
      }
      // Only transaction by transaction id exists
      else if (dbTransactionByTransactionId) {
        console.log(
          "Transaction by transaction id exists, but not by user id. Ignoring request.",
        );
        // In this case we ignore this request the user has a transaction, but the userId is different. The user may have subscribed from a device, then signed into another account
        return NextResponse.json(
          {
            state: "subscribed",
            userId: dbTransactionByTransactionId.userId,
            username: dbTransactionByTransactionId.user.username,
          },
          {
            status: 200,
          },
        );
      }
      // No transaction exists
      else {
        // Create transaction
        dbTransaction = await dbAdmin.appleTransaction.create({
          data: {
            userId: event.userId,
            originalTransactionId: event.originalTransactionId,
          },
          include: { user: true },
        });
        console.log("AppleTransaction Created:", dbTransaction);
      }

      // If a transaction is found or created, update the user subscription status
      if (dbTransaction) {
        // User already has a PRO subscription
        if (dbTransaction.user.tier === "PRO") {
          console.log("User already has a PRO subscription");
          return NextResponse.json(
            {
              state: "subscribed",
              userId: dbTransaction.userId,
              username: dbTransaction.user.username,
            },
            {
              status: 200,
            },
          );
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

        return NextResponse.json(
          {
            state: "subscribed",
            userId: dbTransaction.userId,
            username: dbTransaction.user.username,
          },
          {
            status: 200,
          },
        );
      } else {
        console.error("Transaction not found in database");
        return NextResponse.json(
          {
            error: "Transaction not found",
          },
          {
            status: 404,
          },
        );
      }
    }
    // Handle revocation, expiration, etc.
    else {
      const dbDeletedTransaction = await dbAdmin.appleTransaction.delete({
        where: { originalTransactionId: event.originalTransactionId },
        include: { user: true },
      });

      if (!dbDeletedTransaction) {
        console.error("Transaction not found in database");
        return NextResponse.json(
          {
            error: "Transaction not found",
          },
          {
            status: 404,
          },
        );
      }

      // User already has a FREE subscription
      if (dbDeletedTransaction.user.tier === "FREE") {
        console.log("User already has a FREE subscription");
        return NextResponse.json(
          {
            state: "unsubscribed",
            userId: dbDeletedTransaction.userId,
            username: dbDeletedTransaction.user.username,
          },
          {
            status: 200,
          },
        );
      }

      await updateInactiveSubscription(dbDeletedTransaction.userId);

      try {
        analyticsServerClient.capture({
          distinctId: dbDeletedTransaction.userId,
          event: "Subscription Disabled",
          properties: {
            tier: "FREE",
            source: "SwiftUI API",
            originalTransactionId: dbDeletedTransaction.originalTransactionId,
          },
        });
      } catch (error) {
        console.error("Error capturing analytics event:", error);
      }

      return NextResponse.json(
        {
          state: "unsubscribed",
          userId: dbDeletedTransaction.userId,
          username: dbDeletedTransaction.user.username,
        },
        {
          status: 200,
        },
      );
    }
  } catch (e) {
    console.error("Error processing notification:", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      {
        error: `Failed to process the notification: ${errorMessage}`,
      },
      {
        status: 500,
      },
    );
  }
}
