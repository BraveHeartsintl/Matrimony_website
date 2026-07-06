export function formatStatCount(count: number): string {
  if (count <= 0) return "0";
  if (count >= 10000) {
    const rounded = Math.floor(count / 1000) * 1000;
    return `${rounded.toLocaleString("en-GB")}+`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  }
  return `${count.toLocaleString("en-GB")}+`;
}

export function formatVerifiedRate(verified: number, total: number): string {
  if (total <= 0) return "0%";
  return `${Math.round((verified / total) * 100)}%`;
}

export function formatRegionMembers(count: number): string {
  return formatStatCount(count);
}
