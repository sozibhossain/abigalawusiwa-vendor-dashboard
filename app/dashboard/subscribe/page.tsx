"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Basic",
    price: "$19",
    period: "/month",
    description: "Perfect for getting started",
    features: ["Up to 10 products", "Basic analytics", "Email support", "Standard commission rate"],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "For growing businesses",
    features: [
      "Up to 100 products",
      "Advanced analytics",
      "Priority support",
      "Reduced commission rate",
      "Custom branding",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large operations",
    features: [
      "Unlimited products",
      "Real-time analytics",
      "24/7 dedicated support",
      "Lowest commission rate",
      "Custom integrations",
      "API access",
    ],
    highlighted: false,
  },
]

export default function SubscribePage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Pricing</h1>
        <p className="text-gray-600">Choose the perfect plan for your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.highlighted ? "border-blue-600 border-2 shadow-lg" : ""}>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>

              <Button
                className={`w-full mb-6 ${plan.highlighted ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-200 text-gray-900 hover:bg-gray-300"}`}
              >
                Choose Plan
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
    </div>
  )
}
