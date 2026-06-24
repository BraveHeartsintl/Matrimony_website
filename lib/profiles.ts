import { MOCK_PROFILES } from "./mock/profiles";
import { PROFILE_EXTRAS } from "./mock/profile-extras";
import type { FullProfile } from "./types";

export function getAllProfileIds(): string[] {
  return MOCK_PROFILES.map((profile) => profile.id);
}

export function getProfileById(id: string): FullProfile | undefined {
  const base = MOCK_PROFILES.find((profile) => profile.id === id);
  const extras = PROFILE_EXTRAS[id];

  if (!base || !extras) return undefined;

  return {
    ...base,
    photos: extras.photos,
    matrimony: extras.matrimony,
  };
}

export function getFullProfiles(): FullProfile[] {
  return getAllProfileIds()
    .map((id) => getProfileById(id))
    .filter((profile): profile is FullProfile => profile !== undefined);
}
