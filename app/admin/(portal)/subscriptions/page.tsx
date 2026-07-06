"use client";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { fetchAdminSubscriptions } from "@/lib/firebase/services/admin.service";
import type { AdminSubscription } from "@/lib/mock/admin";
import { useEffect, useState } from "react";

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);

  useEffect(() => {
    void fetchAdminSubscriptions().then(setSubscriptions);
  }, []);

  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const totalRevenue = subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Subscription Management</h1>
        <p className="text-sm text-muted">Monitor active plans from Firestore subscriptions</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="text-center">
          <p className="text-3xl font-bold text-accent">{activeCount}</p>
          <p className="text-sm text-muted">Active Subscriptions</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-accent">£{totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-muted">Active MRR</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-accent">
            {subscriptions.filter((s) => s.status === "cancelled").length}
          </p>
          <p className="text-sm text-muted">Cancelled</p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted">
                <th className="pb-3 pr-4">Member</th>
                <th className="pb-3 pr-4">Plan</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Billing</th>
                <th className="pb-3 pr-4">Renews</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-border">
                  <td className="py-4 pr-4 font-medium">{sub.userName}</td>
                  <td className="py-4 pr-4">
                    <Badge variant={sub.plan === "Gold" ? "accent" : "default"}>{sub.plan}</Badge>
                  </td>
                  <td className="py-4 pr-4">£{sub.amount.toFixed(2)}</td>
                  <td className="py-4 pr-4 capitalize text-muted">{sub.billing}</td>
                  <td className="py-4 pr-4 text-muted">{sub.renewsAt || "—"}</td>
                  <td className="py-4">
                    <Badge
                      variant={
                        sub.status === "active"
                          ? "success"
                          : sub.status === "cancelled"
                            ? "warning"
                            : "default"
                      }
                    >
                      {sub.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
