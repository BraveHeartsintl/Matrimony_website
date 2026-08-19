import { defineSecret, defineString } from "firebase-functions/params";

/**
 * SMTP mailbox used to send branded auth emails as UK Indian Matrimony.
 * Set SMTP_PASS with: `firebase functions:secrets:set SMTP_PASS`
 * Host / user / from-address are params (prompted on deploy, or in functions/.env).
 */
export const smtpPass = defineSecret("SMTP_PASS");

export const smtpHost = defineString("SMTP_HOST");
export const smtpPort = defineString("SMTP_PORT", { default: "587" });
export const smtpUser = defineString("SMTP_USER");

export const mailFromName = defineString("MAIL_FROM_NAME", {
  default: "UK Indian Matrimony",
});
export const mailFromAddress = defineString("MAIL_FROM_ADDRESS", {
  default: "hello@ukmatrimony.co.uk",
});
