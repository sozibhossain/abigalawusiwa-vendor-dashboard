"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { subscriptionApi } from "@/lib/api"
import axios from "axios"
import { useRouter } from "next/navigation"
import { ApiSubscriptionPlan, NormalizedPlan } from "@/types/subscription"
import { useSession } from "next-auth/react"

// Convert billing type to readable format
function getPeriod(billingCycle: string, customDurationDays?: number | null) {
  switch (billingCycle) {
    case "monthly":
      return "/month"
    case "yearly":
      return "/year"
    case "custom":
      return customDurationDays ? `/${customDurationDays} days` : "/custom"
    default:
      return ""
  }
}

// Merge usageLimits into features nicely
function buildFeatures(plan: ApiSubscriptionPlan) {
  const features = [...plan.features]

  if (plan.usageLimits) {
    const { maxProducts, maxStores, maxUsers, custom } = plan.usageLimits

    if (maxProducts) features.unshift(`Up to ${maxProducts} products`)
    if (maxStores) features.unshift(`Up to ${maxStores} stores`)
    if (maxUsers) features.unshift(`Up to ${maxUsers} users`)

    if (custom) {
      Object.entries(custom).forEach(([k, v]) =>
        features.push(`${k}: ${v}`)
      )
    }
  }

  return features
}

// Normalize raw backend plan → UI plan
function normalizePlan(plan: ApiSubscriptionPlan): NormalizedPlan {
  return {
    id: plan._id,
    name: plan.name,
    description: plan.description,
    price: plan.price,
    currency: plan.currency,
    period: getPeriod(plan.billingCycle, plan.customDurationDays),
    features: buildFeatures(plan),
    highlighted: plan.billingCycle === "monthly" && plan.price > 0,
  }
}

export default function SubscribePage() {
  const [plans, setPlans] = useState<NormalizedPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const session = useSession()
  const userId = session?.data?.user?.id
  console.log(userId)

  // Fetch subscription plans
  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await subscriptionApi.getAll()
        const rawPlans: ApiSubscriptionPlan[] = res.data?.data ?? []
        setPlans(rawPlans.map(normalizePlan))
      } catch (err) {
        console.error(err)
        setError("Failed to load subscription plans.")
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  // Initiate payment on button click
  async function handleSelectPlan(plan: NormalizedPlan) {
    try {
      const userId = session?.data?.user?.id // or use auth store

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/initiate`, {
        type: "subscription",
        userId,
        planId: plan.id,
        fingerprint: "example-fp",
      })

      if (res.data?.data?.paymentUrl) {
        window.location.href = res.data.data.paymentUrl
      } else {
        alert("Failed to start payment")
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Payment error")
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Pricing</h1>
        <p className="text-gray-600">Choose the perfect plan for your business</p>
      </div>

      {loading && <p className="text-gray-600">Loading plans...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={plan.highlighted ? "border-blue-600 border-2 shadow-lg" : ""}
            >
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.currency} {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>

                <Button
                  className={`w-full mb-6 ${
                    plan.highlighted
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  Subscribe
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
