import { db } from "@/database/prisma";
import { Stripe } from "stripe";
import { NextResponse } from "next/server";
import type { SubTier } from "@prisma/client";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(null, {
      status: 401,
      statusText: "Unauthorized: No Stripe key",
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(null, {
        status: 401,
        statusText: "Unauthorized: No signature",
      });
    }

    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    let logMessage = `Webhook signature verification failed`;
    if (err instanceof Error) logMessage += `: ${err.message}`;
    console.error(logMessage);
    return NextResponse.json(null, {
      status: 401,
      statusText: "Unauthorized: " + logMessage,
    });
  }

  // Handle the events
  switch (event.type) {
    // Checkout completed -> i.e. user has paid
    case "checkout.session.completed": {
      const checkoutSessionCompleted = event.data.object;

      const userId = checkoutSessionCompleted.client_reference_id;
      const customerId = checkoutSessionCompleted.customer?.toString();

      if (!userId) {
        const logMessage = `No user ID found in checkout session ${checkoutSessionCompleted.id}`;
        console.error(logMessage);
        return NextResponse.json(null, {
          status: 400,
          statusText: logMessage,
        });
      }

      try {
        // get tier from sub id
        const subscription = await stripe.subscriptions.retrieve(
          checkoutSessionCompleted.subscription as string,
        );

        const productId = subscription.items.data[0]?.price.id;

        if (!productId) {
          const logMessage = `No product ID found in subscription ${subscription.id}`;
          console.error(logMessage);
          return NextResponse.json(null, {
            status: 400,
            statusText: logMessage,
          });
        }

        await db.user.update({
          where: { id: userId },
          data: { tier: getTier(productId), clerkId: customerId },
        });
      } catch (e) {
        let logMessage = `⚠️  Failed to update user ${userId}`;
        if (e instanceof Error) logMessage += `: ${e.message}`;
        console.error(logMessage);
        return NextResponse.json(null, {
          status: 500,
          statusText: logMessage,
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
        const logMessage = `No product ID found in subscription ${subscriptionUpdated.id}`;
        console.error(logMessage);
        return NextResponse.json(null, {
          status: 400,
          statusText: logMessage,
        });
      }

      try {
        throw new Error("...TEST ERROR...");
        // await db.user.update({
        //   where: { clerkId: customerId },
        //   data: { tier: getTier(productId) },
        // });
      } catch (e) {
        let logMessage = `⚠️  Failed to update customer ${customerId}`;
        if (e instanceof Error) logMessage += `: ${e.message}`;
        console.error(logMessage);
        return NextResponse.json(null, {
          status: 500,
          statusText: logMessage,
        });
      }

      break;
    }

    // Subscription deleted -> i.e. user has cancelled their subscription
    case "customer.subscription.deleted": {
      const subscriptionDeleted = event.data.object;
      const customerId = subscriptionDeleted.customer as string;

      if (!customerId) {
        const logMessage = `No user ID found in subscription ${subscriptionDeleted.id}`;
        console.error(logMessage);
        return NextResponse.json(null, {
          status: 400,
          statusText: logMessage,
        });
      }

      try {
        await db.user.update({
          where: { clerkId: customerId },
          data: { tier: "FREE" },
        });
      } catch (e) {
        let logMessage = `⚠️  Failed to update customer ${customerId} subscription in deleted event`;
        if (e instanceof Error) logMessage += `: ${e.message}`;

        console.error(logMessage);
        return NextResponse.json(null, {
          status: 500,
          statusText: logMessage,
        });
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json(null, { status: 200 });
}

function getTier(productId: string): SubTier {
  const FREE_PRICE = process.env.STRIPE_SUB_FREE_PRICE;
  const PRO_PRICE = process.env.STRIPE_SUB_PRO_PRICE;

  if (productId === FREE_PRICE) {
    return "FREE";
  }

  if (productId === PRO_PRICE) {
    return "PRO";
  }

  throw new Error(`Unknown product ID ${productId}`);
}
