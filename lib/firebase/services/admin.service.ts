import { profileFromFirestore, timestampToIso, userFromFirestore } from "@/lib/firebase/converters";
import { getFirebaseDb } from "@/lib/firebase/config";
import { refreshPlatformStats } from "@/lib/firebase/services/platform.service";
import {
  getPendingVerifications,
  getProfile,
  getUser,
  resolveVerificationRequest,
  updateProfile,
} from "@/lib/firebase/services/profile.service";
import type { AdminReport, AdminSubscription, AdminUser } from "@/lib/mock/admin";
import {
  approveVerification,
  rejectVerification,
} from "@/lib/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export async function isAdminUser(uid: string): Promise<boolean> {
  const user = await getUser(uid);
  if (user?.role === "admin") return true;
  const { getFirebaseAuth } = await import("@/lib/firebase/config");
  const token = await getFirebaseAuth().currentUser?.getIdTokenResult();
  return token?.claims?.role === "admin";
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const db = getFirebaseDb();
  const [usersSnap, profilesSnap, subsSnap] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "profiles")),
    getDocs(collection(db, "subscriptions")),
  ]);

  const profiles = new Map(
    profilesSnap.docs.map((d) => [d.id, profileFromFirestore(d.id, d.data() as Record<string, unknown>)])
  );
  const subs = new Map(
    subsSnap.docs.map((d) => [d.id, d.data() as Record<string, unknown>])
  );

  return usersSnap.docs
    .filter((d) => (d.data() as Record<string, unknown>).role !== "admin")
    .map((d) => {
      const data = d.data() as Record<string, unknown>;
      const user = userFromFirestore(d.id, data);
      const profile = profiles.get(d.id);
      const sub = subs.get(d.id);
      const accountStatus = String(data.accountStatus ?? "active");
      return {
        id: d.id,
        name: user.name,
        email: user.email,
        location: profile?.location ?? "",
        religion: profile?.religion ?? "",
        status:
          accountStatus === "suspended"
            ? ("suspended" as const)
            : profile?.onboardingStatus === "verification_pending"
              ? ("pending" as const)
              : ("active" as const),
        verified: profile?.verified ?? false,
        plan: (String(sub?.planId ?? "free") as AdminUser["plan"]) ?? "free",
        joinedAt: user.createdAt.split("T")[0],
      };
    });
}

export async function fetchAdminReports(): Promise<AdminReport[]> {
  const db = getFirebaseDb();
  const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as Record<string, unknown>;
    return {
      id: d.id,
      reporterName: String(data.reporterName ?? "Member"),
      reportedName: String(data.reportedName ?? "Unknown"),
      reason: String(data.reason ?? ""),
      status: (data.status as AdminReport["status"]) ?? "open",
      createdAt: timestampToIso(data.createdAt)?.split("T")[0] ?? "",
    };
  });
}

export async function fetchAdminSubscriptions(): Promise<AdminSubscription[]> {
  const db = getFirebaseDb();
  const [subsSnap, usersSnap] = await Promise.all([
    getDocs(collection(db, "subscriptions")),
    getDocs(collection(db, "users")),
  ]);
  const users = new Map(
    usersSnap.docs.map((d) => [d.id, userFromFirestore(d.id, d.data() as Record<string, unknown>)])
  );

  return subsSnap.docs.map((d) => {
    const data = d.data() as Record<string, unknown>;
    const user = users.get(d.id);
    const planId = String(data.planId ?? "free");
    return {
      id: d.id,
      userName: user?.name ?? "Member",
      plan: planId.charAt(0).toUpperCase() + planId.slice(1),
      amount: planId === "gold" ? 29.99 : planId === "silver" ? 14.99 : 0,
      billing: "monthly" as const,
      status: (data.status as AdminSubscription["status"]) ?? "active",
      renewsAt: timestampToIso(data.renewsAt)?.split("T")[0] ?? "",
    };
  });
}

export async function approveMemberVerification(userId: string): Promise<void> {
  const profile = await getProfile(userId);
  const user = await getUser(userId);
  if (!profile || !user) return;

  const updated = approveVerification(profile);
  await updateProfile(userId, { name: user.name, email: user.email }, updated);
  await resolveVerificationRequest(userId, "approved");
}

export async function rejectMemberVerification(userId: string, reason: string): Promise<void> {
  const profile = await getProfile(userId);
  const user = await getUser(userId);
  if (!profile || !user) return;

  const updated = rejectVerification(profile, reason);
  await updateProfile(userId, { name: user.name, email: user.email }, updated);
  await resolveVerificationRequest(userId, "rejected");
}

export async function updateUserAccountStatus(
  userId: string,
  accountStatus: "active" | "suspended"
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), "users", userId), {
    accountStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function updateReportStatus(
  reportId: string,
  status: AdminReport["status"]
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), "reports", reportId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function fetchAdminAnalytics(): Promise<Record<string, number>> {
  await refreshPlatformStats();

  const db = getFirebaseDb();
  const [aggregateSnap, reportsSnap, subsSnap, pending] = await Promise.all([
    getDoc(doc(db, "platformStats", "aggregate")),
    getDocs(query(collection(db, "reports"), where("status", "==", "open"))),
    getDocs(query(collection(db, "subscriptions"), where("planId", "in", ["silver", "gold"]))),
    getPendingVerifications(),
  ]);

  const data = (aggregateSnap.data() ?? {}) as Record<string, number>;

  return {
    totalUsers: Number(data.totalMembers ?? 0),
    activeToday: Number(data.totalMembers ?? 0),
    newThisWeek: 0,
    verifiedProfiles: Number(data.verifiedProfiles ?? 0),
    pendingVerification: pending.length,
    openReports: reportsSnap.size,
    premiumMembers: subsSnap.size,
    monthlyRevenue: subsSnap.size * 15,
    successStories: Number(data.successStories ?? 0),
    messagesSent: Number(data.totalMatches ?? 0),
  };
}
