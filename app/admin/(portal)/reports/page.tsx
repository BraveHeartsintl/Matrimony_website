"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ADMIN_REPORTS } from "@/lib/mock/admin";
import { useState } from "react";

export default function AdminReportsPage() {
  const [reports, setReports] = useState(ADMIN_REPORTS);

  const updateStatus = (id: string, status: "open" | "reviewing" | "resolved") => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Content Moderation</h1>
        <p className="text-sm text-muted">Review member reports and take action</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Reporter</th>
                <th className="pb-3 pr-4">Reported User</th>
                <th className="pb-3 pr-4">Reason</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-border">
                  <td className="py-4 pr-4 text-muted">{report.createdAt}</td>
                  <td className="py-4 pr-4 font-medium">{report.reporterName}</td>
                  <td className="py-4 pr-4">{report.reportedName}</td>
                  <td className="py-4 pr-4 text-muted">{report.reason}</td>
                  <td className="py-4 pr-4">
                    <Badge
                      variant={
                        report.status === "resolved"
                          ? "success"
                          : report.status === "reviewing"
                            ? "warning"
                            : "default"
                      }
                    >
                      {report.status}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      {report.status !== "reviewing" && report.status !== "resolved" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(report.id, "reviewing")}>
                          Review
                        </Button>
                      )}
                      {report.status !== "resolved" && (
                        <Button size="sm" onClick={() => updateStatus(report.id, "resolved")}>
                          Resolve
                        </Button>
                      )}
                    </div>
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
