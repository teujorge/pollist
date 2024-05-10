import { db } from "@/server/prisma";
import { NextResponse } from "next/server";
import { analyticsServerClient } from "@/server/analytics";
import {
  NotificationType,
  decodeTransaction,
  decodeNotificationPayload,
  isDecodedNotificationDataPayload,
  isDecodedNotificationSummaryPayload,
} from "app-store-server-api";
import type { SubTier } from "@prisma/client";
import type { NextRequest } from "next/server";

/** DOCS
 *
 * https://developer.apple.com/documentation/appstoreservernotifications
 *
 * HTTPS RESPONSES
 * Send HTTP 200, or any HTTP code between 200 and 206, if the post was successful.
 * Send HTTP 50x or 40x to have the App Store retry the notification, if the post didn't succeed.
 *
 */

export async function POST(req: NextRequest) {
  try {
    const APP_BUNDLE_ID = process.env.APNS_BUNDLE_ID!;

    const body = (await req.json()) as { signedPayload: string };
    const signedPayload = body.signedPayload;

    const payload = await decodeNotificationPayload(signedPayload);

    if (!payload.data?.bundleId || payload.data?.bundleId !== APP_BUNDLE_ID) {
      console.error(
        "Received notification for incorrect bundle ID:",
        payload.data?.bundleId,
      );
      return NextResponse.json(
        { error: "Incorrect bundle ID" },
        { status: 401 },
      );
    }

    console.log("Decoded Notification Payload:", payload);

    if (isDecodedNotificationDataPayload(payload)) {
      console.log("Handling notification as DecodedNotificationDataPayload");

      const transaction = await decodeTransaction(
        payload.data.signedTransactionInfo,
      );
      console.log("Transaction:", transaction);

      const dbTransaction = await db.appleTransaction.findUnique({
        where: { originalTransactionId: transaction.originalTransactionId },
      });

      if (!dbTransaction) {
        console.error("Transaction not found in database");
        return NextResponse.json(
          { error: "Transaction not found" },
          { status: 404 },
        );
      }

      switch (payload.notificationType) {
        case NotificationType.DidRenew: // Handle a successful renewal
        case NotificationType.Subscribed: // Handle a new subscription
        case NotificationType.OfferRedeemed: // Handle the redemption of a special offer
          await updateActiveSubscription(dbTransaction.userId, "PRO");

          analyticsServerClient.capture({
            distinctId: dbTransaction.userId,
            event: "Subscription Activated (iOS App Store Notification)",
            properties: {
              userId: dbTransaction.userId,
              originalTransactionId: dbTransaction.originalTransactionId,
            },
          });

          break;

        case NotificationType.DidFailToRenew: // Handle a failed renewal attempt
        case NotificationType.Expired: // Handle subscription expiration
        case NotificationType.Revoke: // Handle a revocation of the subscription
        case NotificationType.Refund: // Handle a user getting a refund
          await updateInactiveSubscription(dbTransaction.userId);

          try {
            analyticsServerClient.capture({
              distinctId: dbTransaction.userId,
              event: "Subscription Deactivated (iOS App Store Notification)",
              properties: {
                userId: dbTransaction.userId,
                originalTransactionId: dbTransaction.originalTransactionId,
              },
            });
          } catch (error) {
            console.error("Error capturing analytics event:", error);
          }

          break;

        case NotificationType.ConsumptionRequest: // Handle consumption of a consumable purchase
        case NotificationType.DidChangeRenewalPref: // Handle a change in the user's subscription renewal settings
        case NotificationType.DidChangeRenewalStatus: // Handle a change in the renewal, i.e turning off auto-renewal
        case NotificationType.GracePeriodExpired: // Handle the expiration of a grace period
        case NotificationType.PriceIncrease: // Handle notification of a price increase
        case NotificationType.RefundDeclined: // Handle a declined refund
        case NotificationType.RenewalExtended: // Handle the extension of a renewal period
        case NotificationType.RenewalExtension: // Handle an administrative renewal extension
        case NotificationType.RefundReversed: // Handle a reversal of a refund
          console.log(
            `Unhandled notification type: ${payload.notificationType}`,
          );
          break;
      }
    }
    // Handle the notification summary
    else if (isDecodedNotificationSummaryPayload(payload)) {
      console.log("Handling notification as DecodedNotificationSummaryPayload");
    }
    // Unknown
    else {
      console.log("Received unknown payload type");
      return NextResponse.json(
        { error: "Unknown payload type" },
        { status: 400 },
      );
    }

    // Successful handling
    return NextResponse.json(
      { message: "Notification processed successfully" },
      { status: 200 },
    );
  } catch (e) {
    // Proper error logging
    console.error("Error processing notification:", e);

    // If e is an Error instance, use e.message to get the error message, otherwise, convert it to string
    const errorMessage = e instanceof Error ? e.message : String(e);

    // Return a JSON response indicating failure
    return NextResponse.json(
      { error: `Notification was not processed successfully: ${errorMessage}` },
      { status: 500 },
    );
  }
}

// Function to activate a subscription
async function updateActiveSubscription(userId: string, tier: SubTier) {
  console.log("Activating Subscription:", userId, tier);
  const user = await db.user.update({
    where: { id: userId },
    data: { tier: tier, ads: false },
  });

  console.log("Subscription Activated:", user.username, user.tier);
  return user;
}

// Function to deactivate a subscription
async function updateInactiveSubscription(userId: string) {
  console.log("Deactivating Subscription:", userId);
  const user = await db.user.update({
    where: { id: userId },
    data: { tier: "FREE", ads: true, private: false },
  });

  console.log("Subscription Deactivated:", user.username, user.tier);
  return user;
}
