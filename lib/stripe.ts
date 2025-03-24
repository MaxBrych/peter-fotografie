import Stripe from "stripe"
import type { Photo } from "./types"

// Check if the STRIPE_SECRET_KEY is available
const stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  throw new Error("Missing environment variable: STRIPE_SECRET_KEY")
}

// Initialize Stripe with the secret key
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia",
})

export async function createCheckoutSession(photo: Photo): Promise<string> {
  // Ensure we have a base URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (!baseUrl) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_BASE_URL")
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: photo.title,
              description: photo.description || "",
              images: [photo.imageUrl || ""],
            },
            unit_amount: Math.round(photo.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/photos/${photo.slug}`,
    })

    if (!session.url) {
      throw new Error("Failed to create checkout session URL")
    }

    return session.url
  } catch (error) {
    console.error("Stripe checkout error:", error)
    throw new Error("Failed to create checkout session")
  }
}

