"use client";

import Card from "@/components/ui/Card";
import SectionLabel from "@/components/ui/SectionLabel";
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
  { label: "Total Members", value: ADMIN_ANALYTICS.totalUsers.toLocaleString(), icon: Users },
  { label: "Active Today", value: ADMIN_ANALYTICS.activeToday.toLocaleString(), icon: TrendingUp },
  { label: "Verified Profiles", value: ADMIN_ANALYTICS.verifiedProfiles.toLocaleString(), icon: ShieldCheck },
  { label: "Premium Members", value: ADMIN_ANALYTICS.premiumMembers.toLocaleString(), icon: CreditCard },
  { label: "Success Stories", value: ADMIN_ANALYTICS.successStories.toLocaleString(), icon: Heart },
  { label: "Messages Sent", value: `${(ADMIN_ANALYTICS.messagesSent / 1000).toFixed(0)}K`, icon: MessageSquare },
];

export default function AdminDashboardPage() {
  const recentUsers = ADMIN_USERS.slice(0, 5);
  const openReports = ADMIN_REPORTS.filter((r) => r.status !== "resolved");

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>Admin</SectionLabel>
        <h1 className="font-display text-2xl font-bold text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted">Real-time analytics and key metrics (static demo data)</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-[6px] glass-subtle">
                <stat.icon className="h-5 w-5 text-accent" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card hover>
          <h2 className="font-display text-lg font-bold text-foreground">Revenue Summary</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-[6px] glass-subtle p-4">
              <p className="text-xs uppercase tracking-wider text-muted">Monthly Revenue</p>
              <p className="mt-1 text-2xl font-bold text-accent">
                £{ADMIN_ANALYTICS.monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-[6px] glass-subtle p-4">
              <p className="text-xs uppercase tracking-wider text-muted">New This Week</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                +{ADMIN_ANALYTICS.newThisWeek}
              </p>
            </div>
            <div className="rounded-[6px] glass-subtle p-4">
              <p className="text-xs uppercase tracking-wider text-muted">Pending Verification</p>
              <p className="mt-1 text-2xl font-bold text-accent">
                {ADMIN_ANALYTICS.pendingVerification}
              </p>
            </div>
            <div className="rounded-[6px] glass-subtle p-4">
              <p className="text-xs uppercase tracking-wider text-muted">Open Reports</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {ADMIN_ANALYTICS.openReports}
              </p>
            </div>
          </div>
        </Card>

        <Card hover>
          <h2 className="font-display text-lg font-bold text-foreground">Recent Registrations</h2>
          <div className="mt-4 divide-y divide-border">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted">
                    {user.location} &middot; {user.religion}
                  </p>
                </div>
                <span className="rounded glass-subtle px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-muted">
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card hover>
        <h2 className="font-display text-lg font-bold text-foreground">Open Reports</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                <th className="pb-3 pr-4">Reporter</th>
                <th className="pb-3 pr-4">Reported</th>
                <th className="pb-3 pr-4">Reason</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {openReports.map((report) => (
                <tr key={report.id} className="border-b border-border">
                  <td className="py-3 pr-4 font-medium text-foreground">{report.reporterName}</td>
                  <td className="py-3 pr-4 text-muted">{report.reportedName}</td>
                  <td className="py-3 pr-4 text-muted">{report.reason}</td>
                  <td className="py-3">
                    <span className="rounded border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-accent">
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
