"use client";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { ADMIN_SUBSCRIPTIONS } from "@/lib/mock/admin";

export default function AdminSubscriptionsPage() {
  const activeCount = ADMIN_SUBSCRIPTIONS.filter((s) => s.status === "active").length;
  const totalRevenue = ADMIN_SUBSCRIPTIONS.filter((s) => s.status === "active").reduce(
    (sum, s) => sum + s.amount,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Subscription Management</h1>
        <p className="text-sm text-slate-500">Monitor active plans and billing (Stripe integration in Phase 2)</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary">{activeCount}</p>
          <p className="text-sm text-slate-500">Active Subscriptions</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-emerald-600">£{totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-slate-500">Active MRR</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-amber-600">
            {ADMIN_SUBSCRIPTIONS.filter((s) => s.status === "cancelled").length}
          </p>
          <p className="text-sm text-slate-500">Cancelled</p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                <th className="pb-3 pr-4">Member</th>
                <th className="pb-3 pr-4">Plan</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Billing</th>
                <th className="pb-3 pr-4">Renews</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_SUBSCRIPTIONS.map((sub) => (
                <tr key={sub.id} className="border-b border-slate-50">
                  <td className="py-4 pr-4 font-medium">{sub.userName}</td>
                  <td className="py-4 pr-4">
                    <Badge variant={sub.plan === "Gold" ? "accent" : "default"}>{sub.plan}</Badge>
                  </td>
                  <td className="py-4 pr-4">£{sub.amount.toFixed(2)}</td>
                  <td className="py-4 pr-4 capitalize text-slate-600">{sub.billing}</td>
                  <td className="py-4 pr-4 text-slate-500">{sub.renewsAt}</td>
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
