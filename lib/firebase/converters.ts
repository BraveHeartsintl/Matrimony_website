import { normalizeProfile } from "@/lib/auth";
import type { Profile, User } from "@/lib/types";
import { Timestamp } from "firebase/firestore";

export function timestampToIso(value: unknown): string | undefined {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

export function isoToTimestamp(value: string | undefined): Timestamp | undefined {
  if (!value) return undefined;
  return Timestamp.fromDate(new Date(value));
}

function buildGenderLookingFor(gender: Profile["gender"], lookingFor: Profile["lookingFor"]): string {
  return `${gender}-seeking-${lookingFor}`;
}

/** Firestore rejects `undefined`; convert to `null` or omit recursively. */
export function sanitizeForFirestore(value: unknown): unknown {
  if (value === undefined) {
    return null;
  }
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeForFirestore);
  }
  if (value instanceof Timestamp) {
    return value;
  }
  // Preserve Firestore FieldValue sentinels (e.g. serverTimestamp())
  if ("_methodName" in (value as object)) {
    return value;
  }

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (val !== undefined) {
      result[key] = sanitizeForFirestore(val);
    }
  }
  return result;
}

export function userFromFirestore(uid: string, data: Record<string, unknown>): User {
  return {
    id: uid,
    email: String(data.email ?? ""),
    name: String(data.name ?? ""),
    createdAt: timestampToIso(data.createdAt) ?? new Date().toISOString(),
    role: (data.role as User["role"]) ?? "member",
  };
}

export function profileFromFirestore(uid: string, data: Record<string, unknown>): Profile {
  const verification = (data.verification as Record<string, unknown> | undefined) ?? {};
  const submittedAt = timestampToIso(verification.submittedAt);

  const profile: Profile = {
    userId: uid,
    age: Number(data.age ?? 0),
    yearOfBirth: Number(data.yearOfBirth ?? 0),
    birthMonth: Number(data.birthMonth ?? 1),
    birthDay: data.birthDay != null ? Number(data.birthDay) : undefined,
    gender: (data.gender as Profile["gender"]) ?? "other",
    lookingFor: (data.lookingFor as Profile["lookingFor"]) ?? "bride",
    heightCm: Number(data.heightCm ?? 0),
    weightKg: Number(data.weightKg ?? 0),
    bodyType: (data.bodyType as Profile["bodyType"]) ?? "average",
    location: String(data.location ?? ""),
    country: data.country as string | undefined,
    state: data.state as string | undefined,
    city: data.city as string | undefined,
    religion: String(data.religion ?? ""),
    motherTongue: data.motherTongue as string | undefined,
    caste: data.caste as string | undefined,
    education: String(data.education ?? ""),
    college: data.college as string | undefined,
    occupation: String(data.occupation ?? ""),
    company: data.company as string | undefined,
    annualIncome: data.annualIncome as string | undefined,
    maritalStatus: (data.maritalStatus as Profile["maritalStatus"]) ?? "never_married",
    bio: String(data.bio ?? ""),
    photos: Array.isArray(data.photos) ? (data.photos as string[]) : [],
    privacySettings: (data.privacySettings as Profile["privacySettings"]) ?? {
      hidePhoto: false,
      hideContact: false,
      hideProfile: false,
    },
    preferences: (data.preferences as Profile["preferences"]) ?? {
      ageMin: 21,
      ageMax: 40,
      religions: [],
      locations: [],
    },
    matrimony: (data.matrimony as Profile["matrimony"]) ?? {},
    verification: {
      phone: verification.phone as string | undefined,
      phoneVerified: Boolean(verification.phoneVerified),
      emailVerified: Boolean(verification.emailVerified),
      idDocumentType: verification.idDocumentType as Profile["verification"]["idDocumentType"],
      idDocumentPreview: verification.idDocumentPreview as string | undefined,
      selfiePreview: verification.selfiePreview as string | undefined,
      educationDocPreview: verification.educationDocPreview as string | undefined,
      employmentDocPreview: verification.employmentDocPreview as string | undefined,
      submittedAt,
      rejectionReason: verification.rejectionReason as string | undefined,
    },
    onboardingStatus: (data.onboardingStatus as Profile["onboardingStatus"]) ?? "basic_registered",
    profileCompletion: Number(data.profileCompletion ?? 0),
    verified: Boolean(data.verified),
  };

  return normalizeProfile(profile);
}

export function profileToFirestore(
  profile: Profile,
  user: { name: string; email: string }
): Record<string, unknown> {
  const normalized = normalizeProfile(profile);
  const verification = normalized.verification;

  return sanitizeForFirestore({
    userId: normalized.userId,
    displayName: user.name,
    email: user.email,
    age: normalized.age,
    yearOfBirth: normalized.yearOfBirth,
    birthMonth: normalized.birthMonth,
    birthDay: normalized.birthDay ?? null,
    gender: normalized.gender,
    lookingFor: normalized.lookingFor,
    heightCm: normalized.heightCm,
    weightKg: normalized.weightKg,
    bodyType: normalized.bodyType,
    location: normalized.location,
    country: normalized.country ?? null,
    state: normalized.state ?? null,
    city: normalized.city ?? null,
    religion: normalized.religion,
    motherTongue: normalized.motherTongue ?? null,
    caste: normalized.caste ?? null,
    education: normalized.education,
    college: normalized.college ?? null,
    occupation: normalized.occupation,
    company: normalized.company ?? null,
    annualIncome: normalized.annualIncome ?? null,
    maritalStatus: normalized.maritalStatus,
    bio: normalized.bio,
    photos: normalized.photos,
    primaryPhotoUrl: normalized.photos[0] ?? "",
    privacySettings: normalized.privacySettings,
    preferences: normalized.preferences,
    matrimony: normalized.matrimony,
    verification: {
      phone: verification.phone ?? null,
      phoneVerified: verification.phoneVerified,
      emailVerified: verification.emailVerified,
      idDocumentType: verification.idDocumentType ?? null,
      idDocumentPreview: verification.idDocumentPreview ?? null,
      selfiePreview: verification.selfiePreview ?? null,
      educationDocPreview: verification.educationDocPreview ?? null,
      employmentDocPreview: verification.employmentDocPreview ?? null,
      submittedAt: isoToTimestamp(verification.submittedAt) ?? null,
      rejectionReason: verification.rejectionReason ?? null,
    },
    onboardingStatus: normalized.onboardingStatus,
    profileCompletion: normalized.profileCompletion,
    verified: normalized.verified,
    searchVisibility: !normalized.privacySettings.hideProfile,
    genderLookingFor: buildGenderLookingFor(normalized.gender, normalized.lookingFor),
  }) as Record<string, unknown>;
}
