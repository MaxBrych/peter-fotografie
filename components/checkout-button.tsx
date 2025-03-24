"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { Photo } from "@/lib/types"
import { createCheckoutSession } from "@/lib/stripe"

interface CheckoutButtonProps {
  photo: Photo
}

export default function CheckoutButton({ photo }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      const url = await createCheckoutSession(photo)
      window.location.href = url
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Error",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full bg-black text-white hover:bg-gray-800 py-6 text-base"
    >
      {isLoading ? "Processing..." : "Purchase Full Quality Image"}
    </Button>
  )
}

