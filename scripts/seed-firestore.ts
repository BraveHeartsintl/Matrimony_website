/**
 * One-time Firestore seed for demo search profiles.
 *
 * This static-export app seeds via the Admin portal (recommended):
 *   1. Create a Firebase Auth user for admin
 *   2. Set `users/{uid}.role` to `"admin"` in Firestore
 *   3. Sign in at `/admin/login` and click **Seed Demo Profiles**
 *
 * The seed logic lives in `lib/firebase/services/seed.service.ts` and imports
 * `MOCK_PROFILES` from `lib/mock/profiles.ts` only for seeding — not at runtime.
 */
export { isFirestoreSeeded, seedMockProfiles } from "../lib/firebase/services/seed.service";
