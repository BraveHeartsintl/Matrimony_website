"use client";

import SuggestedMatchCard from "@/components/dashboard/SuggestedMatchCard";
import InterestCard from "@/components/dashboard/InterestCard";
import OnboardingProgressCard from "@/components/onboarding/OnboardingProgressCard";
import StatCard from "@/components/dashboard/StatCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import SectionLabel from "@/components/ui/SectionLabel";
import { useAuth } from "@/context/AuthContext";
import { useConversations } from "@/hooks/useConversations";
import { useInterests } from "@/hooks/useInterests";
import { useSearchProfiles } from "@/hooks/useSearchProfiles";
import { isInterestReceived } from "@/lib/firebase/services/interest.service";
import { getProfileViewCount } from "@/lib/firebase/services/profile.service";
import { canAccess } from "@/lib/onboarding/access";
import { calculateMatchScore } from "@/lib/matchmaking/calculateMatchScore";
import { filterCompatibleProfiles } from "@/lib/matchmaking";
import { resolveProfileId } from "@/lib/firebase/services/search.service";
import { getProfilePhotoUrl, profileHasPhoto } from "@/lib/profile-photos";
import type { Profile, SearchProfile } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import {
  ArrowRight,
  Camera,
  Crown,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const PROFILE_TIPS = [
  { icon: Camera, label: "Add profile photos", key: "photos" as const },
  { icon: User, label: "Write your bio", key: "bio" as const },
  { icon: Star, label: "Set partner preferences", key: "preferences" as const },
];

function isTipDone(key: (typeof PROFILE_TIPS)[number]["key"], profile: Profile): boolean {
  if (key === "photos") return profileHasPhoto(profile);
  if (key === "bio") return profile.bio.length > 20;
  return profile.preferences.religions.length > 0;
}

export default function DashboardPage() {
  const { session } = useAuth();
  const [profileLookup, setProfileLookup] = useState(
    () => new Map<string, { name: string; photo: string }>()
  );
  const [allProfiles, setAllProfiles] = useState<SearchProfile[]>([]);
  const [profileViewCount, setProfileViewCount] = useState<number | null>(null);

  const { interests } = useInterests(session?.user.id);
  const { conversations } = useConversations(session?.user.id, profileLookup);
  const { profiles: searchProfiles } = useSearchProfiles(session?.user.id);

  useEffect(() => {
    setAllProfiles(searchProfiles);
    const map = new Map<string, { name: string; photo: string }>();
    searchProfiles.forEach((p) =>
      map.set(p.id, { name: p.name, photo: getProfilePhotoUrl(p) ?? "" })
    );
    setProfileLookup(map);
  }, [searchProfiles]);

  useEffect(() => {
    if (!session?.user.id) return;
    void getProfileViewCount(session.user.id).then(setProfileViewCount);
  }, [session?.user.id]);

  const userId = session?.user.id;
  const profilesByUserId = useMemo(
    () => new Map(allProfiles.map((p) => [p.userId, p])),
    [allProfiles]
  );

  const interestsEnriched = useMemo(() => {
    if (!userId) return [];
    return interests.map((interest) => {
      const otherUserId =
        interest.fromUserId === userId ? interest.toUserId : interest.fromUserId;
      const other =
        profilesByUserId.get(otherUserId) ?? allProfiles.find((p) => p.id === otherUserId);
      const isReceived = interest.toUserId === userId;
      return {
        ...interest,
        otherUserId,
        otherProfileId: other?.id ?? resolveProfileId(otherUserId),
        otherUserName:
          other?.name ??
          (isReceived ? interest.fromUserName : interest.toUserName) ??
          "Member",
        otherUserPhoto:
          getProfilePhotoUrl(other ?? {}) ??
          (isReceived ? interest.fromUserPhoto : interest.toUserPhoto) ??
          "",
      };
    });
  }, [interests, userId, profilesByUserId, allProfiles]);

  if (!session) return null;

  const { user, profile } = session;
  const profilePhoto = getProfilePhotoUrl(profile);
  const firstName = user.name.split(" ")[0];
  const canSeeMatchScore = canAccess(profile.onboardingStatus, "ai_compatibility_score");
  const isLimitedBrowse = profile.onboardingStatus === "basic_registered";

  const receivedInterests = interestsEnriched.filter((i) => isInterestReceived(i, user.id)).length;
  const pendingReceivedInterests = interestsEnriched.filter(
    (i) => isInterestReceived(i, user.id) && i.status === "pending"
  );
  const otherInterests = interestsEnriched.filter(
    (i) => !(isInterestReceived(i, user.id) && i.status === "pending")
  );
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const suggestedMatches = filterCompatibleProfiles(allProfiles, profile.gender)
    .slice(0, isLimitedBrowse ? 3 : 4)
    .map((match) => ({
      profile: match,
      matchResult: canSeeMatchScore ? calculateMatchScore(profile, match) : undefined,
    }));

  const quickActions = [
    { href: "/search", icon: Search, label: "Discover Matches", desc: "Browse compatible profiles" },
    {
      href: "/messages",
      icon: MessageCircle,
      label: "Messages",
      desc: unreadMessages > 0 ? `${unreadMessages} unread` : "Chat with connections",
    },
    { href: "/profile", icon: User, label: "Edit Profile", desc: "Keep your profile fresh" },
    { href: "/subscription", icon: Crown, label: "Go Premium", desc: "Unlock all features" },
  ];

  const pendingTips = PROFILE_TIPS.filter((tip) => !isTipDone(tip.key, profile));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-[6px] glass px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <SectionLabel>Dashboard</SectionLabel>
            <h1 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              {getGreeting()}, {firstName}!
            </h1>
            <p className="mt-3 text-base text-muted sm:text-lg">
              You have{" "}
              <span className="font-semibold text-accent">{receivedInterests} new interests</span> and{" "}
              <span className="font-semibold text-accent">{unreadMessages} unread messages</span>{" "}
              waiting for you today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/search">
                <Button size="lg">
                  <Search className="h-4 w-4" />
                  Find Matches
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="outline" size="lg">
                  <MessageCircle className="h-4 w-4" />
                  View Messages
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-[6px] glass p-4 lg:p-5">
            <Avatar src={profilePhoto} name={user.name} size="xl" />
            <div>
              <p className="font-semibold text-foreground">{user.name}</p>
              <div className="mt-0.5 flex items-center gap-1 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </div>
              {profile.verified && (
                <Badge variant="accent" className="mt-2">
                  <ShieldCheck className="mr-1 inline h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <OnboardingProgressCard status={profile.onboardingStatus} />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Profile Views" value={profileViewCount ?? "—"} icon={Eye} trend="Total views" accent="accent" />
        <StatCard label="Interests" value={interestsEnriched.length} icon={Heart} trend={`${receivedInterests} received`} />
        <StatCard label="Messages" value={unreadMessages} icon={MessageCircle} trend="Unread" />
        <StatCard label="Profile Score" value={`${profile.profileCompletion}%`} icon={Star} accent="accent" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" hover>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative mx-auto shrink-0 sm:mx-0">
              {profilePhoto ? (
                <div className="relative h-28 w-28 overflow-hidden rounded-[6px] border border-border">
                  <Image
                    src={profilePhoto}
                    alt={user.name}
                    fill
                    className="object-cover img-bw"
                    unoptimized={
                      profilePhoto.startsWith("data:") ||
                      profilePhoto.includes("firebasestorage")
                    }
                  />
                </div>
              ) : (
                <Avatar name={user.name} size="xl" />
              )}
              <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {profile.profileCompletion}%
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-display text-xl font-bold text-foreground">Your Profile</h2>
              <p className="mt-1 text-sm text-muted">
                {profile.age} yrs &middot; {profile.religion} &middot;{" "}
                {profile.occupation || "Add occupation"}
              </p>
              <div className="mt-4">
                <ProgressBar value={profile.profileCompletion} />
              </div>
              {profile.profileCompletion < 100 && (
                <p className="mt-2 text-xs text-muted">
                  Complete your profile to get up to{" "}
                  <span className="font-medium text-accent">3x more views</span>
                </p>
              )}
              <Link href="/profile">
                <Button className="mt-4" size="sm">
                  {profile.profileCompletion < 100 ? "Complete Profile" : "Edit Profile"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {pendingTips.length > 0 && (
            <div className="mt-6 border-t border-border pt-6">
              <p className="mb-3 text-sm font-medium text-foreground">
                Quick wins to boost your profile
              </p>
              <div className="flex flex-wrap gap-2">
                {pendingTips.map((tip) => (
                  <Link
                    key={tip.label}
                    href="/profile"
                    className="inline-flex items-center gap-2 rounded glass-subtle border-dashed px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted transition-colors hover:border-border-hover hover:text-foreground"
                  >
                    <tip.icon className="h-3.5 w-3.5" />
                    {tip.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="rounded-[6px] glass p-4 transition-colors hover:border-border-hover">
                <div className="flex h-10 w-10 items-center justify-center rounded-[6px] glass-subtle">
                  <action.icon className="h-5 w-5 text-foreground" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">{action.label}</p>
                <p className="text-xs text-muted">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Suggested For You</h2>
            <p className="text-sm text-muted">Profiles matching your preferences</p>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-foreground transition-colors hover:text-accent"
          >
            See all
            <ArrowRight className="h-4 w-4 text-accent" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {suggestedMatches.map(({ profile: match, matchResult }) => (
            <SuggestedMatchCard key={match.id} profile={match} matchResult={matchResult} />
          ))}
        </div>
      </section>

      <Card hover>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[6px] glass-subtle">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Recent Interests</h3>
              <p className="text-xs text-muted">People connecting with you</p>
            </div>
          </div>
          <Link href="/search">
            <Button variant="ghost" size="sm">
              Explore
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {interestsEnriched.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-[6px] glass-subtle py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full glass">
              <Heart className="h-7 w-7 text-accent" />
            </div>
            <p className="mt-4 font-medium text-foreground">No interests yet</p>
            <p className="mt-1 max-w-xs text-sm text-muted">
              Start browsing profiles and send interests to people you like
            </p>
            <Link href="/search" className="mt-4">
              <Button size="sm">Start Searching</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {pendingReceivedInterests.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-semibold text-accent">
                  Action required — {pendingReceivedInterests.length} interest
                  {pendingReceivedInterests.length === 1 ? "" : "s"} waiting for your approval
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pendingReceivedInterests.map((interest) => (
                    <InterestCard
                      key={interest.id}
                      interest={interest}
                      currentUserId={user.id}
                      highlight
                    />
                  ))}
                </div>
              </div>
            )}

            {otherInterests.length > 0 && (
              <div>
                {pendingReceivedInterests.length > 0 && (
                  <p className="mb-3 text-sm font-medium text-muted">Your other interests</p>
                )}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {otherInterests.map((interest) => (
                    <InterestCard
                      key={interest.id}
                      interest={interest}
                      currentUserId={user.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <section className="rounded-[6px] glass glass-hover border-accent/20 p-6 sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] border border-accent/20 bg-accent/10">
              <Crown className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Upgrade to Premium</h3>
              <p className="mt-1 max-w-md text-sm text-muted">
                Get unlimited interests, see who viewed your profile, and appear at the top of
                search results.
              </p>
            </div>
          </div>
          <Link href="/subscription" className="shrink-0">
            <Button>
              View Plans
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
