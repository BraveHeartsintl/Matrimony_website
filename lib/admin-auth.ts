const ADMIN_SESSION_KEY = "uk_matrimony_admin_session";

export const ADMIN_CREDENTIALS = {
  email: "admin@ukmatrimony.co.uk",
  password: "admin123",
};

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function adminLogin(email: string, password: string): boolean {
  if (
    email.toLowerCase() === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  ) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
