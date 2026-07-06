"use client";

import Card from "@/components/ui/Card";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { fetchAdminAnalytics, fetchAdminReports, fetchAdminUsers } from "@/lib/firebase/services/admin.service";
import { isFirestoreSeeded, seedMockProfiles } from "@/lib/firebase/services/seed.service";
import {
  CreditCard,
  Heart,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<Record<string, number>>({});
  const [recentUsers, setRecentUsers] = useState<Awaited<ReturnType<typeof fetchAdminUsers>>>([]);
  const [openReports, setOpenReports] = useState<Awaited<ReturnType<typeof fetchAdminReports>>>([]);
  const [seeded, setSeeded] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = async () => {
    setLoadError(null);
    try {
      const [stats, users, reports, seedStatus] = await Promise.all([
        fetchAdminAnalytics(),
        fetchAdminUsers(),
        fetchAdminReports(),
        isFirestoreSeeded(),
      ]);
      setAnalytics(stats);
      setRecentUsers(users.slice(0, 5));
      setOpenReports(reports.filter((r) => r.status !== "resolved"));
      setSeeded(seedStatus);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load admin data");
    }
  };

  useEffect(() => {
    void (async () => {
      await load();
      const seedStatus = await isFirestoreSeeded();
      if (!seedStatus) {
        setSeeding(true);
        try {
          const result = await seedMockProfiles();
          setSeedMessage(
            `Auto-loaded ${result.total} realistic UK demo profiles (${result.created} new, ${result.updated} updated).`
          );
          await load();
        } catch (err) {
          setSeedMessage(
            err instanceof Error
              ? err.message
              : "Could not auto-seed demo profiles. Use the button below to retry."
          );
        } finally {
          setSeeding(false);
        }
      }
    })();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMessage(null);
    try {
      const result = await seedMockProfiles();
      setSeedMessage(
        `Synced ${result.total} demo profiles (${result.created} new, ${result.updated} updated).`
      );
      await load();
    } finally {
      setSeeding(false);
    }
  };

  const stats = [
    { label: "Total Members", value: (analytics.totalUsers ?? 0).toLocaleString(), icon: Users },
    { label: "Active Today", value: (analytics.activeToday ?? 0).toLocaleString(), icon: TrendingUp },
    { label: "Verified Profiles", value: (analytics.verifiedProfiles ?? 0).toLocaleString(), icon: ShieldCheck },
    { label: "Premium Members", value: (analytics.premiumMembers ?? 0).toLocaleString(), icon: CreditCard },
    { label: "Success Stories", value: (analytics.successStories ?? 0).toLocaleString(), icon: Heart },
    { label: "Messages Sent", value: `${Math.round((analytics.messagesSent ?? 0) / 1000)}K`, icon: MessageSquare },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <SectionLabel>Admin</SectionLabel>
          <h1 className="font-display text-2xl font-bold text-foreground">Platform Overview</h1>
          <p className="text-sm text-muted">
            Live analytics from Firestore. Demo matches are realistic Brit Asian profiles across London,
            Birmingham, Bradford, Leicester, Leeds, Glasgow, Cardiff and more.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button onClick={() => void handleSeed()} disabled={seeding}>
            {seeding ? "Syncing…" : seeded ? "Sync Demo Matches" : "Seed Demo Profiles"}
          </Button>
          {seedMessage && <p className="text-xs text-muted">{seedMessage}</p>}
          {loadError && <p className="text-xs text-red-600">{loadError}</p>}
        </div>
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
                £{(analytics.monthlyRevenue ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-[6px] glass-subtle p-4">
              <p className="text-xs uppercase tracking-wider text-muted">New This Week</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                +{analytics.newThisWeek ?? 0}
              </p>
            </div>
            <div className="rounded-[6px] glass-subtle p-4">
              <p className="text-xs uppercase tracking-wider text-muted">Pending Verification</p>
              <p className="mt-1 text-2xl font-bold text-accent">
                {analytics.pendingVerification ?? 0}
              </p>
            </div>
            <div className="rounded-[6px] glass-subtle p-4">
              <p className="text-xs uppercase tracking-wider text-muted">Open Reports</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {analytics.openReports ?? 0}
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
