"use client"

import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F0F8] p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-12 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Success</h1>
        <p className="text-gray-600 mb-8">
          Your payment has been processed successfully. Your subscription is now active.
        </p>

        <Link href="/dashboard">
          <Button className="w-full bg-purple-600 hover:bg-purple-700">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
