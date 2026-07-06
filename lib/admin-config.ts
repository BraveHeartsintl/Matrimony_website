/** Static admin credentials — shown on /admin/login; enter these to open the admin portal. */
export const ADMIN_CREDENTIALS = {
  name: "Platform Admin",
  email: "admin@ukmatrimony.co.uk",
  password: "admin123",
} as const;

/** @deprecated Use ADMIN_CREDENTIALS */
export const DEFAULT_ADMIN = ADMIN_CREDENTIALS;

export function matchesAdminCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
    password === ADMIN_CREDENTIALS.password
  );
}
