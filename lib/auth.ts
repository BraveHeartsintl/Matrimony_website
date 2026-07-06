import type {
  MatrimonyDetails,
  OnboardingStatus,
  Profile,
  VerificationData,
} from "./types";
import { calculateAgeFromYearOfBirth } from "./utils";

export function createDefaultVerification(): VerificationData {
  return {
    phoneVerified: false,
    emailVerified: false,
  };
}

export function createDefaultMatrimony(): Partial<MatrimonyDetails> {
  return {
    aboutMe: "",
    partnerExpectations: "",
    familyBackground: "",
    fatherOccupation: "",
    motherOccupation: "",
    siblings: "",
    diet: "",
    smoking: "No",
    drinking: "No",
    languages: ["English"],
    community: "",
    willingToRelocate: false,
    hobbies: [],
    fitnessInterests: [],
  };
}

export function createDefaultProfile(userId: string): Profile {
  const yearOfBirth = 1999;
  return {
    userId,
    age: calculateAgeFromYearOfBirth(yearOfBirth),
    yearOfBirth,
    birthMonth: 1,
    gender: "other",
    lookingFor: "bride",
    heightCm: 0,
    weightKg: 0,
    bodyType: "average",
    location: "London",
    country: "England",
    religion: "No Religion",
    education: "",
    occupation: "",
    maritalStatus: "never_married",
    bio: "",
    photos: [],
    privacySettings: {
      hidePhoto: false,
      hideContact: false,
      hideProfile: false,
    },
    preferences: {
      ageMin: 21,
      ageMax: 40,
      religions: [],
      locations: [],
    },
    matrimony: createDefaultMatrimony(),
    verification: createDefaultVerification(),
    onboardingStatus: "basic_registered",
    profileCompletion: 0,
    verified: false,
  };
}

function deriveVerified(status: OnboardingStatus, explicitVerified?: boolean): boolean {
  if (status === "verified") return true;
  if (explicitVerified === true && status === "basic_registered") {
    return true;
  }
  return false;
}

function inferOnboardingStatus(profile: Partial<Profile>): OnboardingStatus {
  if (profile.onboardingStatus) return profile.onboardingStatus;
  if (profile.verified) return "verified";
  if (profile.profileCompletion && profile.profileCompletion >= 60) return "profile_completed";
  return "basic_registered";
}

export function normalizeProfile(profile: Profile): Profile {
  const defaults = createDefaultProfile(profile.userId);
  const merged = {
    ...defaults,
    ...profile,
    preferences: { ...defaults.preferences, ...profile.preferences },
    matrimony: { ...defaults.matrimony, ...profile.matrimony },
    verification: { ...defaults.verification, ...profile.verification },
    privacySettings: { ...defaults.privacySettings, ...profile.privacySettings },
  };

  const yearOfBirth =
    merged.yearOfBirth > 0
      ? merged.yearOfBirth
      : merged.age > 0
        ? new Date().getFullYear() - merged.age
        : defaults.yearOfBirth;

  const onboardingStatus = inferOnboardingStatus(merged);

  const normalized: Profile = {
    ...merged,
    yearOfBirth,
    birthMonth: merged.birthMonth || 1,
    age: calculateAgeFromYearOfBirth(yearOfBirth),
    heightCm: merged.heightCm ?? 0,
    weightKg: merged.weightKg ?? 0,
    bodyType: merged.bodyType ?? "average",
    lookingFor: merged.lookingFor ?? "bride",
    onboardingStatus,
    verified: deriveVerified(onboardingStatus, merged.verified),
  };

  return {
    ...normalized,
    profileCompletion: calculateProfileCompletion(normalized),
  };
}

export function calculateProfileCompletion(profile: Profile): number {
  let score = 0;
  const checks = [
    profile.yearOfBirth > 0,
    profile.birthMonth > 0,
    profile.gender !== "other",
    profile.lookingFor !== undefined,
    !!profile.location,
    profile.heightCm > 0,
    !!profile.religion,
    !!profile.education,
    !!profile.occupation,
    !!profile.maritalStatus,
    !!profile.bio && profile.bio.length > 20,
    profile.photos.length > 0,
    profile.preferences.religions.length > 0,
    !!profile.matrimony.fatherOccupation,
    !!profile.matrimony.motherOccupation,
    !!profile.matrimony.diet,
    (profile.matrimony.hobbies?.length ?? 0) > 0,
    profile.onboardingStatus !== "basic_registered",
  ];
  checks.forEach((ok) => {
    if (ok) score += Math.round(100 / checks.length);
  });
  return Math.min(100, score);
}

export function completeProfileOnboarding(
  profile: Profile,
  updates: Partial<Profile>
): Profile {
  return normalizeProfile({
    ...profile,
    ...updates,
    matrimony: { ...profile.matrimony, ...updates.matrimony },
    preferences: { ...profile.preferences, ...updates.preferences },
    onboardingStatus: "profile_completed",
  });
}

export function submitVerification(profile: Profile): Profile {
  return normalizeProfile({
    ...profile,
    onboardingStatus: "verification_pending",
    verification: {
      ...profile.verification,
      submittedAt: new Date().toISOString(),
      rejectionReason: undefined,
    },
  });
}

export function approveVerification(profile: Profile): Profile {
  return normalizeProfile({
    ...profile,
    onboardingStatus: "verified",
    verified: true,
    verification: {
      ...profile.verification,
      rejectionReason: undefined,
    },
  });
}

export function rejectVerification(profile: Profile, reason: string): Profile {
  return normalizeProfile({
    ...profile,
    onboardingStatus: "rejected",
    verified: false,
    verification: {
      ...profile.verification,
      rejectionReason: reason,
    },
  });
}

export interface PendingVerificationSubmission {
  userId: string;
  name: string;
  email: string;
  submittedAt: string;
  idDocumentType?: string;
}
