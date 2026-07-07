export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateAgeFromYearOfBirth(yearOfBirth: number): number {
  const currentYear = new Date().getFullYear();
  return Math.max(0, currentYear - yearOfBirth);
}

export function formatMaritalStatus(status: string): string {
  const labels: Record<string, string> = {
    never_married: "Single",
    divorced: "Divorced",
    widowed: "Widowed",
    separated: "Separated",
  };
  return labels[status] ?? status.replace(/_/g, " ");
}

export function formatBodyType(bodyType: string): string {
  const labels: Record<string, string> = {
    slim: "Slim",
    average: "Average",
    athletic: "Athletic",
    plus_size: "Plus Size",
  };
  return labels[bodyType] ?? bodyType;
}

export function formatGender(gender: string): string {
  const labels: Record<string, string> = {
    male: "Male",
    female: "Female",
    other: "Other",
  };
  return labels[gender] ?? gender;
}

export function formatInterestStatus(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    accepted: "Approved",
    declined: "Rejected",
  };
  return labels[status] ?? status;
}

export function interestStatusBadgeVariant(
  status: string
): "default" | "success" | "warning" | "accent" {
  if (status === "accepted") return "success";
  if (status === "declined") return "warning";
  return "default";
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}
