import { db } from "@/database/prisma";
import { Stripe } from "stripe";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// https://docs.stripe.com/webhooks#local-listener

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ status: 401, error: "No Stripe secret key" });
  }

  if (!req.body) {
    return NextResponse.json({ status: 400, error: "No request body" });
  }

  const payload = await req.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Get the signature sent by Stripe
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ status: 401, error: "No signature" });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error(`⚠️  Webhook signature verification failed.`, err.message);
    } else {
      console.error(`⚠️  Webhook signature verification failed.`);
    }

    return NextResponse.json({
      status: 401,
      error: "Webhook signature verification failed",
    });
  }

  console.log(`✅  Webhook verified: ${event.id}`);
  console.log(`🔍  Event type: ${event.type}`);
  console.log(`🔍  Event data:`, event.data.object);

  // Handle the event
  switch (event.type) {
    // Checkout completed -> i.e. user has paid
    case "checkout.session.completed": {
      const checkoutSessionCompleted = event.data.object;

      const userId = checkoutSessionCompleted.client_reference_id;

      if (!userId) {
        console.error(
          `⚠️  No user ID found in checkout session ${checkoutSessionCompleted.id}`,
        );
        return NextResponse.json({
          status: 400,
          error: "No user ID found in checkout session",
        });
      }

      try {
        const updatedUser = await db.user.update({
          where: { id: userId },
          data: { tier: "PRO" },
        });
        console.log(`✅  Updated user to PRO`, updatedUser);
      } catch (e) {
        console.error(`⚠️  Failed to update user ${userId}`, e);
        return NextResponse.json({
          status: 500,
          error: "Failed to update user",
        });
      }

      break;
    }

    // // Subscription updated -> i.e. user has changed their subscription
    // case "customer.subscription.updated": {
    //   const subscriptionUpdated = event.data.object;

    //   const subscriptionId = subscriptionUpdated.id;
    //   const userId = subscriptionUpdated.customer;

    //   if (!userId) {
    //     console.error(`⚠️  No user ID found in subscription ${subscriptionId}`);
    //     return NextResponse.json({
    //       status: 400,
    //       error: "No user ID found in subscription",
    //     });
    //   }

    //   const newTier = subscriptionUpdated.items.data[0]?.price.product;
    //   try {
    //     const updatedUser = await db.user.update({
    //       where: { id: userId },
    //       data: { tier: newTier },
    //     });
    //     console.log(`✅  Updated user to ${newTier}`, updatedUser);
    //   } catch (e) {
    //     console.error(`⚠️  Failed to update user ${userId}`, e);
    //     return NextResponse.json({
    //       status: 500,
    //       error: "Failed to update user",
    //     });
    //   }

    //   break;
    // }

    // // Subscription deleted -> i.e. user has cancelled their subscription
    // case "customer.subscription.deleted": {
    //   const subscriptionDeleted = event.data.object;

    //   const userId = subscriptionDeleted.customer;

    //   if (!userId) {
    //     console.error(
    //       `⚠️  No user ID found in subscription ${subscriptionDeleted.id}`,
    //     );
    //     return NextResponse.json({
    //       status: 400,
    //       error: "No user ID found in subscription",
    //     });
    //   }

    //   try {
    //     const updatedUser = await db.user.update({
    //       where: { id: userId },
    //       data: { tier: "FREE" },
    //     });
    //     console.log(`✅  Updated user to FREE`, updatedUser);
    //   } catch (e) {
    //     console.error(`⚠️  Failed to update user ${userId}`, e);
    //     return NextResponse.json({
    //       status: 500,
    //       error: "Failed to update user",
    //     });
    //   }

    //   break;
    // }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ status: 200 });
}
