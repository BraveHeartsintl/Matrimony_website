"use client";

import MatchScoreDisplay from "@/components/matchmaking/MatchScoreDisplay";
import LockedFeature from "@/components/onboarding/LockedFeature";
import ReportProfileDialog from "@/components/profile/ReportProfileDialog";
import ProfileGallery from "@/components/profile/ProfileGallery";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";
import { useAuth } from "@/context/AuthContext";
import { useInterests } from "@/hooks/useInterests";
import { sendInterest } from "@/lib/firebase/services/interest.service";
import { calculateMatchScore } from "@/lib/matchmaking/calculateMatchScore";
import { resolveProfileId } from "@/lib/firebase/services/search.service";
import { canAccess, getNextOnboardingRoute } from "@/lib/onboarding/access";
import type { FullProfile } from "@/lib/types";
import {
  formatBodyType,
  formatDate,
  formatGender,
  formatMaritalStatus,
  formatRelativeTime,
} from "@/lib/utils";
import {
  ArrowLeft,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  ShieldCheck,
  Users,
  Video,
  Weight,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface ProfileDetailViewProps {
  profile: FullProfile;
}

const TABS = [
  { id: "about", label: "About" },
  { id: "partner", label: "Partner Expectations" },
  { id: "family", label: "Family" },
  { id: "lifestyle", label: "Lifestyle" },
];

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-accent/8 py-3 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground sm:text-right">{value}</dd>
    </div>
  );
}

export default function ProfileDetailView({ profile }: ProfileDetailViewProps) {
  const [activeTab, setActiveTab] = useState("about");
  const [reportOpen, setReportOpen] = useState(false);
  const [interestBusy, setInterestBusy] = useState(false);
  const { session } = useAuth();
  const { sentTo } = useInterests(session?.user.id);
  const interested = sentTo(profile.id);
  const { matrimony } = profile;

  const status = session?.profile.onboardingStatus ?? "basic_registered";
  const canSeeFullProfile = canAccess(status, "view_full_profile");
  const canSeeMatchScore = canAccess(status, "ai_compatibility_score");
  const canSendInterest = canAccess(status, "send_interest");
  const canViewContact = canAccess(status, "view_contact_details");
  const canChat = canAccess(status, "direct_chat");
  const nextRoute = getNextOnboardingRoute(status);

  const matchResult = useMemo(
    () =>
      session && canSeeMatchScore
        ? calculateMatchScore(session.profile, profile)
        : undefined,
    [session, profile, canSeeMatchScore]
  );

  const detailGrid = canSeeFullProfile
    ? [
        { icon: Briefcase, label: "Profession", value: profile.occupation },
        { icon: GraduationCap, label: "Education", value: profile.education },
        {
          icon: Ruler,
          label: "Height",
          value: profile.heightCm > 0 ? `${profile.heightCm} cm` : "—",
        },
        {
          icon: Weight,
          label: "Weight",
          value: profile.weightKg > 0 ? `${profile.weightKg} kg` : "—",
        },
        { icon: Users, label: "Community", value: matrimony.community },
        {
          icon: MapPin,
          label: "Relocate",
          value: matrimony.willingToRelocate ? "Willing" : "Not willing",
        },
      ]
    : [];

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/search"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Search
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProfileGallery photos={profile.photos} name={profile.name} />

        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                  {profile.name}
                </h1>
                {profile.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-2 text-lg text-muted">
                {profile.age} years · {formatGender(profile.gender)}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-muted">
                <MapPin className="h-4 w-4 text-gold" />
                {profile.location}, UK
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="accent">{profile.religion}</Badge>
            {canSeeFullProfile && (
              <>
                <Badge>{matrimony.community}</Badge>
                <Badge>{formatMaritalStatus(profile.maritalStatus)}</Badge>
                <Badge>{profile.education}</Badge>
              </>
            )}
          </div>

          {matchResult && (
            <MatchScoreDisplay result={matchResult} variant="full" className="mt-6" />
          )}

          {!canSeeMatchScore && nextRoute && (
            <p className="mt-6 rounded-[8px] border border-accent/20 bg-accent-soft px-4 py-3 text-sm">
              Complete your profile to see AI compatibility scores.{" "}
              <Link href={nextRoute} className="font-medium text-accent underline">
                Continue setup
              </Link>
            </p>
          )}

          {canSeeFullProfile && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {detailGrid.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-[12px] border border-accent/10 bg-surface px-4 py-3"
                >
                  <Icon className="h-4 w-4 text-gold" />
                  <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>
          )}

          {canSeeFullProfile && (
            <p className="mt-4 text-sm text-muted-foreground">
              Member since {formatDate(matrimony.memberSince)} · Last active{" "}
              {formatRelativeTime(matrimony.lastActive)}
            </p>
          )}

          {canViewContact && (
            <Card className="mt-6" padding="md">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contact Details
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent" />
                  {profile.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent" />
                  +44 7700 900{profile.id.slice(-3)}
                </p>
              </div>
            </Card>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {canSendInterest ? (
              <Button
                size="lg"
                variant={interested ? "secondary" : "primary"}
                disabled={interestBusy || interested}
                onClick={() => {
                  if (!session || interested || interestBusy) return;
                  setInterestBusy(true);
                  void sendInterest(session.user.id, profile.id, {
                    toUserName: profile.name,
                    toUserPhoto: profile.photos[0],
                    fromUserName: session.user.name,
                    fromUserPhoto: session.profile.photos[0],
                  }).finally(() => setInterestBusy(false));
                }}
              >
                <Heart className={`h-4 w-4 ${interested ? "fill-current" : ""}`} />
                {interested ? "Interest Sent" : "Send Interest"}
              </Button>
            ) : (
              nextRoute && (
                <Link href={nextRoute}>
                  <Button size="lg">
                    <Heart className="h-4 w-4" />
                    Complete profile to send interest
                  </Button>
                </Link>
              )
            )}
            {canChat ? (
              <>
                <Link href={`/messages?with=${encodeURIComponent(resolveProfileId(profile.id))}`}>
                  <Button size="lg" variant="outline">
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                </Link>
                <Button size="lg" variant="outline" disabled title="Coming soon">
                  <Video className="h-4 w-4" />
                  Video Call
                </Button>
              </>
            ) : (
              canSendInterest &&
              nextRoute && (
                <Link href="/onboarding/verify">
                  <Button size="lg" variant="outline">
                    <MessageCircle className="h-4 w-4" />
                    Verify to message
                  </Button>
                </Link>
              )
            )}
            {session && session.user.id !== profile.id && (
              <Button size="lg" variant="outline" onClick={() => setReportOpen(true)}>
                <AlertTriangle className="h-4 w-4" />
                Report
              </Button>
            )}
          </div>
        </div>
      </div>

      <ReportProfileDialog
        profileId={profile.id}
        profileName={profile.name}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
      />

      {canSeeFullProfile ? (
        <Card className="mt-10" padding="lg">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

          <div className="mt-8">
            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">About Me</h3>
                  <p className="mt-3 leading-relaxed text-muted">{matrimony.aboutMe}</p>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">Short Bio</h3>
                  <p className="mt-3 leading-relaxed text-muted">{profile.bio}</p>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">Hobbies</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {matrimony.hobbies.map((hobby) => (
                      <Badge key={hobby}>{hobby}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">Languages</h3>
                  <p className="mt-3 text-muted">{matrimony.languages.join(" · ")}</p>
                </div>
              </div>
            )}

            {activeTab === "partner" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Partner Expectations
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">{matrimony.partnerExpectations}</p>
                </div>
                <dl>
                  <DetailRow
                    label="Preferred Age Range"
                    value={`${profile.preferences.ageMin} – ${profile.preferences.ageMax} years`}
                  />
                  <DetailRow
                    label="Preferred Religion"
                    value={profile.preferences.religions.join(", ") || "Open"}
                  />
                  <DetailRow
                    label="Preferred Locations"
                    value={profile.preferences.locations.join(", ")}
                  />
                  <DetailRow
                    label="Willing to Relocate"
                    value={matrimony.willingToRelocate ? "Yes" : "No"}
                  />
                </dl>
              </div>
            )}

            {activeTab === "family" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Family Background
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">{matrimony.familyBackground}</p>
                </div>
                <dl>
                  <DetailRow label="Father's Occupation" value={matrimony.fatherOccupation} />
                  <DetailRow label="Mother's Occupation" value={matrimony.motherOccupation} />
                  <DetailRow label="Siblings" value={matrimony.siblings} />
                  <DetailRow label="Community" value={matrimony.community} />
                </dl>
              </div>
            )}

            {activeTab === "lifestyle" && (
              <dl>
                <DetailRow label="Diet" value={matrimony.diet} />
                <DetailRow label="Smoking" value={matrimony.smoking} />
                <DetailRow label="Drinking" value={matrimony.drinking} />
                <DetailRow label="Body Type" value={formatBodyType(profile.bodyType)} />
                <DetailRow
                  label="Marital Status"
                  value={formatMaritalStatus(profile.maritalStatus)}
                />
                <DetailRow label="Languages" value={matrimony.languages.join(", ")} />
                <DetailRow
                  label="Profile Completion"
                  value={`${profile.profileCompletion}%`}
                />
              </dl>
            )}
          </div>
        </Card>
      ) : (
        <div className="mt-10">
          <LockedFeature status={status} feature="Full profile details">
            <Card padding="lg">
              <Tabs tabs={TABS} activeTab="about" onChange={() => {}} />
              <p className="mt-8 text-muted">Detailed profile information</p>
            </Card>
          </LockedFeature>
        </div>
      )}
    </div>
  );
}
