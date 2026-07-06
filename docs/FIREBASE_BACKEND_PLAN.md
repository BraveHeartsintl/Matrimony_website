# Firebase Backend Plan

This document summarizes how the UK Matrimony app loads and saves data after the full dynamic migration.

## Architecture

- **Hosting:** Next.js static export (`output: "export"`) on Firebase Hosting
- **Auth:** Firebase Authentication (email/password, phone OTP demo mode)
- **Data:** Cloud Firestore (client SDK)
- **Media:** Firebase Storage (profile photos, verification documents)
- **Runtime:** All member and admin data is fetched client-side after page load

## Service layer

| Service | Path | Purpose |
|---------|------|---------|
| Auth | `lib/firebase/services/auth.service.ts` | Login, register, logout, session |
| Profile | `lib/firebase/services/profile.service.ts` | User/profile CRUD, verification requests |
| Storage | `lib/firebase/services/storage.service.ts` | Photo and document uploads |
| Email | `lib/firebase/services/email.service.ts` | `sendEmailVerification()` |
| Phone | `lib/firebase/services/phone.service.ts` | OTP (demo mode via env) |
| Search | `lib/firebase/services/search.service.ts` | Browse and featured profiles |
| Favorite | `lib/firebase/services/favorite.service.ts` | `users/{uid}/favorites` |
| Interest | `lib/firebase/services/interest.service.ts` | `interests` collection |
| Message | `lib/firebase/services/message.service.ts` | Conversations and messages |
| Subscription | `lib/firebase/services/subscription.service.ts` | `subscriptions/{uid}` |
| Report / Contact | `lib/firebase/services/report.service.ts` | Reports and contact form |
| Admin | `lib/firebase/services/admin.service.ts` | Admin portal data and actions |
| Seed | `lib/firebase/services/seed.service.ts` | One-time demo profile import |

## React hooks

- `hooks/useSearchProfiles.ts`
- `hooks/useFavorites.ts`
- `hooks/useInterests.ts`
- `hooks/useConversations.ts`

## Firestore collections

- `users/{uid}` — account metadata, `role: admin` for admins
- `profiles/{uid}` — searchable profile fields, `searchVisibility`, `verified`
- `subscriptions/{uid}` — plan id and status
- `verificationRequests/{uid}` — pending identity review
- `interests/{from_to}` — sent interests
- `conversations/{id}` + `messages` subcollection
- `users/{uid}/favorites/{profileId}`
- `reports`, `contactMessages`, `platformStats`

## Seeding search data

Search is empty until profiles exist in Firestore. Options:

1. **Admin seed (recommended):** Admin portal → **Seed Demo Profiles** (uses `seed.service.ts`)
2. **Real registrations:** Each signup creates `users`, `profiles`, `subscriptions`

## Admin access

### Default credentials

| Field | Value |
|-------|-------|
| Email | `admin@ukmatrimony.co.uk` |
| Password | `admin123` |

Sign in at **`/admin/login`** with the credentials above. The portal opens immediately; Firebase admin is created/synced in the background for live Firestore data.

Optional: **`/admin/setup`** if you need to recreate the Firebase admin user manually.

## Deploy checklist

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
npm run build
firebase deploy --only hosting
```

## Environment

See `.env.example`. Phone demo mode: `NEXT_PUBLIC_FIREBASE_PHONE_DEMO_MODE=true` (default). Set to `false` on Blaze for real SMS.

## Static marketing content

About, Privacy, and Terms remain static copy. Homepage stats can use `platformStats/aggregate` when populated by admin.
