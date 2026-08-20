import { createHmac, timingSafeEqual } from "node:crypto";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore, type Firestore } from "firebase-admin/firestore";
import { HttpsError, onCall, onRequest, type CallableRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import { appUrl } from "./planConfig";
import { veriffApiKey, veriffBaseUrl, veriffSharedSecret } from "./veriffConfig";

/** Lazy — must not run at module load (initializeApp lives in index.ts). */
function db(): Firestore {
  return getFirestore();
}

type VeriffDecisionStatus =
  | "approved"
  | "declined"
  | "resubmission_requested"
  | "expired"
  | "abandoned"
  | "review";

interface VeriffSessionResponse {
  status?: string;
  verification?: {
    id?: string;
    url?: string;
    sessionToken?: string;
    status?: string;
  };
}

interface VeriffDecisionPayload {
  status?: string;
  verification?: {
    id?: string;
    vendorData?: string | null;
    endUserId?: string | null;
    status?: VeriffDecisionStatus | string;
    reason?: string | null;
    code?: number | null;
    document?: {
      type?: string | null;
    } | null;
  };
}

function requireUid(request: CallableRequest): string {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "You must be signed in to do this.");
  }
  return uid;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "Member", lastName: "User" };
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function mapIdDocumentType(veriffType: string | null | undefined): string | null {
  if (!veriffType) return null;
  const t = veriffType.toLowerCase();
  if (t.includes("passport")) return "passport";
  if (t.includes("driving") || t.includes("license") || t.includes("licence")) return "driving_license";
  if (t.includes("id_card") || t.includes("national")) return "aadhaar";
  if (t.includes("residence") || t.includes("voter")) return "voter_id";
  return null;
}

function verifyVeriffSignature(rawBody: Buffer | string, signatureHeader: string | undefined): boolean {
  if (!signatureHeader) return false;
  const expected = createHmac("sha256", veriffSharedSecret.value())
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signatureHeader, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Creates a Veriff hosted verification session and returns the URL to open.
 * Document + selfie capture happen inside Veriff (replaces manual Phase 3 uploads).
 */
export const createVeriffSession = onCall(
  { secrets: [veriffApiKey] },
  async (request) => {
    const uid = requireUid(request);
    const userRecord = await getAuth().getUser(uid);
    const { firstName, lastName } = splitName(userRecord.displayName ?? "Member");

    const origin = appUrl.value().replace(/\/$/, "");
    const callback = `${origin}/onboarding/verify/?veriff=returned`;

    const body = {
      verification: {
        callback,
        vendorData: uid,
        person: {
          firstName,
          lastName,
        },
      },
    };

    const apiBase = veriffBaseUrl.value().replace(/\/$/, "");
    let response: Response;
    try {
      response = await fetch(`${apiBase}/v1/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-CLIENT": veriffApiKey.value(),
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      logger.error("Veriff session create network error", err);
      throw new HttpsError("unavailable", "Could not reach Veriff. Try again shortly.");
    }

    const payload = (await response.json()) as VeriffSessionResponse;
    if (!response.ok || !payload.verification?.id || !payload.verification?.url) {
      logger.error("Veriff session create failed", { status: response.status, payload });
      throw new HttpsError("internal", "Veriff could not start identity verification.");
    }

    const sessionId = payload.verification.id;
    const sessionUrl = payload.verification.url;

    await db().collection("profiles").doc(uid).set(
      {
        "verification.veriffSessionId": sessionId,
        "verification.veriffStatus": "started",
        updatedAt: FieldValue.serverTimestamp(),
        lastActiveAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await db().collection("verificationRequests").doc(uid).set(
      {
        userId: uid,
        name: userRecord.displayName ?? "",
        email: userRecord.email ?? "",
        veriffSessionId: sessionId,
        veriffStatus: "started",
        stage: "veriff_started",
        status: "pending",
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return { sessionId, sessionUrl };
  }
);

/**
 * Veriff decision webhook. Configure this URL in Veriff Portal → Integration → Webhooks.
 * After deploy: https://us-central1-<project-id>.cloudfunctions.net/veriffWebhook
 */
export const veriffWebhook = onRequest(
  { secrets: [veriffApiKey, veriffSharedSecret], cors: false },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const rawBody: Buffer =
      Buffer.isBuffer(req.rawBody) ? req.rawBody : Buffer.from(JSON.stringify(req.body ?? {}));

    const signature =
      (typeof req.headers["x-hmac-signature"] === "string"
        ? req.headers["x-hmac-signature"]
        : undefined) ??
      (typeof req.headers["X-HMAC-SIGNATURE"] === "string"
        ? req.headers["X-HMAC-SIGNATURE"]
        : undefined);

    const authClient =
      (typeof req.headers["x-auth-client"] === "string" ? req.headers["x-auth-client"] : undefined) ??
      (typeof req.headers["X-AUTH-CLIENT"] === "string" ? req.headers["X-AUTH-CLIENT"] : undefined);

    if (authClient && authClient !== veriffApiKey.value()) {
      logger.warn("Veriff webhook X-AUTH-CLIENT mismatch");
      res.status(401).send("Unauthorized");
      return;
    }

    if (!verifyVeriffSignature(rawBody, signature)) {
      logger.warn("Veriff webhook HMAC verification failed");
      res.status(401).send("Invalid signature");
      return;
    }

    let payload: VeriffDecisionPayload;
    try {
      payload = JSON.parse(rawBody.toString("utf8")) as VeriffDecisionPayload;
    } catch {
      res.status(400).send("Invalid JSON");
      return;
    }

    const verification = payload.verification;
    const uid = (verification?.vendorData || verification?.endUserId || "").trim();
    const decision = (verification?.status || "").toLowerCase();

    if (!uid || !decision) {
      logger.info("Veriff webhook ignored (missing uid/status)", { payload });
      res.status(200).json({ received: true, ignored: true });
      return;
    }

    const profileRef = db().collection("profiles").doc(uid);
    const requestRef = db().collection("verificationRequests").doc(uid);
    const reason = verification?.reason ? String(verification.reason) : null;
    const docType = mapIdDocumentType(verification?.document?.type ?? null);
    const now = FieldValue.serverTimestamp();

    try {
      if (decision === "approved") {
        await profileRef.set(
          {
            onboardingStatus: "verified",
            verified: true,
            "verification.veriffSessionId": verification?.id ?? null,
            "verification.veriffStatus": "approved",
            "verification.rejectionReason": null,
            "verification.submittedAt": new Date().toISOString(),
            ...(docType ? { "verification.idDocumentType": docType } : {}),
            updatedAt: now,
            lastActiveAt: now,
          },
          { merge: true }
        );
        await requestRef.set(
          {
            status: "approved",
            stage: "veriff_approved",
            veriffStatus: "approved",
            veriffSessionId: verification?.id ?? null,
            updatedAt: now,
            reviewedAt: now,
          },
          { merge: true }
        );
      } else if (decision === "declined") {
        await profileRef.set(
          {
            onboardingStatus: "rejected",
            verified: false,
            "verification.veriffSessionId": verification?.id ?? null,
            "verification.veriffStatus": "declined",
            "verification.rejectionReason": reason ?? "Identity verification was declined.",
            updatedAt: now,
            lastActiveAt: now,
          },
          { merge: true }
        );
        await requestRef.set(
          {
            status: "rejected",
            stage: "veriff_declined",
            veriffStatus: "declined",
            rejectionReason: reason,
            veriffSessionId: verification?.id ?? null,
            updatedAt: now,
            reviewedAt: now,
          },
          { merge: true }
        );
      } else if (decision === "resubmission_requested") {
        await profileRef.set(
          {
            onboardingStatus: "profile_completed",
            verified: false,
            "verification.veriffSessionId": verification?.id ?? null,
            "verification.veriffStatus": "resubmission_requested",
            "verification.rejectionReason":
              reason ?? "Please resubmit a clearer ID document and selfie.",
            updatedAt: now,
            lastActiveAt: now,
          },
          { merge: true }
        );
        await requestRef.set(
          {
            status: "pending",
            stage: "veriff_resubmission",
            veriffStatus: "resubmission_requested",
            rejectionReason: reason,
            veriffSessionId: verification?.id ?? null,
            updatedAt: now,
          },
          { merge: true }
        );
      } else {
        // review / expired / abandoned / started / submitted — keep pending
        await profileRef.set(
          {
            onboardingStatus: "verification_pending",
            "verification.veriffSessionId": verification?.id ?? null,
            "verification.veriffStatus": decision,
            updatedAt: now,
            lastActiveAt: now,
          },
          { merge: true }
        );
        await requestRef.set(
          {
            status: "pending",
            stage: `veriff_${decision}`,
            veriffStatus: decision,
            veriffSessionId: verification?.id ?? null,
            updatedAt: now,
          },
          { merge: true }
        );
      }

      logger.info("Veriff decision applied", { uid, decision, sessionId: verification?.id });
      res.status(200).json({ received: true });
    } catch (err) {
      logger.error("Failed to apply Veriff decision", { uid, decision, err });
      res.status(500).send("Handler failed");
    }
  }
);
