"use client"

import { useEffect, useState } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/toast-provider"
// If subscriptionApi is in a separate file, import it instead of defining here.
// import { subscriptionApi } from "@/lib/subscription-api"

// 💳 Subscription APIs (if you keep it in this file)
import { getApi } from "@/lib/api" // adjust to your real path
export const subscriptionApi = {
  getAll: () => getApi().get("/subscription/get-all"),
}

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [discountCode, setDiscountCode] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const [plans, setPlans] = useState<any[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [isPlansLoading, setIsPlansLoading] = useState(true)

  const { addToast } = useToast()

  // Load subscription plans from API
  useEffect(() => {
    let mounted = true

    const loadPlans = async () => {
      try {
        const res = await subscriptionApi.getAll()
        const apiPlans = res?.data?.data ?? []

        if (!mounted) return

        setPlans(apiPlans)
        if (apiPlans.length && !selectedPlanId) {
          setSelectedPlanId(apiPlans[0]._id)
        }
      } catch (error) {
        console.error(error)
        addToast({
          title: "Unable to load plans",
          description: "Please try again in a few minutes.",
          type: "error",
        })
      } finally {
        if (mounted) setIsPlansLoading(false)
      }
    }

    loadPlans()

    return () => {
      mounted = false
    }
  }, [addToast, selectedPlanId])

  const selectedPlan = plans.find((p) => p._id === selectedPlanId)

  // Simple totals calculation
  const subtotal = selectedPlan?.price ?? 0
  const taxRate = 0.02 // 2% – matches 149.99 -> 152.99 example
  const tax = Math.round(subtotal * taxRate * 100) / 100
  const totalBeforeDiscount = subtotal + tax
  const total = Math.max(totalBeforeDiscount - discountAmount, 0)

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return

    const code = discountCode.trim().toUpperCase()

    // Example promo logic – adjust to real one
    if (code === "SAVE10") {
      const value = Math.round(totalBeforeDiscount * 0.1 * 100) / 100
      setDiscountAmount(value)
      addToast({
        title: "Discount applied",
        description: "Promo code SAVE10 has been applied.",
        type: "success",
      })
    } else {
      setDiscountAmount(0)
      addToast({
        title: "Invalid code",
        description: "Please check your code and try again.",
        type: "error",
      })
    }
  }

  const handlePayment = async () => {
    if (!selectedPlan) {
      addToast({
        title: "No plan selected",
        description: "Please choose a subscription plan before paying.",
        type: "error",
      })
      return
    }

    if (paymentMethod === "card" && (!cardName || !cardNumber || !expiryDate || !cvv)) {
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
        description: `Your payment of ${selectedPlan.currency} ${total.toFixed(
          2
        )} for ${selectedPlan.name} is being processed. You will be redirected shortly.`,
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
            <p className="text-gray-500 mb-8">
              {selectedPlan
                ? `Complete your checkout for the ${selectedPlan.name}.`
                : "Complete your checkout pricing."}
            </p>

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
              disabled={isProcessing || !selectedPlan}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {isProcessing
                ? "Processing..."
                : selectedPlan
                ? `Pay ${selectedPlan.currency} ${total.toFixed(2)}`
                : "Select a plan first"}
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

          {/* Plan selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">Choose a plan</label>
            {isPlansLoading ? (
              <div className="text-sm text-gray-500">Loading plans...</div>
            ) : plans.length ? (
              <select
                value={selectedPlanId ?? ""}
                onChange={(e) => {
                  setSelectedPlanId(e.target.value || null)
                  setDiscountAmount(0)
                }}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name} – {plan.currency} {plan.price}
                    {plan.billingCycle && ` / ${plan.billingCycle}`}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-red-500">No active plans available.</div>
            )}
          </div>

          {selectedPlan && (
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">{selectedPlan.name}</span>
                <span className="font-semibold text-gray-900">
                  {selectedPlan.currency} {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {selectedPlan.currency} {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (2%)</span>
                <span className="font-semibold text-gray-900">
                  {selectedPlan.currency} {tax.toFixed(2)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- {selectedPlan.currency} {discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">Gift or discount code</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="bg-white"
              />
              <Button variant="outline" type="button" onClick={handleApplyDiscount}>
                Apply
              </Button>
            </div>
          </div>

          <div className="space-y-2 pt-6 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">
                {selectedPlan ? `${selectedPlan.currency} ${subtotal.toFixed(2)}` : "-"}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-gray-900">
                {selectedPlan ? `${selectedPlan.currency} ${total.toFixed(2)}` : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
