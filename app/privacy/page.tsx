import PublicLayout from "@/components/layout/PublicLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "We collect information you provide directly, including your name, email address, date of birth, profile details, photographs, and communication preferences. We also collect usage data such as pages visited, search queries, and device information.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "Your information is used to create and maintain your profile, facilitate matchmaking, enable communication between members, process subscriptions, improve our services, and comply with legal obligations under UK law.",
  },
  {
    title: "3. Data Sharing",
    content:
      "We do not sell your personal data. Profile information is shared with other members according to your privacy settings. We may share data with service providers who assist in operating our platform, subject to strict data processing agreements.",
  },
  {
    title: "4. Your Rights (GDPR)",
    content:
      "Under the UK GDPR, you have the right to access, rectify, erase, restrict processing, data portability, and object to processing of your personal data. You may exercise these rights by contacting us at privacy@ukmatrimony.co.uk.",
  },
  {
    title: "5. Data Security",
    content:
      "We implement industry-standard security measures including HTTPS encryption, encrypted password storage, and regular security audits. However, no method of transmission over the internet is 100% secure.",
  },
  {
    title: "6. Cookies",
    content:
      "We use essential cookies for authentication and session management, and analytics cookies to improve our service. You can manage cookie preferences through your browser settings.",
  },
  {
    title: "7. Data Retention",
    content:
      "We retain your data for as long as your account is active. Upon account deletion, personal data is removed within 30 days, except where retention is required by law.",
  },
  {
    title: "8. Contact",
    content:
      "For privacy-related enquiries, contact our Data Protection Officer at privacy@ukmatrimony.co.uk or write to us at 123 Kensington High Street, London, W8 6SH.",
  },
];

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted">Last updated: 1 January 2025</p>

          <p className="mt-6 text-muted leading-relaxed">
            UK Matrimony (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy.
            This policy explains how we collect, use, and safeguard your personal information in
            accordance with the UK General Data Protection Regulation (UK GDPR).
          </p>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <p className="mt-2 text-sm text-muted leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
