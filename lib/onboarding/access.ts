import type { OnboardingStatus } from "@/lib/types";

export type OnboardingFeature =
  | "view_basic_matches"
  | "view_limited_matches"
  | "ai_compatibility_score"
  | "advanced_search_full"
  | "advanced_search_limited"
  | "send_interest"
  | "save_favorites"
  | "view_full_profile"
  | "view_contact_details"
  | "direct_chat"
  | "voice_video_call"
  | "verification_badge";

const ACCESS_MATRIX: Record<OnboardingFeature, OnboardingStatus[]> = {
  view_basic_matches: [
    "basic_registered",
    "profile_completed",
    "verification_pending",
    "verified",
    "rejected",
  ],
  view_limited_matches: ["basic_registered"],
  ai_compatibility_score: ["profile_completed", "verification_pending", "verified"],
  advanced_search_limited: ["profile_completed", "verification_pending", "verified"],
  advanced_search_full: ["verified"],
  send_interest: ["profile_completed", "verification_pending", "verified"],
  save_favorites: ["profile_completed", "verification_pending", "verified"],
  view_full_profile: ["profile_completed", "verification_pending", "verified"],
  view_contact_details: ["verified"],
  direct_chat: ["profile_completed", "verification_pending", "verified"],
  voice_video_call: ["verified"],
  verification_badge: ["verified"],
};

export function canAccess(status: OnboardingStatus, feature: OnboardingFeature): boolean {
  return ACCESS_MATRIX[feature].includes(status);
}

export function getOnboardingPhase(status: OnboardingStatus): 1 | 2 | 3 {
  if (status === "basic_registered") return 2;
  if (status === "rejected" || status === "verification_pending") return 3;
  if (status === "profile_completed" || status === "verified") return 2;
  return 1;
}

/** Required next step only — Phase 3 verification is optional after profile completion. */
export function getNextOnboardingRoute(status: OnboardingStatus): string | null {
  switch (status) {
    case "basic_registered":
      return "/onboarding/profile";
    case "rejected":
      return "/onboarding/verify";
    case "profile_completed":
    case "verification_pending":
    case "verified":
      return null;
    default:
      return null;
  }
}

/** Optional identity verification — user chooses when to start Phase 3. */
export function getOptionalVerificationRoute(status: OnboardingStatus): string | null {
  if (status === "profile_completed") return "/onboarding/verify";
  return null;
}

export function getOnboardingStatusLabel(status: OnboardingStatus): string {
  switch (status) {
    case "basic_registered":
      return "Basic";
    case "profile_completed":
      return "Profile Complete";
    case "verification_pending":
      return "Pending Verification";
    case "verified":
      return "Verified";
    case "rejected":
      return "Verification Rejected";
    default:
      return status;
  }
}

export function getPhaseCtaMessage(status: OnboardingStatus): string | null {
  switch (status) {
    case "basic_registered":
      return "Complete your profile to unlock compatibility scores and send interests.";
    case "profile_completed":
      return "Optional: verify your identity anytime to unlock contact details and your verified badge.";
    case "verification_pending":
      return "Your verification is under review. We'll notify you once approved.";
    case "rejected":
      return "Your verification was rejected. Please resubmit your documents.";
    default:
      return null;
  }
}
