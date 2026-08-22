import { getAuth } from "firebase-admin/auth";
import { HttpsError, onCall, type CallableRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import nodemailer from "nodemailer";

import {
  mailFromAddress,
  mailFromName,
  smtpHost,
  smtpPass,
  smtpPort,
  smtpUser,
} from "./mailConfig";
import { appUrl } from "./planConfig";

/** Must match Firebase Console → Authentication → Authorized domains. */
const ALLOWED_ORIGINS = new Set([
  "https://ukmatrimony.co.uk",
  "https://www.ukmatrimony.co.uk",
  "https://matrimony-website-alpha.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
]);

function resolveOrigin(request: CallableRequest): string {
  const headerOrigin = request.rawRequest?.headers?.origin;
  if (typeof headerOrigin === "string") {
    const normalized = headerOrigin.replace(/\/$/, "");
    if (ALLOWED_ORIGINS.has(normalized)) {
      return normalized;
    }
  }
  return appUrl.value().replace(/\/$/, "");
}

function linkGenerationErrorMessage(err: unknown, origin: string): string {
  const message = err instanceof Error ? err.message : String(err);
  if (/TOO_MANY_ATTEMPTS/i.test(message)) {
    return "Too many verification attempts. Please wait 15 minutes, then try again.";
  }
  if (/allowlisted|authorized|continue/i.test(message)) {
    return `Could not create a verification link. Add "${new URL(origin).host}" in Firebase Console → Authentication → Authorized domains.`;
  }
  return "Could not create a verification link. Try again in a few minutes.";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function brandedVerifyUrl(firebaseLink: string, origin: string): string {
  const parsed = new URL(firebaseLink);
  const oobCode = parsed.searchParams.get("oobCode");
  if (!oobCode) {
    throw new HttpsError("internal", "Could not create a verification link.");
  }
  const url = new URL("/auth/verify-email/", origin);
  url.searchParams.set("oobCode", oobCode);
  return url.toString();
}

function verificationEmailHtml(verifyUrl: string, recipient: string): string {
  const safeUrl = escapeHtml(verifyUrl);
  const safeEmail = escapeHtml(recipient);
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f1ea;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#001030;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px 8px;color:#d4a85c;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">
                UK Indian Matrimony
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 0;color:#f8f0e0;font-size:26px;line-height:1.3;">
                Verify your email address
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 0;color:#a8b8cc;font-size:15px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
                Hello,<br /><br />
                Please confirm that <strong style="color:#f8f0e0;">${safeEmail}</strong> belongs to you so we can finish setting up your UK Indian Matrimony account.
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;" align="center">
                <a href="${safeUrl}" style="display:inline-block;background:#d4a85c;color:#001030;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;padding:14px 28px;border-radius:8px;">
                  Verify email address
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;color:#8094a8;font-size:13px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
                If the button does not work, copy and paste this link into your browser:<br />
                <a href="${safeUrl}" style="color:#d4a85c;word-break:break-all;">${safeUrl}</a>
                <br /><br />
                If you did not create this account, you can ignore this email.
                <br /><br />
                Thanks,<br />
                The UK Indian Matrimony team
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function verificationEmailText(verifyUrl: string, recipient: string): string {
  return [
    "UK Indian Matrimony",
    "",
    "Verify your email address",
    "",
    `Please confirm that ${recipient} belongs to you.`,
    "",
    "Open this link to verify:",
    verifyUrl,
    "",
    "If you did not create this account, you can ignore this email.",
    "",
    "Thanks,",
    "The UK Indian Matrimony team",
  ].join("\n");
}

/**
 * Sends a branded verification email from the UK Indian Matrimony mailbox.
 * The link points at our site (`/auth/verify-email/`), not firebaseapp.com.
 */
export const sendVerificationEmail = onCall(
  { secrets: [smtpPass] },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "You must be signed in to verify your email.");
    }

    const user = await getAuth().getUser(uid);
    if (!user.email) {
      throw new HttpsError("failed-precondition", "This account has no email address to verify.");
    }
    if (user.emailVerified) {
      return { alreadyVerified: true as const };
    }

    const origin = resolveOrigin(request);
    const continueUrl = `${origin}/onboarding/verify/`;

    let firebaseLink: string;
    try {
      firebaseLink = await getAuth().generateEmailVerificationLink(user.email, {
        url: continueUrl,
        handleCodeInApp: false,
      });
    } catch (err) {
      logger.error("Failed to generate email verification link", { err, continueUrl, origin });
      throw new HttpsError("internal", linkGenerationErrorMessage(err, origin));
    }

    const verifyUrl = brandedVerifyUrl(firebaseLink, origin);
    const fromName = mailFromName.value();
    const fromAddress = mailFromAddress.value();
    const port = Number(smtpPort.value());
    const smtpPortNum = Number.isFinite(port) ? port : 587;

    const transporter = nodemailer.createTransport({
      host: smtpHost.value(),
      port: smtpPortNum,
      secure: smtpPortNum === 465,
      requireTLS: smtpPortNum === 587,
      auth: {
        user: smtpUser.value(),
        pass: smtpPass.value(),
      },
    });

    try {
      await transporter.sendMail({
        from: `"${fromName}" <${fromAddress}>`,
        to: user.email,
        replyTo: fromAddress,
        subject: "Verify your email for UK Indian Matrimony",
        text: verificationEmailText(verifyUrl, user.email),
        html: verificationEmailHtml(verifyUrl, user.email),
      });
    } catch (err) {
      logger.error("Failed to send branded verification email", err);
      throw new HttpsError(
        "internal",
        "Could not send the verification email. Please try again shortly."
      );
    }

    return { alreadyVerified: false as const };
  }
);
