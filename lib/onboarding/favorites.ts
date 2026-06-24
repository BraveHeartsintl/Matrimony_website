const FAVORITES_KEY = "uk_matrimony_favorites";

export function getFavorites(userId: string): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(FAVORITES_KEY);
  if (!raw) return [];
  const all = JSON.parse(raw) as Record<string, string[]>;
  return all[userId] ?? [];
}

export function toggleFavorite(userId: string, profileId: string): string[] {
  const current = getFavorites(userId);
  const next = current.includes(profileId)
    ? current.filter((id) => id !== profileId)
    : [...current, profileId];

  const raw = localStorage.getItem(FAVORITES_KEY);
  const all: Record<string, string[]> = raw ? JSON.parse(raw) : {};
  all[userId] = next;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(all));
  return next;
}

export function isFavorite(userId: string, profileId: string): boolean {
  return getFavorites(userId).includes(profileId);
}
