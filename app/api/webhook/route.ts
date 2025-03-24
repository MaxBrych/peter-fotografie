import { NextResponse } from "next/server"
import Stripe from "stripe"

// Check if the required environment variables are available
const stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY
const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET


if (!stripeSecretKey) {
  throw new Error("Missing environment variable: STRIPE_SECRET_KEY")
}

if (!webhookSecret) {
  throw new Error("Missing environment variable: STRIPE_WEBHOOK_SECRET")
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia",
})

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
    }

    if (!webhookSecret) {
      return NextResponse.json({ error: "Missing webhook secret" }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      // Handle successful payment
      console.log("Payment successful for session:", session.id)

      // Here you would typically:
      // 1. Update your database
      // 2. Send confirmation emails
      // 3. Generate download links
      // etc.
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error.message)
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }
}

