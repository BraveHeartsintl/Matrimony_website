export interface AdminUser {
  id: string;
  name: string;
  email: string;
  location: string;
  religion: string;
  status: "active" | "suspended" | "pending";
  verified: boolean;
  plan: "free" | "silver" | "gold";
  joinedAt: string;
}

export interface AdminReport {
  id: string;
  reporterName: string;
  reportedName: string;
  reason: string;
  status: "open" | "reviewing" | "resolved";
  createdAt: string;
  
}

export interface AdminSubscription {
  id: string;
  userName: string;
  plan: string;
  amount: number;
  billing: "monthly" | "yearly";
  status: "active" | "cancelled" | "expired";
  renewsAt: string;
}

export const ADMIN_ANALYTICS = {
  totalUsers: 52847,
  activeToday: 3241,
  newThisWeek: 892,
  verifiedProfiles: 41203,
  pendingVerification: 156,
  openReports: 23,
  premiumMembers: 8420,
  monthlyRevenue: 68420,
  successStories: 5124,
  messagesSent: 128400,
};

export const ADMIN_USERS: AdminUser[] = [
  { id: "u1", name: "Priya Sharma", email: "priya@example.com", location: "London", religion: "Hindu", status: "active", verified: true, plan: "gold", joinedAt: "2025-11-02" },
  { id: "u2", name: "James Wilson", email: "james@example.com", location: "Manchester", religion: "Christian", status: "active", verified: true, plan: "silver", joinedAt: "2025-10-18" },
  { id: "u3", name: "Fatima Khan", email: "fatima@example.com", location: "Birmingham", religion: "Muslim", status: "active", verified: false, plan: "free", joinedAt: "2026-01-05" },
  { id: "u4", name: "Raj Patel", email: "raj@example.com", location: "Leeds", religion: "Hindu", status: "pending", verified: false, plan: "free", joinedAt: "2026-02-28" },
  { id: "u5", name: "Emily Clarke", email: "emily@example.com", location: "Bristol", religion: "Christian", status: "active", verified: true, plan: "gold", joinedAt: "2025-09-14" },
  { id: "u6", name: "Ahmed Hassan", email: "ahmed@example.com", location: "Glasgow", religion: "Muslim", status: "suspended", verified: true, plan: "silver", joinedAt: "2025-08-22" },
  { id: "u7", name: "Sophie Turner", email: "sophie@example.com", location: "Edinburgh", religion: "No Religion", status: "active", verified: true, plan: "free", joinedAt: "2026-03-01" },
  { id: "u8", name: "Vikram Singh", email: "vikram@example.com", location: "Leicester", religion: "Sikh", status: "active", verified: false, plan: "free", joinedAt: "2026-03-10" },
];

export const ADMIN_REPORTS: AdminReport[] = [
  { id: "r1", reporterName: "Emily Clarke", reportedName: "Unknown User", reason: "Inappropriate messages", status: "open", createdAt: "2026-03-08" },
  { id: "r2", reporterName: "James Wilson", reportedName: "Ahmed Hassan", reason: "Fake profile suspected", status: "reviewing", createdAt: "2026-03-05" },
  { id: "r3", reporterName: "Priya Sharma", reportedName: "Spam Account", reason: "Repeated unsolicited contact", status: "resolved", createdAt: "2026-02-20" },
  { id: "r4", reporterName: "Fatima Khan", reportedName: "Profile Misrepresentation", reason: "Photos do not match", status: "open", createdAt: "2026-03-11" },
];

export const ADMIN_SUBSCRIPTIONS: AdminSubscription[] = [
  { id: "s1", userName: "Priya Sharma", plan: "Gold", amount: 29.99, billing: "monthly", status: "active", renewsAt: "2026-04-02" },
  { id: "s2", userName: "James Wilson", plan: "Silver", amount: 14.99, billing: "monthly", status: "active", renewsAt: "2026-03-28" },
  { id: "s3", userName: "Emily Clarke", plan: "Gold", amount: 249.99, billing: "yearly", status: "active", renewsAt: "2026-09-14" },
  { id: "s4", userName: "Ahmed Hassan", plan: "Silver", amount: 14.99, billing: "monthly", status: "cancelled", renewsAt: "2026-03-15" },
  { id: "s5", userName: "Sophie Turner", plan: "Silver", amount: 149.99, billing: "yearly", status: "expired", renewsAt: "2026-01-10" },
];

export const PENDING_VERIFICATIONS = ADMIN_USERS.filter((u) => !u.verified);
