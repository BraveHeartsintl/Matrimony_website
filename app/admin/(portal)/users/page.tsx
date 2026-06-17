"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { ADMIN_USERS } from "@/lib/mock/admin";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(ADMIN_USERS);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q)
    );
  }, [users, query]);

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "suspended" ? "active" : ("suspended" as const) }
          : u
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted">View, search, and manage registered members</p>
      </div>

      <Card>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted">
                <th className="pb-3 pr-4">Member</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">Plan</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Verified</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-border">
                  <td className="py-4 pr-4">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                  </td>
                  <td className="py-4 pr-4 text-muted">{user.location}</td>
                  <td className="py-4 pr-4">
                    <Badge variant={user.plan === "gold" ? "accent" : "default"}>
                      {user.plan}
                    </Badge>
                  </td>
                  <td className="py-4 pr-4">
                    <Badge
                      variant={
                        user.status === "active"
                          ? "success"
                          : user.status === "pending"
                            ? "warning"
                            : "default"
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-4 pr-4">
                    {user.verified ? (
                      <span className="text-accent">Yes</span>
                    ) : (
                      <span className="text-muted">Pending</span>
                    )}
                  </td>
                  <td className="py-4">
                    <Button
                      size="sm"
                      variant={user.status === "suspended" ? "primary" : "outline"}
                      onClick={() => toggleStatus(user.id)}
                    >
                      {user.status === "suspended" ? "Reactivate" : "Suspend"}
                    </Button>
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
