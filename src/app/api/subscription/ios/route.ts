import { dbAdmin } from "@/server/prisma";
import { NextResponse } from "next/server";
import { analyticsServerClient } from "@/server/analytics";
import { updateActiveSubscription, updateInactiveSubscription } from "../utils";
import {
  NotificationType,
  decodeTransaction,
  decodeNotificationPayload,
  isDecodedNotificationDataPayload,
  isDecodedNotificationSummaryPayload,
} from "app-store-server-api";
import type { NextRequest } from "next/server";

/** DOCS
 *
 * https://developer.apple.com/documentation/appstoreservernotifications
 * https://developer.apple.com/documentation/appstoreservernotifications/notificationtype
 * https://developer.apple.com/help/app-store-connect/reference/subscription-events/
 * https://developer.apple.com/documentation/appstoreserverapi/originaltransactionid
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

      const dbTransaction = await dbAdmin.appleTransaction.findUnique({
        where: { originalTransactionId: transaction.originalTransactionId },
        include: { user: true },
      });

      switch (payload.notificationType) {
        case NotificationType.DidRenew: // Handle a successful renewal
        case NotificationType.Subscribed: // Handle a new subscription
        case NotificationType.OfferRedeemed: // Handle the redemption of a special offer
          if (!dbTransaction) {
            console.error("Transaction not found in database");
            return NextResponse.json(
              { error: "Transaction not found" },
              { status: 404 },
            );
          }

          if (dbTransaction.user.tier === "PRO") {
            console.log("User already has a PRO subscription");
            return NextResponse.json({ status: 200 });
          }

          await updateActiveSubscription(dbTransaction.userId, "PRO");

          try {
            analyticsServerClient.capture({
              distinctId: dbTransaction.userId,
              event: "Subscription Enabled",
              properties: {
                tier: "PRO",
                source: "App Store Notifications",
                originalTransactionId: dbTransaction.originalTransactionId,
              },
            });
          } catch (error) {
            console.error("Error capturing analytics event:", error);
          }

          break;

        case NotificationType.DidFailToRenew: // Handle a failed renewal attempt
        case NotificationType.Expired: // Handle subscription expiration
        case NotificationType.Revoke: // Handle a revocation of the subscription
        case NotificationType.Refund: // Handle a user getting a refund
          if (!dbTransaction) {
            console.error(
              "Transaction not found in database, probably already deleted",
            );
            return NextResponse.json({ status: 200 });
          }

          await dbAdmin.appleTransaction.delete({
            where: {
              originalTransactionId: dbTransaction.originalTransactionId,
            },
          });

          if (dbTransaction.user.tier === "FREE") {
            console.log("User already has a FREE subscription");
            return NextResponse.json({ status: 200 });
          }

          await updateInactiveSubscription(dbTransaction.userId);

          try {
            analyticsServerClient.capture({
              distinctId: dbTransaction.userId,
              event: "Subscription Disabled",
              properties: {
                tier: "FREE",
                source: "App Store Notifications",
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
          console.log(payload.subtype);
          console.log("No action taken");
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
