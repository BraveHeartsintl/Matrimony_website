import type { Conversation, Gender, Profile, SearchProfile } from "@/lib/types";

/** Matrimony matching: male ↔ female. "other" has no automatic gender filter. */
export function preferredPartnerGender(gender: Gender): Gender | null {
  if (gender === "male") return "female";
  if (gender === "female") return "male";
  return null;
}

export function isCompatibleMatch(viewerGender: Gender, targetGender: Gender): boolean {
  const preferred = preferredPartnerGender(viewerGender);
  if (!preferred) return true;
  return targetGender === preferred;
}

export function filterCompatibleProfiles(
  profiles: SearchProfile[],
  viewerGender: Gender
): SearchProfile[] {
  return profiles.filter((p) => isCompatibleMatch(viewerGender, p.gender));
}

export function filterCompatibleConversations(
  conversations: Conversation[],
  viewerGender: Gender,
  profilesByUserId: Map<string, SearchProfile>
): Conversation[] {
  return conversations.filter((c) => {
    const participant = profilesByUserId.get(c.participantId);
    if (!participant) return true;
    return isCompatibleMatch(viewerGender, participant.gender);
  });
}

export function partnerGenderFilterForProfile(profile: Profile): string {
  return preferredPartnerGender(profile.gender) ?? "";
}
