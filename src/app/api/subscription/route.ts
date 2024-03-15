import { db } from "@/database/prisma";
import { Stripe } from "stripe";
import { NextResponse } from "next/server";
import type { SubTier } from "@prisma/client";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ status: 401, error: "No Stripe secret key" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ status: 401, error: "No signature" });
    }

    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error(
        `⚠️  Webhook signature verification failed:\n`,
        err.message,
      );
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
      const customerId = checkoutSessionCompleted.customer?.toString();

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
        // get tier from sub id
        const subscription = await stripe.subscriptions.retrieve(
          checkoutSessionCompleted.subscription as string,
        );

        const productId = subscription.items.data[0]?.price.id;

        if (!productId) {
          console.error(
            `⚠️  No product ID found in subscription ${subscription.id}`,
          );
          return NextResponse.json({
            status: 400,
            error: "No product ID found in subscription",
          });
        }

        const updatedUser = await db.user.update({
          where: { id: userId },
          data: { tier: getTier(productId), clerkId: customerId },
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

    // Subscription updated -> i.e. user has changed their subscription
    case "customer.subscription.updated": {
      const subscriptionUpdated = event.data.object;
      const customerId = subscriptionUpdated.customer as string;

      const productId = subscriptionUpdated.items.data[0]?.price.id;

      if (!productId) {
        console.error(
          `⚠️  No product ID found in subscription ${subscriptionUpdated.id}`,
        );
        return NextResponse.json({
          status: 400,
          error: "No product ID found in subscription",
        });
      }

      try {
        const newTier = getTier(productId);

        const updatedUser = await db.user.update({
          where: { clerkId: customerId },
          data: { tier: newTier },
        });
        console.log(`✅  Updated user to ${newTier}`, updatedUser);
      } catch (e) {
        console.error(`⚠️  Failed to update customer ${customerId}`, e);
        return NextResponse.json({
          status: 500,
          error: "Failed to update user",
        });
      }

      break;
    }

    // Subscription deleted -> i.e. user has cancelled their subscription
    case "customer.subscription.deleted": {
      const subscriptionDeleted = event.data.object;
      const customerId = subscriptionDeleted.customer as string;

      if (!customerId) {
        console.error(
          `⚠️  No user ID found in subscription ${subscriptionDeleted.id}`,
        );
        return NextResponse.json({
          status: 400,
          error: "No user ID found in subscription",
        });
      }

      try {
        const updatedUser = await db.user.update({
          where: { clerkId: customerId },
          data: { tier: "FREE" },
        });
        console.log(`✅  Updated user to FREE`, updatedUser);
      } catch (e) {
        console.error(`⚠️  Failed to update customer ${customerId}`, e);
        return NextResponse.json({
          status: 500,
          error: "Failed to update user",
        });
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ status: 200 });
}

function getTier(productId: string): SubTier {
  const FREE_PRICE = "price_1OuH58BU3BMyGKUcRtBtJV15";
  const PRO_PRICE = "price_1OuH5bBU3BMyGKUcWuir0DxV";

  if (productId === FREE_PRICE) {
    return "FREE";
  }

  if (productId === PRO_PRICE) {
    return "PRO";
  }

  throw new Error(`Unknown product ID ${productId}`);
}
