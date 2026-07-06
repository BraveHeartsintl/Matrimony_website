import { getFirebaseDb } from "@/lib/firebase/config";
import { timestampToIso } from "@/lib/firebase/converters";
import type { SubscriptionPlan } from "@/lib/types";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export interface UserSubscription {
  planId: string;
  status: "active" | "cancelled" | "expired";
  renewsAt?: string;
  billing?: "monthly" | "yearly";
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const snap = await getDoc(doc(getFirebaseDb(), "subscriptions", userId));
  if (!snap.exists()) return null;
  const data = snap.data() as Record<string, unknown>;
  return {
    planId: String(data.planId ?? "free"),
    status: (data.status as UserSubscription["status"]) ?? "active",
    renewsAt: timestampToIso(data.renewsAt),
    billing: data.billing as UserSubscription["billing"],
  };
}

export async function updateUserSubscriptionPlan(
  userId: string,
  planId: string,
  billing: "monthly" | "yearly"
): Promise<void> {
  await setDoc(
    doc(getFirebaseDb(), "subscriptions", userId),
    {
      planId,
      billing,
      status: "active",
      updatedAt: serverTimestamp(),
      renewsAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    features: ["Browse limited profiles", "Send 3 interests/month", "Basic search"],
  },
  {
    id: "silver",
    name: "Silver",
    priceMonthly: 14.99,
    priceYearly: 149.99,
    features: ["Unlimited interests", "See who viewed you", "Advanced filters", "Priority support"],
    popular: true,
  },
  {
    id: "gold",
    name: "Gold",
    priceMonthly: 29.99,
    priceYearly: 249.99,
    features: ["Everything in Silver", "Direct messaging", "Profile boost", "Verified badge priority"],
  },
];

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((p) => p.id === planId);
}
