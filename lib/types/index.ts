export type Gender = "male" | "female" | "other";
export type MaritalStatus = "never_married" | "divorced" | "widowed" | "separated";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

export interface PrivacySettings {
  hidePhoto: boolean;
  hideContact: boolean;
  hideProfile: boolean;
}

export type BodyType = "slim" | "average" | "athletic" | "plus_size";

export interface Profile {
  userId: string;
  age: number;
  yearOfBirth: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  bodyType: BodyType;
  location: string;
  religion: string;
  education: string;
  occupation: string;
  maritalStatus: MaritalStatus;
  bio: string;
  photos: string[];
  privacySettings: PrivacySettings;
  preferences: {
    ageMin: number;
    ageMax: number;
    religions: string[];
    locations: string[];
  };
  profileCompletion: number;
  verified: boolean;
}

export interface SearchProfile extends Profile {
  id: string;
  name: string;
  email: string;
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
  toUserName: string;
  toUserPhoto: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export interface AuthSession {
  user: Omit<User, "password">;
  profile: Profile;
}
