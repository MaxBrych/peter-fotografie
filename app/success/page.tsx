import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
        <p className="text-muted-foreground mb-8">
          Your payment was successful and your photo will be available for download shortly. We've sent a confirmation
          email with all the details.
        </p>
        <Link href="/">
          <Button>Return to Gallery</Button>
        </Link>
      </div>
    </div>
  )
}

