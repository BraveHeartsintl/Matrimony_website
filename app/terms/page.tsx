import PublicLayout from "@/components/layout/PublicLayout";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By registering for or using UK Matrimony, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.",
  },
  {
    title: "2. Eligibility",
    content:
      "You must be at least 18 years old and legally able to enter into a binding contract to use our platform. You must provide accurate and truthful information in your profile.",
  },
  {
    title: "3. Account Responsibilities",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorised use.",
  },
  {
    title: "4. Acceptable Use",
    content:
      "You agree not to use the platform for harassment, fraud, impersonation, or any unlawful purpose. We reserve the right to suspend or terminate accounts that violate these terms.",
  },
  {
    title: "5. Subscriptions & Payments",
    content:
      "Premium features require a paid subscription. Prices are displayed in GBP. Subscriptions auto-renew unless cancelled. Refunds are handled in accordance with UK consumer protection law.",
  },
  {
    title: "6. Content & Intellectual Property",
    content:
      "You retain ownership of content you upload but grant us a licence to display it on the platform. All platform design, code, and branding remain our intellectual property.",
  },
  {
    title: "7. Limitation of Liability",
    content:
      "UK Matrimony facilitates connections but does not guarantee matches or outcomes. We are not liable for the conduct of members or any damages arising from use of the platform.",
  },
  {
    title: "8. Governing Law",
    content:
      "These terms are governed by the laws of England and Wales. Disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.",
  },
];

export default function TermsPage() {
  return (
    <PublicLayout>
      <Section variant="surface">
        <Container className="max-w-3xl">
          <SectionLabel>Legal</SectionLabel>
          <h1 className="font-display text-4xl font-bold text-foreground">Terms & Conditions</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: 1 January 2025</p>

          <p className="mt-6 leading-relaxed text-muted">
            Please read these Terms and Conditions carefully before using UK Matrimony. These terms
            constitute a legally binding agreement between you and UK Matrimony Ltd.
          </p>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{section.content}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </PublicLayout>
  );
}
