import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/toaster"
import "@/app/globals.css"

export const metadata = {
  title: "TALVA Photography",
  description: "A beautiful photo gallery with high-quality photographs available for purchase",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'