import { defineSecret, defineString } from "firebase-functions/params";

/**
 * Veriff secrets — set with:
 *   firebase functions:secrets:set VERIFF_API_KEY
 *   firebase functions:secrets:set VERIFF_SHARED_SECRET
 * Local emulator: functions/.secret.local (or PASTE_VERIFF_KEYS_HERE.env synced there).
 */
export const veriffApiKey = defineSecret("VERIFF_API_KEY");
export const veriffSharedSecret = defineSecret("VERIFF_SHARED_SECRET");

/** From Veriff Portal → Integration → API Keys (not a secret). */
export const veriffBaseUrl = defineString("VERIFF_BASE_URL", {
  default: "https://stationapi.veriff.com",
});
