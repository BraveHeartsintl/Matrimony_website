export type Gender = "male" | "female" | "other";
export type MaritalStatus = "never_married" | "divorced" | "widowed" | "separated";
export type LookingFor = "bride" | "groom";
export type OnboardingStatus =
  | "basic_registered"
  | "profile_completed"
  | "verification_pending"
  | "verified"
  | "rejected";
export type IdDocumentType = "aadhaar" | "passport" | "driving_license" | "voter_id";

export interface VerificationData {
  phone?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  idDocumentType?: IdDocumentType;
  idDocumentPreview?: string;
  selfiePreview?: string;
  educationDocPreview?: string;
  employmentDocPreview?: string;
  submittedAt?: string;
  rejectionReason?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  role?: "member" | "admin";
}

export interface PrivacySettings {
  hidePhoto: boolean;
  hideContact: boolean;
  hideProfile: boolean;
}

export type BodyType = "slim" | "average" | "athletic" | "plus_size";

export interface PartnerPreferences {
  ageMin: number;
  ageMax: number;
  religions: string[];
  locations: string[];
  heightMinCm?: number;
  heightMaxCm?: number;
  education?: string[];
  professions?: string[];
  lifestyle?: string[];
}

export interface Profile {
  userId: string;
  age: number;
  yearOfBirth: number;
  birthMonth: number;
  birthDay?: number;
  gender: Gender;
  lookingFor: LookingFor;
  heightCm: number;
  weightKg: number;
  bodyType: BodyType;
  location: string;
  country?: string;
  state?: string;
  city?: string;
  religion: string;
  motherTongue?: string;
  caste?: string;
  education: string;
  college?: string;
  occupation: string;
  company?: string;
  annualIncome?: string;
  maritalStatus: MaritalStatus;
  bio: string;
  photos: string[];
  privacySettings: PrivacySettings;
  preferences: PartnerPreferences;
  matrimony: Partial<MatrimonyDetails>;
  verification: VerificationData;
  onboardingStatus: OnboardingStatus;
  profileCompletion: number;
  verified: boolean;
}

export interface SearchProfile extends Profile {
  id: string;
  name: string;
  email: string;
}

export interface MatrimonyDetails {
  aboutMe: string;
  partnerExpectations: string;
  familyBackground: string;
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
  familyType?: string;
  familyValues?: string;
  diet: string;
  smoking: string;
  drinking: string;
  fitnessInterests?: string[];
  languages: string[];
  community: string;
  willingToRelocate: boolean;
  hobbies: string[];
  memberSince: string;
  lastActive: string;
}

export interface FullProfile extends SearchProfile {
  matrimony: MatrimonyDetails;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantPhoto: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  popular?: boolean;
}

export interface Interest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName?: string;
  fromUserPhoto?: string;
  toUserName: string;
  toUserPhoto: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export interface AuthSession {
  user: User;
  profile: Profile;
}
