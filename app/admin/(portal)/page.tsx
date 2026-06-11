"use client";

import Card from "@/components/ui/Card";
import { ADMIN_ANALYTICS, ADMIN_REPORTS, ADMIN_USERS } from "@/lib/mock/admin";
import {
  CreditCard,
  Heart,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  { label: "Total Members", value: ADMIN_ANALYTICS.totalUsers.toLocaleString(), icon: Users, color: "from-primary to-primary-dark" },
  { label: "Active Today", value: ADMIN_ANALYTICS.activeToday.toLocaleString(), icon: TrendingUp, color: "from-emerald-500 to-emerald-600" },
  { label: "Verified Profiles", value: ADMIN_ANALYTICS.verifiedProfiles.toLocaleString(), icon: ShieldCheck, color: "from-blue-500 to-blue-600" },
  { label: "Premium Members", value: ADMIN_ANALYTICS.premiumMembers.toLocaleString(), icon: CreditCard, color: "from-accent to-amber-500" },
  { label: "Success Stories", value: ADMIN_ANALYTICS.successStories.toLocaleString(), icon: Heart, color: "from-rose-500 to-primary" },
  { label: "Messages Sent", value: `${(ADMIN_ANALYTICS.messagesSent / 1000).toFixed(0)}K`, icon: MessageSquare, color: "from-violet-500 to-violet-600" },
];

export default function AdminDashboardPage() {
  const recentUsers = ADMIN_USERS.slice(0, 5);
  const openReports = ADMIN_REPORTS.filter((r) => r.status !== "resolved");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-sm text-slate-500">Real-time analytics and key metrics (static demo data)</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-sm`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg font-bold">Revenue Summary</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Monthly Revenue</p>
              <p className="mt-1 text-2xl font-bold text-primary">
                £{ADMIN_ANALYTICS.monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">New This Week</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                +{ADMIN_ANALYTICS.newThisWeek}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Pending Verification</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                {ADMIN_ANALYTICS.pendingVerification}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Open Reports</p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {ADMIN_ANALYTICS.openReports}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold">Recent Registrations</h2>
          <div className="mt-4 divide-y divide-slate-100">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.location} &middot; {user.religion}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : user.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-display text-lg font-bold">Open Reports</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                <th className="pb-3 pr-4">Reporter</th>
                <th className="pb-3 pr-4">Reported</th>
                <th className="pb-3 pr-4">Reason</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {openReports.map((report) => (
                <tr key={report.id} className="border-b border-slate-50">
                  <td className="py-3 pr-4 font-medium">{report.reporterName}</td>
                  <td className="py-3 pr-4 text-slate-600">{report.reportedName}</td>
                  <td className="py-3 pr-4 text-slate-600">{report.reason}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      {report.status}
                    </span>
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
