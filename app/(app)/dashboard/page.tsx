"use client";

import SuggestedMatchCard from "@/components/dashboard/SuggestedMatchCard";
import StatCard from "@/components/dashboard/StatCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAuth } from "@/context/AuthContext";
import { MOCK_INTERESTS } from "@/lib/mock/interests";
import { MOCK_CONVERSATIONS } from "@/lib/mock/messages";
import { MOCK_PROFILES } from "@/lib/mock/profiles";
import type { Profile } from "@/lib/types";
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
  Sparkles,
  Star,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  if (key === "photos") return profile.photos.length > 0;
  if (key === "bio") return profile.bio.length > 20;
  return profile.preferences.religions.length > 0;
}

export default function DashboardPage() {
  const { session } = useAuth();
  if (!session) return null;

  const { user, profile } = session;
  const firstName = user.name.split(" ")[0];

  const interests = MOCK_INTERESTS.filter(
    (i) => i.fromUserId === user.id || i.toUserId === user.id
  );
  const receivedInterests = interests.filter((i) => i.toUserId === user.id).length;
  const unreadMessages = MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unreadCount, 0);
  const suggestedMatches = MOCK_PROFILES.slice(0, 4);

  const quickActions = [
    {
      href: "/search",
      icon: Search,
      label: "Discover Matches",
      desc: "Browse compatible profiles",
      gradient: "from-primary to-primary-dark",
    },
    {
      href: "/messages",
      icon: MessageCircle,
      label: "Messages",
      desc: unreadMessages > 0 ? `${unreadMessages} unread` : "Chat with connections",
      gradient: "from-rose-500 to-primary",
    },
    {
      href: "/profile",
      icon: User,
      label: "Edit Profile",
      desc: "Keep your profile fresh",
      gradient: "from-amber-500 to-accent",
    },
    {
      href: "/subscription",
      icon: Crown,
      label: "Go Premium",
      desc: "Unlock all features",
      gradient: "from-primary-light to-accent",
    },
  ];

  const pendingTips = PROFILE_TIPS.filter((tip) => !isTipDone(tip.key, profile));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-[#3d0f1f] px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute right-10 top-1/2 hidden h-32 w-32 -translate-y-1/2 rounded-full border border-white/10 lg:block" />
          <div className="absolute right-16 top-1/2 hidden h-20 w-20 -translate-y-1/2 rounded-full border border-accent/30 lg:block" />
        </div>

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Your matrimony journey
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
              {getGreeting()}, {firstName}!
            </h1>
            <p className="mt-3 text-base text-white/75 sm:text-lg">
              You have{" "}
              <span className="font-semibold text-accent">{receivedInterests} new interests</span> and{" "}
              <span className="font-semibold text-accent">{unreadMessages} unread messages</span>{" "}
              waiting for you today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/search">
                <Button variant="accent" size="lg">
                  <Search className="h-4 w-4" />
                  Find Matches
                </Button>
              </Link>
              <Link href="/messages">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" />
                  View Messages
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md lg:p-5">
            <div className="rounded-full bg-gradient-to-br from-accent to-amber-300 p-0.5">
              <div className="rounded-full bg-primary-dark p-0.5">
                <Avatar src={profile.photos[0]} name={user.name} size="xl" />
              </div>
            </div>
            <div>
              <p className="font-semibold">{user.name}</p>
              <div className="mt-0.5 flex items-center gap-1 text-sm text-white/70">
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

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Profile Views" value="128" icon={Eye} trend="+12 this week" accent="primary" />
        <StatCard label="Interests" value={interests.length} icon={Heart} trend={`${receivedInterests} received`} accent="rose" />
        <StatCard label="Messages" value={unreadMessages} icon={MessageCircle} trend="Unread" accent="emerald" />
        <StatCard label="Profile Score" value={`${profile.profileCompletion}%`} icon={Star} accent="accent" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile completion */}
        <Card className="relative overflow-hidden lg:col-span-2">
          <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-bl from-primary/5 to-transparent" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative mx-auto shrink-0 sm:mx-0">
              {profile.photos[0] ? (
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl shadow-lg ring-4 ring-primary/10">
                  <Image
                    src={profile.photos[0]}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
                  <Avatar name={user.name} size="xl" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-md">
                {profile.profileCompletion}%
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-display text-xl font-bold">Your Profile</h2>
              <p className="mt-1 text-sm text-muted">
                {profile.age} yrs &middot; {profile.religion} &middot; {profile.occupation || "Add occupation"}
              </p>
              <div className="mt-4">
                <ProgressBar value={profile.profileCompletion} />
              </div>
              {profile.profileCompletion < 100 && (
                <p className="mt-2 text-xs text-muted">
                  Complete your profile to get up to <span className="font-medium text-primary">3x more views</span>
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
            <div className="relative mt-6 border-t border-border pt-6">
              <p className="mb-3 text-sm font-medium">Quick wins to boost your profile</p>
              <div className="flex flex-wrap gap-2">
                {pendingTips.map((tip) => (
                  <Link
                    key={tip.label}
                    href="/profile"
                    className="inline-flex items-center gap-2 rounded-full border border-dashed border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    <tip.icon className="h-3.5 w-3.5" />
                    {tip.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="group">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity group-hover:opacity-5`}
                />
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-sm`}
                >
                  <action.icon className="h-5 w-5" />
                </div>
                <p className="relative mt-3 text-sm font-semibold">{action.label}</p>
                <p className="relative text-xs text-muted">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested matches */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">Suggested For You</h2>
            <p className="text-sm text-muted">Profiles matching your preferences</p>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {suggestedMatches.map((match) => (
            <SuggestedMatchCard key={match.id} profile={match} />
          ))}
        </div>
      </section>

      {/* Recent interests */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
              <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Recent Interests</h3>
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

        {interests.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-2xl bg-background py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <p className="mt-4 font-medium">No interests yet</p>
            <p className="mt-1 max-w-xs text-sm text-muted">
              Start browsing profiles and send interests to people you like
            </p>
            <Link href="/search" className="mt-4">
              <Button size="sm">Start Searching</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {interests.map((interest) => {
              const isReceived = interest.toUserId === user.id;
              const displayName = isReceived ? interest.toUserName : interest.toUserName;
              const displayPhoto = interest.toUserPhoto;

              return (
                <div
                  key={interest.id}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-all hover:border-primary/20 hover:shadow-sm"
                >
                  <div className="relative">
                    <Avatar src={displayPhoto} name={displayName} size="lg" />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background ${
                        interest.status === "accepted"
                          ? "bg-emerald-500"
                          : interest.status === "pending"
                            ? "bg-amber-400"
                            : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{displayName}</p>
                    <p className="text-xs text-muted">
                      {isReceived ? "Sent you interest" : "You sent interest"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted/70">
                      {formatRelativeTime(interest.createdAt)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      interest.status === "accepted"
                        ? "success"
                        : interest.status === "declined"
                          ? "warning"
                          : "default"
                    }
                  >
                    {interest.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Premium CTA banner */}
      <section className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-r from-[#fdf8ee] via-card to-[#fdf8ee] p-6 sm:p-8">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-accent/10" />
        <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-amber-400 text-white shadow-md">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Upgrade to Premium</h3>
              <p className="mt-1 max-w-md text-sm text-muted">
                Get unlimited interests, see who viewed your profile, and appear at the top of search results.
              </p>
            </div>
          </div>
          <Link href="/subscription" className="shrink-0">
            <Button variant="accent">
              View Plans
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
