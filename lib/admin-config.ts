/** Admin portal credentials — set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local / Vercel env vars. */
export const ADMIN_CREDENTIALS = {
  name: "Platform Admin",
  email: process.env.ADMIN_EMAIL ?? "admin@ukmatrimony.co.uk",
  password: process.env.ADMIN_PASSWORD ?? "admin123",
} as const;

/** @deprecated Use ADMIN_CREDENTIALS */
export const DEFAULT_ADMIN = ADMIN_CREDENTIALS;

export function matchesAdminCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
    password === ADMIN_CREDENTIALS.password
  );
}
