import type { SubscriptionPlan } from "../types";

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "Create profile",
      "Browse limited profiles",
      "Send 3 interests per month",
      "Basic search filters",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    priceMonthly: 19.99,
    priceYearly: 179.99,
    popular: true,
    features: [
      "Unlimited profile views",
      "Unlimited interests",
      "Advanced search filters",
      "See who viewed your profile",
      "Priority customer support",
      "Profile verification badge",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    priceMonthly: 34.99,
    priceYearly: 299.99,
    features: [
      "Everything in Premium",
      "Featured profile placement",
      "Personal matchmaker assistance",
      "Video profile upload",
      "Read receipts on messages",
      "Incognito browsing mode",
    ],
  },
];
