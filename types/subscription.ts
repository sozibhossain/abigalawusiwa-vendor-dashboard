export interface UsageLimits {
  maxProducts?: number
  maxStores?: number
  maxUsers?: number
  custom?: Record<string, string | number>
}

export interface ApiSubscriptionPlan {
  _id: string
  name: string
  description: string
  price: number
  currency: string
  billingCycle: "monthly" | "yearly" | "custom" | "N/A"
  trialPeriodDays?: number
  isActive: boolean
  usageLimits?: UsageLimits
  features: string[]
  customDurationDays?: number | null
  createdAt: string
  updatedAt: string
}

export interface NormalizedPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  period: string
  features: string[]
  highlighted: boolean
}
