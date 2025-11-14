"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/toast-provider"

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [discountCode, setDiscountCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { addToast } = useToast()

  const handlePayment = async () => {
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      addToast({
        title: "Please fill all fields",
        type: "error",
      })
      return
    }

    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      addToast({
        title: "Payment Processing",
        description: "Your payment is being processed. You will be redirected shortly.",
        type: "success",
      })
      setTimeout(() => {
        window.location.href = "/dashboard/subscribe/success"
      }, 2000)
    }, 2000)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/dashboard/subscribe" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
        <ChevronLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="grid grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment</h1>
            <p className="text-gray-500 mb-8">Complete your checkout pricing</p>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-900 mb-2">Pay With:</label>
              <div className="flex gap-4">
                {["card", "paypal", "crypto"].map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 capitalize">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Card Name</label>
                  <Input
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Card Number</label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Expiration Date</label>
                    <Input
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">CVV</label>
                    <Input
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">
                Your personal data will be used to process your order, support your experience throughout this website,
                and for other purposes described in our privacy policy.
              </p>
            </div>

            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {isProcessing ? "Processing..." : "Pay Instantly $152.99"}
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

          <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-600">Professional Plan</span>
              <span className="font-semibold text-gray-900">$149.99</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">$149.99</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">Gift or discount code</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="bg-white"
              />
              <Button variant="outline">Apply</Button>
            </div>
          </div>

          <div className="space-y-2 pt-6 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">$149.99</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-gray-900">$152.99</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
