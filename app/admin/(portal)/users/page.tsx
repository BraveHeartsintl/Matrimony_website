"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import {
  deleteAdminUser,
  fetchAdminUsers,
  updateUserAccountStatus,
} from "@/lib/firebase/services/admin.service";
import type { AdminUser } from "@/lib/mock/admin";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        setUsers(await fetchAdminUsers());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q)
    );
  }, [users, query]);

  const toggleStatus = async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const next = user.status === "suspended" ? "active" : "suspended";
    await updateUserAccountStatus(id, next);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: next } : u))
    );
  };

  const handleDelete = async (user: AdminUser) => {
    const confirmed = window.confirm(
      `Delete ${user.name} (${user.email})? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(user.id);
    try {
      await deleteAdminUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
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
          {loading ? (
            <p className="text-sm text-muted">Loading users…</p>
          ) : (
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
                    <td className="py-3 pr-4">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-muted">{user.location}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="accent">{user.plan}</Badge>
                    </td>
                    <td className="py-3 pr-4 capitalize text-muted">{user.status}</td>
                    <td className="py-3 pr-4">{user.verified ? "Yes" : "No"}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => void toggleStatus(user.id)}>
                          {user.status === "suspended" ? "Activate" : "Suspend"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={deletingId === user.id}
                          onClick={() => void handleDelete(user)}
                        >
                          {deletingId === user.id ? "Deleting…" : "Delete"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
