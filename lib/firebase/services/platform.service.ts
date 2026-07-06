import { SITE_STATS, UK_REGIONS } from "@/lib/constants";
import { getFirebaseDb } from "@/lib/firebase/config";
import { DEFAULT_TESTIMONIALS } from "@/lib/mock/testimonials";
import { formatStatCount, formatVerifiedRate } from "@/lib/platform-format";
import type {
  PlatformContent,
  PlatformRegionStat,
  PlatformStatsDisplay,
  PlatformTestimonial,
} from "@/lib/types/platform";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

const DEFAULT_REGIONS: PlatformRegionStat[] = UK_REGIONS.map((r) => ({
  city: r.city,
  members: parseInt(r.members.replace(/[^0-9]/g, ""), 10) || 0,
}));

function defaultStats(): PlatformStatsDisplay {
  return {
    members: SITE_STATS.members,
    matches: SITE_STATS.matches,
    verified: SITE_STATS.verified,
    cities: SITE_STATS.cities,
    successStories: DEFAULT_TESTIMONIALS.length,
  };
}

function defaultContent(): PlatformContent {
  return {
    stats: defaultStats(),
    regions: DEFAULT_REGIONS,
    testimonials: DEFAULT_TESTIMONIALS,
  };
}

function toDisplayStats(data: Record<string, unknown>): PlatformStatsDisplay {
  return {
    members: String(data.membersLabel ?? data.members ?? SITE_STATS.members),
    matches: String(data.matchesLabel ?? data.matches ?? SITE_STATS.matches),
    verified: String(data.verifiedLabel ?? data.verified ?? SITE_STATS.verified),
    cities: String(data.citiesLabel ?? data.cities ?? SITE_STATS.cities),
    successStories: Number(data.successStories ?? DEFAULT_TESTIMONIALS.length),
  };
}

export async function fetchPublicPlatformContent(): Promise<PlatformContent> {
  const db = getFirebaseDb();
  const [aggregateSnap, testimonialsSnap, regionsSnap] = await Promise.all([
    getDoc(doc(db, "platformStats", "aggregate")),
    getDoc(doc(db, "platformStats", "testimonials")),
    getDoc(doc(db, "platformStats", "regions")),
  ]);

  const stats = aggregateSnap.exists()
    ? toDisplayStats(aggregateSnap.data() as Record<string, unknown>)
    : defaultStats();

  const testimonials = testimonialsSnap.exists()
    ? ((testimonialsSnap.data().items as PlatformTestimonial[]) ?? DEFAULT_TESTIMONIALS)
    : DEFAULT_TESTIMONIALS;

  const regions = regionsSnap.exists()
    ? ((regionsSnap.data().items as PlatformRegionStat[]) ?? DEFAULT_REGIONS)
    : DEFAULT_REGIONS;

  return { stats, regions, testimonials };
}

export async function computePlatformMetrics(): Promise<{
  totalMembers: number;
  verifiedProfiles: number;
  totalMatches: number;
  successStories: number;
  cityCount: number;
  regions: PlatformRegionStat[];
}> {
  const db = getFirebaseDb();
  const [usersSnap, profilesSnap, interestsSnap, testimonialsSnap] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "profiles")),
    getDocs(collection(db, "interests")),
    getDoc(doc(db, "platformStats", "testimonials")),
  ]);

  const memberProfiles = profilesSnap.docs.filter((d) => {
    const data = d.data() as Record<string, unknown>;
    return data.isSeed !== true || usersSnap.docs.some((u) => u.id === d.id);
  });

  const totalMembers = usersSnap.docs.filter(
    (d) => (d.data() as Record<string, unknown>).role !== "admin"
  ).length;

  const verifiedProfiles = memberProfiles.filter((d) =>
    Boolean((d.data() as Record<string, unknown>).verified)
  ).length;

  const cityCounts = new Map<string, number>();
  for (const docSnap of memberProfiles) {
    const location = String((docSnap.data() as Record<string, unknown>).location ?? "");
    if (!location) continue;
    cityCounts.set(location, (cityCounts.get(location) ?? 0) + 1);
  }

  const regions: PlatformRegionStat[] = [...cityCounts.entries()]
    .map(([city, members]) => ({ city, members }))
    .sort((a, b) => b.members - a.members)
    .slice(0, 12);

  const successStories = testimonialsSnap.exists()
    ? ((testimonialsSnap.data()?.items as PlatformTestimonial[]) ?? []).length
    : DEFAULT_TESTIMONIALS.length;

  return {
    totalMembers: Math.max(totalMembers, memberProfiles.length),
    verifiedProfiles,
    totalMatches: interestsSnap.size,
    successStories: Math.max(successStories, DEFAULT_TESTIMONIALS.length),
    cityCount: cityCounts.size,
    regions: regions.length > 0 ? regions : DEFAULT_REGIONS,
  };
}

export async function refreshPlatformStats(): Promise<PlatformStatsDisplay> {
  const metrics = await computePlatformMetrics();
  const stats: PlatformStatsDisplay = {
    members: formatStatCount(metrics.totalMembers),
    matches: formatStatCount(Math.max(metrics.totalMatches, Math.floor(metrics.totalMembers * 0.15))),
    verified: formatVerifiedRate(metrics.verifiedProfiles, metrics.totalMembers),
    cities: formatStatCount(metrics.cityCount),
    successStories: metrics.successStories,
  };

  await setDoc(
    doc(getFirebaseDb(), "platformStats", "aggregate"),
    {
      ...stats,
      totalMembers: metrics.totalMembers,
      verifiedProfiles: metrics.verifiedProfiles,
      totalMatches: metrics.totalMatches,
      cityCount: metrics.cityCount,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await setDoc(
    doc(getFirebaseDb(), "platformStats", "regions"),
    { items: metrics.regions, updatedAt: serverTimestamp() },
    { merge: true }
  );

  return stats;
}

export async function seedPlatformContent(): Promise<void> {
  const db = getFirebaseDb();
  await setDoc(
    doc(db, "platformStats", "testimonials"),
    { items: DEFAULT_TESTIMONIALS, updatedAt: serverTimestamp() },
    { merge: true }
  );
  await setDoc(
    doc(db, "platformStats", "regions"),
    { items: DEFAULT_REGIONS, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
